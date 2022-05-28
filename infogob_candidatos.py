import pandas as pd
import requests
import urllib.parse
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# LISTAR CANDIDATO

candidatos = pd.read_csv('base_datos_final.csv')
dict = {}
for dni_candidato in candidatos['txDocumentoIdentidad']:
    try:
        url = "https://infogob.jne.gob.pe/Politico/ListarPolitico"
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0"}
        body = {"IdDNI": dni_candidato, "token":"cA6%2B6LtErj8=6L"}
        resp = requests.post(url=url, headers=headers, data=body, verify=False)
        #data = resp.json()["Data"][0]["TxRutaPolitico"][-14:]
        data = resp.json()["Data"][0]["TxRutaPolitico"][-14:]
        data_encoded = urllib.parse.quote(data.encode('utf8'))
        dict[dni_candidato] = data_encoded
        print(data_encoded)
    except:
        continue
df = pd.DataFrame(dict.items(), columns=["DNI","URL"])
df.to_csv("dnis_urls.csv")