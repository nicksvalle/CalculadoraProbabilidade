
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Calculadora } from './calculadora';

@Injectable({
  providedIn: 'root'
})
export class CalculadoraService {

  url = 'http://localhost:8080/calculator/';

  constructor(private http: HttpClient) { }

  getCalculadora(): Observable<Calculadora[]> {
    return this.http.get<Calculadora[]>(this.url);
  }

  save(calculadora: Calculadora): Observable<Calculadora> {
  return this.http.post<Calculadora>(this.url, calculadora); 
  }

}
