import TextBox from "./TextBox";

const BUTTON_FONT_SIZE = 64;

const buttonNavStyle = {
    fontFamily: "Impact",
    fontSize: `${BUTTON_FONT_SIZE}px`,
    fill: "white",
};

class Dialogue extends TextBox {
    constructor(scene, dialogue) {
        super(scene);
        this.dialogue = dialogue;
        this.currentIndex = 1;

        // Create forward button
        this.forwardButton = this.scene.add.text(
            this.x + this.width - BUTTON_FONT_SIZE / 2 - 4,
            this.y + (this.height - BUTTON_FONT_SIZE) / 2,
            ">",
            buttonNavStyle
        );
        this.forwardButton.setInteractive();
        this.forwardButton.on("pointerdown", this.advance, this);
        this.forwardButton.setDepth(this.depth + 1);

        // Create back button
        this.backButton = this.scene.add.text(
            this.x,
            this.y + (this.height - BUTTON_FONT_SIZE) / 2,
            "<",
            buttonNavStyle
        );
        this.backButton.setInteractive();
        this.backButton.on("pointerdown", this.goBack, this);
        this.backButton.setDepth(this.depth + 1);

        // Initially hide buttons
        this.hideButtons();
    }

    start() {
        this.displayDialogue();
    }

    displayDialogue() {
        const { name, text } = this.dialogue[this.currentIndex];
        super.displayDialogue(`${name}:\n\t\t\t\t ${text}`);
        this.showButtons();
    }

    advance() {
        if (this.currentIndex < this.dialogue.length - 1) {
            this.currentIndex++;
            this.displayDialogue();
        } else {
            this.hideButtons();
            this.hideDialogue();
            this.destroy();
        }
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.displayDialogue();
        }
    }

    hideButtons() {
        this.forwardButton.setVisible(false);
        this.backButton.setVisible(false);
    }

    showButtons() {
        this.forwardButton.setVisible(true);
        if (this.currentIndex > 0) {
            this.backButton.setVisible(true);
        }
    }
}

/**
 * Start a dialogue sequence.
 *
 * @param {Phaser.Scene} scene - The Phaser scene in which to start the dialogue.
 * @param {Object[]} script - An array of dialogue objects representing the conversation.
 *                            Each object should have 'name' and 'text' properties.
 *                            Example: [{ name: "Character A", text: "Hello!" }, ...]
 * @returns {void}
 */
function startDialogue(scene, script) {
    const dialog = new Dialogue(scene, script);
    scene.add.existing(dialog);
    dialog.start();
}

export { startDialogue, Dialogue };

