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
  if (!fs.existsSync(path.join(dir, 'gulpfile.js'))) {
    throw new Error(`${name} submodule missing: git submodule update --init --recursive`);
  }
  let commit = null;
  try {
    commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: dir, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    // No git metadata: la-docker-compose copies a local checkout without .git (and without any dist/,
    // which the bs5 gulp needs), so reuse the build made on that checkout when there is one
    if (fs.existsSync(stampFile)) {
      console.log(`${name}: no git metadata, reusing build of ${fs.readFileSync(stampFile, 'utf8').trim()}`);
      return build;
    }
    console.log(`${name}: no git metadata, building`);
  }
  const vars = `module.exports = ${JSON.stringify(buildvars, null, 2)};\n`;
  const stamp = `${commit} ${crypto.createHash('sha256').update(vars).digest('hex').slice(0, 16)}`;
  if (commit && fs.existsSync(stampFile) && fs.readFileSync(stampFile, 'utf8').trim() === stamp) {
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
  fs.writeFileSync(stampFile, `${stamp}\n`);
  return build;
}
