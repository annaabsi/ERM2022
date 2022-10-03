import requests
import pandas as pd

url = "https://api.resultadoserm2022.onpe.gob.pe/results/03/140100"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Mobile Safari/537.36",
    "Host": "api.resultadoserm2022.onpe.gob.pe"}
resp = requests.get(url, headers=headers)
print (resp)
print (resp.text)

# df = pd.read_json(data)
# df.to_json('lima_metropolitana.json')