// Bootstrap 3 base: builds the ALA commonui-bs3-2019 submodule into commonui-bs3-2019/build/,
// which vite.config.js copies into dist/{css,js,fonts}. Runs before `npm run dev` and `npm run build`.
import { buildCommonui } from './build-commonui.mjs';

buildCommonui('commonui-bs3-2019', 'build', 'commonui-bs3-2019.package-lock.json');
