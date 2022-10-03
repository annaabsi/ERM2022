import requests
import pandas as pd

url = "https://api.resultadoserm2022.onpe.gob.pe/results/03/140100"
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0",
    "Host": "api.resultadoserm2022.onpe.gob.pe"}
resp = requests.get(url, headers=headers)
print (resp)
print (resp.text)

# df = pd.read_json(data)
# df.to_json('lima_metropolitana.json')