// eslint-disable-next-line import/extensions
import './js/libs/weapp-adapter';
// eslint-disable-next-line import/extensions
import './js/libs/symbol';
import './js/runtime/phaser.min';
// @ts-ignore
import * as rxjs from './js/runtime/rxjs.umd.min';
import Main from './js/main';
// @ts-ignore
window.rxjs = rxjs;
// eslint-disable-next-line no-new
new Main();
