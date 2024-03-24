import { GameObjects } from "phaser";

const TEXTBOX_SETTINGS = {
    SPRITE_SHEET: "textbox",
    SPRITE_INDEX: 3,
    MARGIN_WIDTH: 0.05,
    FONT_FAMILY: "Arial Black",
    FONT_SIZE: "24px",
    CHARACTERS_PER_SECOND: 40,
};

class TextBox extends GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Original initialization code...
        const { width: frameWidth, height: frameHeight } = this.scene.textures
            .get(TEXTBOX_SETTINGS.SPRITE_SHEET)
            .get(TEXTBOX_SETTINGS.SPRITE_INDEX);
        const { width: screenWidth, height: screenHeight } = this.scene.game.config;
        const scale = Math.min(screenWidth / frameWidth, screenHeight / frameHeight) - TEXTBOX_SETTINGS.MARGIN_WIDTH;
        this.baseWidth = frameWidth * scale;
        this.baseHeight = frameHeight * scale;

        // Adjusted to set initial position and size
        this.setSize(this.baseWidth, this.baseHeight);
        this.setPosition((screenWidth - this.baseWidth) / 2, screenHeight - this.baseHeight);

        // Render background sprite
        this.bgSprite = this.scene.add.sprite(0, 0, TEXTBOX_SETTINGS.SPRITE_SHEET, TEXTBOX_SETTINGS.SPRITE_INDEX);
        this.bgSprite.setOrigin(0);
        this.bgSprite.displayWidth = this.baseWidth;
        this.bgSprite.displayHeight = this.baseHeight;
        this.add(this.bgSprite);

        // Style text within textbox
        this.text = this.scene.add.text(this.baseWidth * 0.05, this.baseHeight * 0.25, "", {
            fontFamily: TEXTBOX_SETTINGS.FONT_FAMILY,
            fontSize: TEXTBOX_SETTINGS.FONT_SIZE,
            fill: "white",
            wordWrap: { width: this.baseWidth * 0.9 },
        });
        this.add(this.text);

        this.setVisible(false);
    }

    displayDialogue(text) {
        this.text.setText(text); // Temporarily set text to calculate height

        // Calculate text height and adjust container dynamically
        const textHeight = this.calculateTextHeight(this.text, this.baseWidth * 0.9);
        this.adjustHeight(textHeight);

        this.text.setText(""); // Clear text to start typewriting effect

        // Typewriting animation setup...
        let index = 0;
        this.typingTimer = this.scene.time.addEvent({
            delay: 1000 / TEXTBOX_SETTINGS.CHARACTERS_PER_SECOND,
            callback: () => {
                this.text.setText(text.substring(0, index + 1));
                index++;
                if (index === text.length) {
                    this.typingTimer.destroy();
                }
            },
            callbackScope: this,
            loop: true,
        });

        this.setVisible(true);
    }

    adjustHeight(textHeight) {
        const padding = this.baseHeight * 0.25;
        const newHeight = textHeight + padding * 2;

        // Adjust the height
        this.setSize(this.baseWidth, newHeight);
        this.bgSprite.displayHeight = newHeight;

        // Update position to stay at bottom
        const screenHeight = this.scene.game.config.height;
        this.y = screenHeight - newHeight;
    }

    calculateTextHeight(textObject, wrapWidth) {
        const words = textObject.text.split(' ');
        let line = '';
        let height = 0;
        const lineHeight = parseInt(textObject.style.fontSize, 10) + 4; // Adjust based on actual font

        words.forEach(word => {
            const testLine = line + word + ' ';
            const testWidth = textObject.context.measureText(testLine).width;
            if (testWidth > wrapWidth && line !== '') {
                line = word + ' ';
                height += lineHeight;
            } else {
                line = testLine;
            }
        });

        height += lineHeight; // Add height for the last line
        return height;
    }

    hideDialogue() {
        if (this.typingTimer) {
            this.typingTimer.destroy();
        }
        this.setVisible(false);
    }
}

export default TextBox;