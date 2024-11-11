// claim-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaimService } from '../claim.service';
import { from } from 'rxjs';
import { concatMap, delay, map } from 'rxjs/operators';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-claim-list',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzButtonModule],
  templateUrl: './claim-list.component.html',
  providers: [ClaimService]
})
export class ClaimListComponent implements OnInit {
  claims: any[] = [];
  pageNumber: number = 0;
  isLoading: boolean = false;

  constructor(private claimService: ClaimService) {}

  ngOnInit(): void {
    this.loadClaims();
  }

  // Method to load claims and their details
  loadClaims() {
    this.isLoading = true;

    // Step 1: Get the list of claims for the current page
    this.claimService.getClaimList(this.pageNumber).subscribe({
      next: (claimList) => {
        // Step 2: Process each claim with a delay of 500ms between requests
        from(claimList).pipe(
          concatMap(claim => 
            this.claimService.getClaimDetails(claim.id).pipe(
              delay(200),  // Add a 500ms delay for each detail request
              map(detail => ({
                ...claim,
                invoices: detail.invoices,
                payments: detail.payments
              }))
            )
          )
        ).subscribe({
          next: (detailedClaim) => {
            this.claims = [...this.claims, detailedClaim]; // Append each detailed claim
          },
          complete: () => {
            this.isLoading = false;
            this.pageNumber += 1;
          },
          error: () => {
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
