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
        this.currentIndex = 0;

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

    displayDialogue(isAnimated) {
        this.hideDialogue();
        const { name, text } = this.dialogue[this.currentIndex];
        const dialogue = `${name}:\n ${text}`;
        if (isAnimated) {
            super.displayDialogue(dialogue);
        } else {
            super.displayStaticDialogue(dialogue);
        }
        this.forwardButton.setVisible(this.currentIndex < this.dialogue.length);
        this.backButton.setVisible(this.currentIndex > 0);
    }

    advance() {
        if (this.typingTimer?.loop) {
            this.typingTimer.destroy();
            this.typingTimer = null;
            this.displayDialogue(false);
        } else {
            if (this.currentIndex < this.dialogue.length - 1) {
                this.currentIndex += 1;
                this.displayDialogue(true);
            } else {
                this.end();
            }
        }
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex -= 1;
            this.displayDialogue(false);
        }
    }

    hideButtons() {
        this.forwardButton.setVisible(false);
        this.backButton.setVisible(false);
    }

    end() {
        this.hideButtons();
        this.hideDialogue();
        this.scene.events.emit("dialogueComplete");
        this.destroy();
    }
}

/**
 * Start a dialogue sequence.
 *
 * @param {Phaser.Scene} scene - The Phaser scene in which to start the dialogue.
 * @param {Object[]} script - An array of dialogue objects representing the conversation.
 *                            Each object should have 'name' and 'text' properties.
 *                            Example: [{ name: "Character A", text: "Hello!" }, ...]
 * @param {Function} callback - A function to be called when the dialogue sequence is complete.
 *                              This function will be invoked once, after the dialogue ends.
 * @returns {void}
 */
function startDialogue(scene, script, callback) {
    const dialog = new Dialogue(scene, script);
    scene.add.existing(dialog);
    dialog.start();
    scene.events.once("dialogueComplete", callback);
}

export { startDialogue, Dialogue };

