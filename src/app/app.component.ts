import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'animal-farm-front';
  animals: any[] = [];
  animatingAnimalId: number | null = null; // Track which animal is animating
  showThanksText: number | null = null; // Track which animal shows +1 Thanks
  showFoodAnimation: boolean = false;

  showHappyImage: boolean = false;
  isSecondImageVisible: boolean = false; // Start with the first image (napoleon-default.jpg)

  // foodTarget: { x: number; y: number } | null = null;
  // foodAnimationLeft: number = 0;
  // foodAnimationTop: number = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.getAnimals();
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

  // Handle feeding an animal
  // feedAnimal(id: number) {
  //   // Start animation
  //   this.animatingAnimalId = id;

  //   this.apiService.feedAnimal(id).subscribe({
  //     next: () => {
  //       console.log(`Animal with ID ${id} fed successfully.`);
  //       // Re-fetch animals to get the updated "thanks" count
  //       this.getAnimals();

  //       this.showThanksText = id;
  //       // Remove animation after 1 second
  //       setTimeout(() => {
  //         this.animatingAnimalId = null;
  //         this.showThanksText = null;
  //       }, 6000);
  //     },
  //     error: (error) => {
  //       console.error('Error feeding animal:', error);
  //     },
  //   });
  // }

  feedAnimal(animalId: number) {
    // Animate food
    this.animatingAnimalId = animalId;
    // this.showThanksText = animalId;
    this.showFoodAnimation = true;

    this.apiService.feedAnimal(animalId).subscribe({
      next: () => {
        this.getAnimals();
        this.showThanksText = animalId;

        // this.showHappyImage = true;
        setTimeout(() => {
          this.showHappyImage = true;
        }, 500);

        setTimeout(() => {
          this.showFoodAnimation = false;
          this.animatingAnimalId = null;
          this.showThanksText = null;
          // this.showHappyImage = false;
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
    this.isSecondImageVisible = !this.isSecondImageVisible;
  }
}

// ngOnInit() {
//   this.apiService.getAnimals().subscribe({
//     next: (data) => {
//       this.animals = data;
//       console.log('API Data:', data);
//     },
//     error: (error) => {
//       console.error('Error fetching data:', error);
//     },
//     complete: () => {
//       console.log('API request completed');
//     },
//   });
// }
