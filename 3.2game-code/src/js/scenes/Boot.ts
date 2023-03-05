import SceneKeys from '../constant/SceneKeys';
import TextureKeys from '../constant/TextureKeys';

const { Scene } = Phaser;

class Boot extends Scene {
  constructor() {
    super(SceneKeys.Boot);
  }

  create() {
    console.log('🐻', '主场景渲染');
    const { width, height } = this.game.config;
    const w = <number>width;
    const h = <number>height;
    const centerX = w / 2;
    const centerY = h / 2;
    console.log('屏幕尺寸', centerX, centerY);
    const bg = this.add.image(centerX, centerY, TextureKeys.Background);
  }
}

export default Boot;
