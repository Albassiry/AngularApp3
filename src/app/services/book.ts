import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'http://localhost/AngularApp3API/api.php';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  createBook(book: Book): Observable<any> {
    return this.http.post<any>(this.apiUrl, book);
  }

  updateBook(book: Book): Observable<any> {
    return this.http.put<any>(this.apiUrl, book);
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
}