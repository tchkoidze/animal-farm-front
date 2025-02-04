import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAnimals(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/animals`); // Fetch data
  }

  feedAnimal(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/feed`, {}); // POST request
  }

  getBidzinaStatus() {
    return this.http.get<{ status: string }>(`${this.baseUrl}/bidzina/status`);
  }

  toggleBidzinaStatus() {
    return this.http.post<{ status: string }>(
      `${this.baseUrl}/bidzina/status/toggle`,
      {}
    );
  }
}
