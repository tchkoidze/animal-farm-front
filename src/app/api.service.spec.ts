// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class ApiService {
//   private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Example API

//   constructor(private http: HttpClient) {}

//   getData(): Observable<any> {
//     return this.http.get<any>(this.apiUrl);
//   }
// }

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:3000/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService], // This is where the actual service gets provided to the tests
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests are left
  });

  it('should fetch animals data', () => {
    const mockAnimals = [
      { id: 1, name: 'Cow', type: 'Mammal', thanks: 10, url: 'cow.jpg' },
      { id: 2, name: 'Chicken', type: 'Bird', thanks: 3, url: 'chicken.jpg' },
    ];

    service.getAnimals().subscribe((data) => {
      expect(data).toEqual(mockAnimals);
    });

    const req = httpMock.expectOne(`${baseUrl}/animals`);
    expect(req.request.method).toBe('GET');
    req.flush(mockAnimals);
  });

  it('should feed an animal', () => {
    const mockAnimalId = 1;
    const mockResponse = { message: 'Animal fed successfully' };

    service.feedAnimal(mockAnimalId).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseUrl}/${mockAnimalId}/feed`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should get Bidzina status', () => {
    const mockStatus = { status: 'active' };

    service.getBidzinaStatus().subscribe((status) => {
      expect(status).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${baseUrl}/bidzina/status`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStatus);
  });

  it('should toggle Bidzina status', () => {
    const mockStatus = { status: 'inactive' };

    service.toggleBidzinaStatus().subscribe((status) => {
      expect(status).toEqual(mockStatus);
    });

    const req = httpMock.expectOne(`${baseUrl}/bidzina/status/toggle`);
    expect(req.request.method).toBe('POST');
    req.flush(mockStatus);
  });
});
