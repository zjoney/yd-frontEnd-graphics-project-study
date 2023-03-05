import { AUTO, Game, Scene } from "phaser";

class Demo extends Scene {
    constructor() {
        super("demo");
    }
    public preload() {
        this.load.setBaseURL('http://labs.phaser.io');
        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('red', 'assets/particles/red.png');
    }
    public create() {
        this.add.image(400, 300, "sky");
        const particles = this.add.particles("red");
        const emitter = particles.createEmitter({
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: "ADD"
        });
        const logo = this.physics.add.image(400, 100, "logo");
        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);
        emitter.startFollow(logo);
    }
}
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 800,
    height: 600,
    parent: "main",
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 200
            }
        }
    },
    scene: Demo
}
const game = new Game(config);