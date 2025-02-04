import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  private debounceSubject = new Subject<any>();

  title = 'animal-farm-front';
  animals: any[] = [];
  animatingAnimalId: number | null = null; // Track which animal is animating
  showThanksText: number | null = null; // Track which animal shows +1 Thanks
  showFoodAnimation: boolean = false;
  foodImage: string = '';

  showHappyImage: boolean = false;
  isSecondImageVisible: boolean = false;

  private audioContext: AudioContext | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  isPlaying = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAnimals();
    this.fetchBidzinaStatus();

    // Listen to the debounce subject and handle feeding
    this.debounceSubject
      .pipe(
        debounceTime(900),
        switchMap((animal) => this.apiService.feedAnimal(animal.id))
      )
      .subscribe({
        next: (data) => {
          this.getAnimals();
          this.showThanksText = data.animalId;
        },
        error: (error) => {
          console.error('Error feeding animal:', error);
        },
      });
  }

  fetchBidzinaStatus() {
    const observable = this.apiService.getBidzinaStatus();
    console.log('Returned Observable:', observable);
    observable?.subscribe({
      next: (data) => {
        if (data && data.status) {
          this.isSecondImageVisible = data.status === 'putin';
        } else {
          console.error('Invalid data format:', data);
        }
      },
      error: (error) => {
        console.error('Error fetching Bidzina status:', error);
      },
    });
  }

  // Fetch animals from the backend
  getAnimals() {
    this.apiService.getAnimals().subscribe({
      next: (data) => {
        this.animals = data;
        console.log('API Data:', data);
      },
      error: (error) => {
        console.error('Error fetching animals:', error);
      },
    });
  }

  feedAnimal(animal: any) {
    this.animatingAnimalId = animal.id;
    this.showFoodAnimation = true;

    // Set the correct food image based on animal type
    this.foodImage = animal.type === 'Mammal' ? 'hay.png' : 'corn.png';

    this.apiService.feedAnimal(animal.id).subscribe({
      next: () => {
        this.getAnimals();
        this.showThanksText = animal.id;

        setTimeout(() => {
          this.showHappyImage = true;
        }, 500);

        setTimeout(() => {
          this.showFoodAnimation = false;
          this.animatingAnimalId = null;
          this.showThanksText = null;
        }, 1000);

        setTimeout(() => {
          this.showHappyImage = false;
        }, 2000);
      },
      error: (error) => {
        console.error('Error feeding animal:', error);
      },
    });
  }

  // Toggle between the images when clicked
  toggleImage(): void {
    this.apiService.toggleBidzinaStatus().subscribe({
      next: (data) => {
        this.isSecondImageVisible = data.status === 'putin';
        if (this.isPlaying) {
          this.stopMusic();
          this.playMusic();
        }
      },
      error: (error) => {
        console.error('Error toggling Bidzina status:', error);
      },
    });
  }

  async playMusic() {
    const musicFile = this.isSecondImageVisible
      ? 'The-Imperial-March.mp3'
      : 'saqartvelo.mp3';

    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.sourceNode) {
      this.stopMusic();
    }

    try {
      const response = await fetch(musicFile);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.audioBuffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(0);
      this.isPlaying = true;

      this.sourceNode.onended = () => {
        this.isPlaying = false;
      };
    } catch (error) {
      console.error('Error playing music:', error);
    }
  }

  stopMusic() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.isPlaying = false;
  }

  toggleMusic() {
    this.isPlaying ? this.stopMusic() : this.playMusic();
  }
}
