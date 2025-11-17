import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForoTopic, ForoTopicRequest } from '../models/forum.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  private http = inject(HttpClient);

  private publicApiUrl = `${environment.apiUrl}/public/foros`;

  private privateApiUrl = `${environment.apiUrl}/foros`;

  getAllTopics(): Observable<ForoTopic[]> {
    return this.http.get<ForoTopic[]>(this.publicApiUrl);
  }


  getTopicById(id: number): Observable<ForoTopic> {
    const url = `${this.publicApiUrl}/${id}`;
    return this.http.get<ForoTopic>(url);
  }


  createTopic(data: ForoTopicRequest): Observable<ForoTopic> {
    return this.http.post<ForoTopic>(this.privateApiUrl, data);
  }
}
