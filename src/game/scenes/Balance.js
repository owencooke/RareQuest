import { Scene } from "phaser";

export class Balance extends Scene {
    constructor () {
        super({
            key: "Balance"
        });
    }

    create() {
        this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, "bg").setDisplaySize(this.cameras.main.displayWidth - 200, this.cameras.main.displayHeight - 200)
    }
}