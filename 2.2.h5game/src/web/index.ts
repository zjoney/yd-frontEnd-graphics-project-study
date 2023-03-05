import { AUTO, Game } from "phaser";
import SimpleGame from "./scenes/SimpleGame";
const scenes = [SimpleGame];
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
    scene: scenes
}
const game = new Game(config);
game.scene.start("SimpleGame");