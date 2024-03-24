import { GameObjects } from "phaser";

const TEXTBOX_SETTINGS = {
    SPRITE_SHEET: "textbox",
    SPRITE_INDEX: 3,
    MARGIN_WIDTH: 0.05,
    FONT_FAMILY: "ArcadeClassic",
    FONT_SIZE: "24px",
    CHARACTERS_PER_SECOND: 40,
};

class TextBox extends GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Scale textbox sprite to fit screen width
        const { width: frameWidth, height: frameHeight } = this.scene.textures
            .get(TEXTBOX_SETTINGS.SPRITE_SHEET)
            .get(TEXTBOX_SETTINGS.SPRITE_INDEX);

        const { width: screenWidth, height: screenHeight } =
            this.scene.game.config;

        const scale =
            Math.min(screenWidth / frameWidth, screenHeight / frameHeight) -
            TEXTBOX_SETTINGS.MARGIN_WIDTH;

        this.width = frameWidth * scale;
        this.height = frameHeight * scale;

        // Place textbox component at bottom of screen
        this.x = (screenWidth - this.width) / 2;
        this.y = screenHeight - this.height;

        // Render background sprite
        this.bgSprite = this.scene.add.sprite(
            0,
            0,
            TEXTBOX_SETTINGS.SPRITE_SHEET,
            TEXTBOX_SETTINGS.SPRITE_INDEX
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
                fontFamily: TEXTBOX_SETTINGS.FONT_FAMILY,
                fontSize: TEXTBOX_SETTINGS.FONT_SIZE,
                fill: "black",
                wordWrap: { width: this.width * 0.9 },
            }
        );
        this.add(this.text);

        this.setVisible(false);
    }

    displayDialogue(text) {
        this.text.setText("");

        // Setup typewriting animation
        let index = 0;
        this.typingTimer = this.scene.time.addEvent({
            delay: 1000 / TEXTBOX_SETTINGS.CHARACTERS_PER_SECOND,
            callback: () => {
                this.text.setText(text.substring(0, index + 1));
                index++;

                // If all characters are displayed, stop the timer
                if (index === text.length) {
                    this.typingTimer.destroy();
                }
            },
            callbackScope: this,
            loop: true,
        });

        this.setVisible(true);
    }

    hideDialogue() {
        if (this.typingTimer) {
            this.typingTimer.destroy();
        }
        this.setVisible(false);
    }
}

export default TextBox;

