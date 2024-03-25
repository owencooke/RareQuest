import { Scene } from "phaser";

export class Boot extends Scene {
    constructor() {
        super("Boot");
    }

    preload() {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.
        // this.load.image('background', 'assets/bg.png');
    }

    create() {
        this.scene.start("Preloader");

        //Total Mini games played local storage variable
        if (!localStorage.getItem('miniGamesCompleted')) {
            localStorage.setItem('miniGamesCompleted', 0);
        }
        //Maze games played
        if (!localStorage.getItem('mazeGamesCompleted')) {
            localStorage.setItem('mazeGamesCompleted', 0);
        }
        //Pong games played
        if (!localStorage.getItem('pongGamesCompleted')) {
            localStorage.setItem('pongGamesCompleted', 0);
        }
        //Spy games played
        if (!localStorage.getItem('SpyGamesCompleted')) {
            localStorage.setItem('SpyGamesCompleted', 0);
        }
        //Jump games played
        if (!localStorage.getItem('jumpGamesCompleted')) {
            localStorage.setItem('jumpGamesCompleted', 0);
        }
        // Catcher games played
        if (!localStorage.getItem('catcherGamesCompleted')) {
            localStorage.setItem('catcherGamesCompleted', 0);
        }
        //Total doctor interactions
        if (!localStorage.getItem('totalDoctorInteractions')) {
            localStorage.setItem('totalDoctorInteractions', 0);
        }
        //Eye doctor interactions
        if (!localStorage.getItem('eyeDoctorInteractions')) {
            localStorage.setItem('numDoctorInteractions', 0);
        }
        //derma doctor interactions
        if (!localStorage.getItem('dermaDoctorInteractions')) {
            localStorage.setItem('dermaDoctorInteractions', 0);
        }
        //neuro doctor interactions
        if (!localStorage.getItem('neuroDoctorInteractions')) {
            localStorage.setItem('neuroDoctorInteractions', 0);
        }
        //pulm doctor interactions
        if (!localStorage.getItem('pulDoctorInteractions')) {
            localStorage.setItem('pulDoctorInteractions', 0);
        }
        //pedia doctor interactions
        if (!localStorage.getItem('pediaDoctorInteractions')) {
            localStorage.setItem('pediaDoctorInteractions', 0);
        }

    }
}

