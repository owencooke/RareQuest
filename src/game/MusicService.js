export class MusicService {
    constructor(scene) {
        if (!MusicService.instance) {
            this.backgroundMusic = scene.sound.add('backgroundMusic', { loop: true });
            this.isPlaying = false;
            this.resumePosition = 0; // Track the playback position
            MusicService.instance = this;
        }
        return MusicService.instance;
    }

    play() {
        if (!this.isPlaying) {
            // Resume from the previous playback position if available
            this.backgroundMusic.play({ seek: this.resumePosition });
            this.isPlaying = true;
        }
    }

    stop() {
        if (this.isPlaying) {
            // Pause the music and store the playback position
            this.resumePosition = this.backgroundMusic.seek;
            this.backgroundMusic.stop();
            this.isPlaying = false;
        }
    }
}

MusicService.instance = null;