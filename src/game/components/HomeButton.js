import { startSpecialistScene } from "../scenes/hospital/Hospital";

function createHomeButton(scene, specialistName) {
    const homeButton = scene.add
        .image(scene.cameras.main.width - 32, 32, "home")
        .setScrollFactor(0)
        .setOrigin(1, 0)
        .setScale(0.2)
        .setInteractive();

    homeButton.on("pointerover", () => {
        scene.game.canvas.style.cursor = "pointer";
    });

    homeButton.on("pointerout", () => {
        scene.game.canvas.style.cursor = "default";
    });

    homeButton.on("pointerdown", () => {
        startSpecialistScene(scene, specialistName);
    });

    return homeButton;
}

export {
    createHomeButton
}