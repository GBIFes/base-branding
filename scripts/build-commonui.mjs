// Builds an ALA commonui git submodule (commonui-bs3-2019, commonui-bs5-2019) into <submodule>/build/.
//
// ALA no longer commits build/ to these repos, so we run their gulp build ourselves. The build is
// cached: <submodule>/build/.built-from records the submodule commit and the buildvars it was built
// with, and anything else (a submodule bump, a settings change) triggers a clean rebuild.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';
import settings from '../app/js/settings.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Values the commonui gulpfiles substitute (==homeDomain==, ...) in their own html, from our settings
export const buildvars = {
  homeDomain: settings.mainLAUrl,
  signUpURL: `${settings.services.cas.url}/userdetails/registration/createAccount`,
  profileURL: `${settings.services.cas.url}/userdetails/myprofile`,
  fathomID: ''
};

const run = (cmd, args, cwd) => execFileSync(cmd, args, { cwd, stdio: 'inherit' });

// Files the build writes into the submodule: buildvars.js and package-lock.json are ours, and npm also
// rewrites the yarn.lock upstream tracks. Put back the tracked ones and delete the rest, so the
// submodule stays pristine and later checkouts of other commits can't conflict with them.
const generated = ['buildvars.js', 'package-lock.json', 'yarn.lock'];
const restoreGenerated = dir => generated.forEach(f => {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', '--', f], { cwd: dir, stdio: 'ignore' });
    execFileSync('git', ['checkout', '--', f], { cwd: dir, stdio: 'ignore' });
  } catch {
    fs.rmSync(path.join(dir, f), { force: true });
  }
});

// Puts the submodule (and its nested ones) at the commit this repo pins, so a plain `git pull`
// is enough: nobody has to remember `git submodule update --init --recursive`. The pin is read
// from the index, so a submodule bump that was `git add`-ed is kept. COMMONUI_SYNC=0 disables it.
function syncSubmodule(name) {
  if (process.env.COMMONUI_SYNC === '0') return;
  let status;
  try {
    status = execFileSync('git', ['submodule', 'status', '--recursive', '--', name],
      { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString();
  } catch {
    return; // not a git checkout (e.g. la-docker-compose copies the sources without .git)
  }
  const stale = status.split('\n').filter(l => /^[-+U]/.test(l));
  if (!stale.length) return;
  console.log(`${name}: not at the pinned commit, syncing (git add ${name} to keep a different one)`);
  stale.forEach(l => console.log(`  ${l}`));
  restoreGenerated(path.join(root, name));
  run('git', ['submodule', 'update', '--init', '--recursive', '--', name], root);
}

/**
 * @param {string} name     submodule directory (e.g. 'commonui-bs3-2019')
 * @param {string} gulpTask gulp task that produces build/
 * @param {string} [lock]   package-lock.json kept in this repo (scripts/locks/) for submodules without one
 * @returns {string} absolute path of <submodule>/build
 */
export function buildCommonui(name, gulpTask, lock) {
  const dir = path.join(root, name);
  const build = path.join(dir, 'build');
  const stampFile = path.join(build, '.built-from');
  const built = () => fs.existsSync(stampFile) && ['css', 'js'].every(d => fs.existsSync(path.join(build, d)));
  syncSubmodule(name);
  if (!fs.existsSync(path.join(dir, 'gulpfile.js'))) {
    throw new Error(`${name} submodule missing: git submodule update --init --recursive`);
  }
  let commit = null;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    // No git metadata: la-docker-compose copies a local checkout without .git (and without any dist/,
    // which the bs5 gulp needs), so reuse the build made on that checkout when there is one
    if (built()) {
      console.log(`${name}: no git metadata, reusing build of ${fs.readFileSync(stampFile, 'utf8').trim()}`);
      return build;
    }
    console.log(`${name}: no git metadata, building`);
  }
  const vars = `module.exports = ${JSON.stringify(buildvars, null, 2)};\n`;
  const stamp = `${commit} ${crypto.createHash('sha256').update(vars).digest('hex').slice(0, 16)}`;
  if (commit && built() && fs.readFileSync(stampFile, 'utf8').trim() === stamp) {
    console.log(`${name}: build up to date (${commit.slice(0, 7)})`);
    return build;
  }

  console.log(`${name}: building ${commit ? commit.slice(0, 7) : ''} with gulp ${gulpTask}`);
  fs.writeFileSync(path.join(dir, 'buildvars.js'), vars);
  if (lock) fs.copyFileSync(path.join(root, 'scripts/locks', lock), path.join(dir, 'package-lock.json'));
  const hasLock = fs.existsSync(path.join(dir, 'package-lock.json'));
  fs.rmSync(build, { recursive: true, force: true });
  run('npm', [hasLock ? 'ci' : 'install', '--no-audit', '--no-fund'], dir);
  run('npx', ['gulp', gulpTask], dir);
  restoreGenerated(dir);
  fs.writeFileSync(stampFile, `${stamp}\n`);
  return build;
}
