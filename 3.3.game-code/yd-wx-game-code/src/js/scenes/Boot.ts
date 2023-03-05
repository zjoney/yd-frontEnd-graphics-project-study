import SceneKeys from '../constant/SceneKeys';
import TextureKeys from '../constant/TextureKeys';

const { Scene } = Phaser;
interface TrailToData{
  fromX:number
  fromY:number
  toX:number
  toY:number
}
class Boot extends Scene {
  private star: Phaser.GameObjects.TileSprite;

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
    bg.setDisplaySize(w, h);
    this.star = this.add.tileSprite(centerX, centerY, w, h, 'star');
    // this.add.buttonContainer
    // 自定义事件
    this.events.on('trail-to', (data:TrailToData) => {
      const particles = this.add.particles('spark');
      const emitter = particles.createEmitter({
        x: w,
        y: 10,
        lifespan: 300,
        speed: { min: 100, max: 300 },
        angle: 300,
        quantity: 1,
        accelerationY: -300,
        gravityY: 10,
        scale: { start: 0.025, end: 0 },
        blendMode: 'ADD',
      });
      // 流行的起点和终点
      const xVales = [data.fromX, data.toX];
      const yVales = [data.fromY, data.toY];
      this.tweens.addCounter({
        from: 0,
        to: 1,
        ease: Phaser.Math.Easing.Sine.InOut,
        duration: 1000,
        // 样条曲线 给定一组控制点得到一条曲线 插值样条逼近样条
        onUpdate: (tween) => {
          const v = tween.getValue();
          const x = Phaser.Math.Interpolation.CatmullRom(xVales, v);
          const y = Phaser.Math.Interpolation.CatmullRom(yVales, v);
          emitter.setPosition(x, y);
        },

        onComplete: () => {
          emitter.explode(50, data.toX, data.toY);
          emitter.stop();
          this.time.delayedCall(1000, () => {
            particles.removeEmitter(emitter);
          });
        },
      });
    });
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.events.off('trail-to');
    });
  }

  update(time:number, delta:number) {
    super.update(time, delta);
    if (Phaser.Math.RND.between(0, 100) === 0) {
      const { width, height } = this.game.config;

      this.events.emit('trail-to', {
        fromX: <number>width,
        fromY: Phaser.Math.Between(0, <number>height / 2),
        toX: 0,
        toY: Phaser.Math.Between(<number>height / 2 + 50, <number>height),
      });
    }
    this.star.tilePositionY += 0.6;
  }
}

export default Boot;
