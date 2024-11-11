// claim.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private baseUrl = 'https://ih.allianz.com/api/v2/claims';
  private contractId = 4144191;

  constructor(private http: HttpClient) {}

  // Method to get list of claims for the contract
  getClaimList(pageNumber: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });
    const params = new HttpParams()
      .set('contractId', this.contractId.toString())
      .set('includeFirDetails', 'true')
      .set('excludeTaskStatus', 'CANCELLED')
      .set('pageNumber', pageNumber.toString());

    return this.http.get<any>(`${this.baseUrl}`, { headers, params }).pipe(
      map(response => response.claims)  // Extract list of claims from the response
    );
  }

  // Method to get details for a specific claim, using the required URL format
  getClaimDetails(claimId: number): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    });

    const url = `${this.baseUrl}/${claimId}?language=en&includeFirDetails=true&includeInvoiceDetails=true&includePaymentDetails=true`;

    return this.http.get<any>(url, { headers });
  }
}
