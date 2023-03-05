//只能取得类型 真实的某个方法 window.Phaser
import { Types } from 'phaser';
import Preloader from './scenes/Preloader';
import Boot from './scenes/Boot';
/**
 * 游戏主函数
 */
interface YdGame extends Types.Core.GameConfig {
  radio?: number;
}
export default class Main {
  private readonly config: YdGame = {};
  constructor() {
    const { CANVAS, Game } = Phaser;
    const { screenWidth: width, screenHeight: height } = wx.getSystemInfoSync();
    console.log('游戏初始化', window.canvas);
    console.log('微信开发环境', wx);
    console.log('游戏引擎', Phaser);
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
