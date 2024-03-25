import { Scene } from "phaser";
import { startDialogue } from "../components/Dialogue";

export class Story extends Scene {
    constructor() {
        super("Story");
    }

    create() {
        // BACKGROUND
        const background = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'background');
        background.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

        // Hardcoded dialogue text
        const dialogueScript = [
            {
                "name": "Narrator",
                "text": "In a colorful neighborhood where the trees were always filled with the songs of birds and every house had a different color door, lived a young boy named Sam. Sam had the biggest heart and the kindest smile, making friends everywhere he went."
            },
            {
                "name": "Narrator",
                "text": "But Sam faced some challenges that not everyone could see. Imagine feeling so tired when you wake up that it seems like you've spent the night running instead of sleeping. That's how Sam felt every morning. No matter how early he went to bed, he always felt like he needed just a few more hours of sleep."
            },
            {
                "name": "Narrator",
                "text": "Sam also had times when his body would ache for no reason. It was as if he had played in the biggest soccer game of his life without actually playing. These aches would come and go, making it hard for Sam to join his friends in their playground adventures."
            },
            {
                "name": "Narrator",
                "text": "Get on this journey of discovering the challenges Sam has to face."
            },
            {
                "name": "Narrator",
                "text": "Based on what you know about Sam, find the doctor in the city that can help him."
            }
        ];

        // Start the dialogue
        startDialogue(this, dialogueScript, () => {
            // Callback function to transition to the next scene after the dialogue ends
            this.scene.start("City"); // Replace "NextSceneName" with your actual scene name
        });
    }
}

