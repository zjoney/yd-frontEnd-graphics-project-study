import SceneKeys from '../constant/SceneKeys';
import TextureKeys from '../constant/TextureKeys';

const { Scene } = Phaser;

class Preloader extends Scene {
  constructor() {
    super(SceneKeys.Preloader);
  }

  preload() {
    this.load.image(TextureKeys.Background, 'assets/bgmenu-sheet0-back.png');
  }

  create() {
    console.log('🐻', '预加载资源开始。。。。');
    this.scene.start(SceneKeys.Boot);
  }
}

export default Preloader;
