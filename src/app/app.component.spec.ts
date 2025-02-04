import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockApiService: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    mockApiService = jasmine.createSpyObj('ApiService', [
      'getAnimals',
      'feedAnimal',
      'getBidzinaStatus',
      'toggleBidzinaStatus',
    ]);
    mockApiService.getAnimals.and.returnValue(
      of([
        { id: 1, name: 'Cow', type: 'Mammal', thanks: 10, url: 'cow.jpg' },
        { id: 2, name: 'Chicken', type: 'Bird', thanks: 3, url: 'chicken.jpg' },
      ])
    );

    await TestBed.configureTestingModule({
      imports: [AppComponent, CommonModule, MatButtonModule, RouterOutlet],
      //providers: [{ provide: ApiService, useValue: mockApiService }],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        provideHttpClient(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch Bidzina status on init', () => {
    const mockResponse = { status: 'putin' };

    mockApiService.getBidzinaStatus.and.returnValue(of(mockResponse));

    component.fetchBidzinaStatus();

    expect(component.isSecondImageVisible).toBe(true);
  });

  it('should fetch animals on init', () => {
    const mockAnimals = [
      { id: 1, name: 'Cow', thanks: 10, type: 'Mammal', url: 'cow.jpg' },
    ];
    mockApiService.getAnimals.and.returnValue(of(mockAnimals));

    fixture.detectChanges(); // Triggers ngOnInit

    expect(mockApiService.getAnimals).toHaveBeenCalled();
    expect(component.animals).toEqual(mockAnimals);
  });

  it('should toggle image and call toggleBidzinaStatus API', () => {
    mockApiService.toggleBidzinaStatus.and.returnValue(of({ status: 'putin' }));

    component.toggleImage();

    expect(mockApiService.toggleBidzinaStatus).toHaveBeenCalled();
    expect(component.isSecondImageVisible).toBeTrue();
  });

  it('should play and stop music', async () => {
    spyOn(component, 'playMusic').and.callFake(async () => {
      component.isPlaying = true;
    });

    spyOn(component, 'stopMusic').and.callFake(() => {
      component.isPlaying = false;
    });

    await component.toggleMusic();
    expect(component.isPlaying).toBeTrue();

    component.toggleMusic();
    expect(component.isPlaying).toBeFalse();
  });

  it('should feed an animal and update UI', async () => {
    const animal = {
      id: 1,
      name: 'Cow',
      type: 'Mammal',
      thanks: 5,
      url: 'cow.jpg',
    };

    mockApiService.feedAnimal.and.returnValue(of({ animalId: 1 }));

    const mockAnimals = [
      { id: 1, name: 'Cow', type: 'Mammal', thanks: 10, url: 'cow.jpg' },
      { id: 2, name: 'Chicken', type: 'Bird', thanks: 3, url: 'chicken.jpg' },
    ];
    mockApiService.getAnimals.and.returnValue(of(mockAnimals));

    component.feedAnimal(animal);

    // Wait for async operations to complete
    await fixture.whenStable();

    // Check if the feedAnimal API was called with the correct animal ID
    expect(mockApiService.feedAnimal).toHaveBeenCalledWith(1);

    expect(mockApiService.getAnimals).toHaveBeenCalled();

    // Check the thanks text
    expect(component.showThanksText).toEqual(1);

    setTimeout(() => {
      expect(component.showFoodAnimation).toBeFalse();
      expect(component.showHappyImage).toBeFalse();
      expect(component.showThanksText).toBeNull();
    }, 2000);
  });

  it('should render the feed button for each animal', () => {
    component.animals = [
      { id: 1, name: 'Cow', type: 'Mammal', thanks: 10, url: 'cow.jpg' },
    ];
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[color="primary"]')
    );
    expect(button).toBeTruthy();
  });
});
