import { GameObjects } from "phaser";

const TXTBOX_SPRITE_SHEET = "textbox";
const TXTBOX_SPRITE_IDX = 3;
const TXTBOX_MARGIN_WIDTH = 0.1;

class TextBox extends GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Scale textbox sprite to fit screen width
        const { width: frameWidth, height: frameHeight } = this.scene.textures
            .get(TXTBOX_SPRITE_SHEET)
            .get(TXTBOX_SPRITE_IDX);

        const { width: screenWidth, height: screenHeight } =
            this.scene.game.config;

        const scale =
            Math.min(screenWidth / frameWidth, screenHeight / frameHeight) -
            TXTBOX_MARGIN_WIDTH;

        this.width = frameWidth * scale;
        this.height = frameHeight * scale;

        // Place textbox component at bottom of screen
        this.x = (screenWidth - this.width) / 2;
        this.y = screenHeight - this.height;

        // Render background sprite
        this.bgSprite = this.scene.add.sprite(
            0,
            0,
            TXTBOX_SPRITE_SHEET,
            TXTBOX_SPRITE_IDX
        );
        this.bgSprite.setOrigin(0);
        this.bgSprite.displayWidth = this.width;
        this.bgSprite.displayHeight = this.height;
        this.add(this.bgSprite);

        // Style text within textbox
        this.text = this.scene.add.text(
            this.width * 0.05,
            this.height * 0.25,
            "",
            {
                fontFamily: "ArcadeClassic",
                fontSize: "32px",
                fill: "black",
                wordWrap: { width: this.width * 0.9 },
            }
        );
        this.add(this.text);

        this.setVisible(false);
    }

    displayDialogue(text) {
        this.text.setText(text);
        this.setVisible(true);
    }

    hideDialogue() {
        this.setVisible(false);
    }
}

export default TextBox;

