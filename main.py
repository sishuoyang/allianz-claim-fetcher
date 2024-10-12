import requests
import datetime
import json
from typing import List, Dict, Any
from dateutil.relativedelta import relativedelta

# Data structures to model API responses
class Claim:
    def __init__(self, id: int, contractId: int, claimReference: str, status: str, submissionDate: str):
        self.id = id
        self.contractId = contractId
        self.claimReference = claimReference
        self.status = status
        self.submissionDate = datetime.datetime.fromisoformat(submissionDate)

class ClaimDetail:
    def __init__(self, id: int, contractId: int, status: str, invoices: List[Dict[str, Any]], payments: List[Dict[str, Any]]):
        self.id = id
        self.contractId = contractId
        self.status = status
        self.invoices = invoices
        self.payments = payments

# Function to calculate the search range based on duration
def get_date_range(duration: str) -> datetime.datetime:
    now = datetime.datetime.now()
    if duration.endswith('D'):
        return now - datetime.timedelta(days=int(duration[:-1]))
    elif duration.endswith('M'):
        return now - relativedelta(months=int(duration[:-1]))
    else:
        raise ValueError("Invalid duration format. Use '1D', '1M', '3M', etc.")

# Function to retrieve the claim list
def get_claim_list(contract_id: int, bearer_token: str, start_date: datetime.datetime) -> List[Claim]:
    claims = []
    page_number = 0
    last_page = False

    print("Retrieving claim list...")
    while not last_page:
        url = f'https://ih.allianz.com/api/v2/claims?contractId={contract_id}&includeFirDetails=true&excludeTaskStatus=CANCELLED&pageNumber={page_number}'
        headers = {
            'accept': 'application/json',
            'authorization': f'Bearer {bearer_token}',
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        data = response.json()
        for item in data.get('claims', []):
            submission_date = datetime.datetime.fromisoformat(item['submissionDate'])
            if submission_date < start_date:
                last_page = True
                break
            claims.append(Claim(item['id'], item['contractId'], item['claimReference'], item['status'], item['submissionDate']))

        last_page = last_page or data.get('lastPage', True)
        page_number += 1

    print(f"Retrieved {len(claims)} claims.")
    return claims

# Function to retrieve claim details
def get_claim_details(claim_id: int, bearer_token: str) -> ClaimDetail:
    url = f'https://ih.allianz.com/api/v2/claims/{claim_id}?language=en&includeFirDetails=true&includeInvoiceDetails=true&includePaymentDetails=true'
    headers = {
        'accept': 'application/json',
        'authorization': f'Bearer {bearer_token}',
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()

    data = response.json()
    return ClaimDetail(
        id=data['id'],
        contractId=data['contractId'],
        status=data['status'],
        invoices=data.get('invoices', []),
        payments=data.get('payments', [])
    )

# Main function to aggregate claims and save to a file
def aggregate_claims(contract_id: int, bearer_token: str, duration: str):
    start_date = get_date_range(duration)
    claim_list = get_claim_list(contract_id, bearer_token, start_date)

    aggregated_data = []
    for claim in claim_list:
        print(f"Retrieving details for claim {claim.claimReference}...")
        claim_detail = get_claim_details(claim.id, bearer_token)
        aggregated_data.append({
            "claimId": claim_detail.id,
            "contractId": claim_detail.contractId,
            "status": claim_detail.status,
            "invoices": claim_detail.invoices,
            "payments": claim_detail.payments
        })

    # Save to JSON file
    output_file = f'claim_details_{contract_id}_{duration}.json'
    with open(output_file, 'w') as f:
        json.dump(aggregated_data, f, indent=4)
    print(f"Aggregated data saved to {output_file}")

# Entry point
if __name__ == '__main__':
    import sys

    if len(sys.argv) != 4:
        print("Usage: python claim_aggregator.py <contractId> <bearerToken> <duration>")
        sys.exit(1)

    contract_id = int(sys.argv[1])
    bearer_token = sys.argv[2]
    duration = sys.argv[3]

    try:
        aggregate_claims(contract_id, bearer_token, duration)
    except Exception as e:
        print(f"Error: {e}")