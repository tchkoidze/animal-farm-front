import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ApiService {

//   constructor() { }
// }

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' }) // Global service
export class ApiService {
  private baseUrl = 'http://localhost:3000/api/animals'; //'https://jsonplaceholder.typicode.com/posts'; // Example API

  constructor(private http: HttpClient) {}

  getAnimals(): Observable<any> {
    return this.http.get<any>(this.baseUrl); // Fetch data
  }

  feedAnimal(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/feed`, {}); // POST request
  }
}
