// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenUrl = 'https://ih.allianz.com/oauth2/token';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json, text/plain, */*',
      // 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      // 'Origin': 'https://my.allianzcare.com'
    });

    const body = new HttpParams()
      .set('client_id', 'MemberPortal')
      .set('grant_type', 'password')
      .set('username', username)
      .set('password', password)
      .set('accountTypeId', '1');

    return this.http.post<{ access_token: string }>(this.tokenUrl, body.toString(), { headers }).pipe(
      map(response => response.access_token) // Extract the token
    );
  }
}
