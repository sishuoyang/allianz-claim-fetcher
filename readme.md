## Getting Started

```bash
pip3 install requests
pip3 install python-dateutil
python3 main.py CONTRACT_ID TOKEN DURATION
```

Open the browser developer tool, navigate to the `Network` tab and look for the `https://ih.allianz.com/api/v2/claims?contractId=xxxxxxx&includeFirDetails=true&excludeTaskStatus=CANCELLED&pageNumber=0` URL. The value `xxxxxx` part is the contract Id. The `token` can also be found from the request `Authorization` header. Provide the token without the `Bearer ` part to the script.
