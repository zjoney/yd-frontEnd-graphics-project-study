import { Scene, Physics } from "phaser";

export default class SimpleGame extends Scene {
    private player: Physics.Arcade.Sprite;
    private score: number;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
    private scoreText: Phaser.GameObjects.Text;
    constructor() {
        super("SimpleGame");
        this.score = 0;
    }
    public preload() {
        this.load.setBaseURL('http://192.168.64.2/');
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.spritesheet("dude", "assets/dude.png", { frameHeight: 48, frameWidth: 32 });
    }
    public create() {
        this.add.image(400, 300, "sky");
        const platform = this.physics.add.staticGroup();
        platform.create(400, 568, "ground").setScale(1.5, 1).refreshBody();
        platform.create(600, 400, "ground");
        platform.create(50, 250, "ground");
        platform.create(750, 220, "ground");

        const player = this.physics.add.sprite(100, 450, "dude");
        player.setBounce(0.2);
        player.setCollideWorldBounds(true);
        const stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate(function (child: Physics.Arcade.Image) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1,
        });
        this.cursors = this.input.keyboard.createCursorKeys();
        this.physics.add.collider(player, platform);
        this.physics.add.collider(stars, platform);
        this.physics.add.overlap(player, stars, this.collectStar, null, this);
        this.scoreText = this.add.text(16, 16, "Score：0", { fontize: "32px", fill: "#000" })
        this.player = player;
    }
    public update() {
        const { cursors, player } = this;
        if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play("left", true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.anims.play("right", true);
        } else {
            player.setVelocityX(0);
            player.anims.play("turn")
        }
        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }
    }
    private collectStar(_player = null, star: Physics.Arcade.Image) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score：${this.score}`)
    }
}