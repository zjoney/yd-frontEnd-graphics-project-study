import Preloader from './scenes/Preloader';
import Boot from './scenes/Boot';
export default class Main {
    constructor() {
        this.config = {};
        const { CANVAS, Game } = Phaser;
        const { screenWidth: width, screenHeight: height } = wx.getSystemInfoSync();
        console.log('游戏初始化', window.canvas);
        console.log('微信开发环境', wx);
        console.log('游戏引擎', Phaser);
        console.log('额外仓库', rxjs.Subject);
        this.config = {
            type: CANVAS,
            width,
            height,
            // antialias: true,
            parent: null,
            scene: [Preloader, Boot],
            radio: window.devicePixelRatio,
            canvas: window.canvas,
        };
        const game = new Game(this.config);
    }
}
