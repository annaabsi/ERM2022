import pandas as pd
import requests
import urllib.parse
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

from requests_html import HTMLSession
session = HTMLSession()

# LISTAR CANDIDATOS

candidatos = pd.read_csv('alcaldes_provinciales.csv')

dict = {}
for dni_candidato in candidatos['txDocumentoIdentidad']:
    try:
        url = "https://infogob.jne.gob.pe/Politico/ListarPolitico"
        headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:66.0) Gecko/20100101 Firefox/66.0"}
        body = {"IdDNI": dni_candidato, "token":"cA6%2B6LtErj8=6L"}
        resp = requests.post(url=url, headers=headers, data=body, verify=False)
        data = resp.json()["Data"][0]["TxRutaPolitico"].split("partidario_",1)[1]
        data_encoded = urllib.parse.quote(data.encode('utf8'))
        dict[dni_candidato] = data_encoded
        print(data_encoded)
    except:
        continue
df = pd.DataFrame(dict.items(), columns=["DNI","URL"])
df.to_csv("dnis_urls_alcaldes_provinciales.csv")

# HISTORIAL PARTIDARIO

candidatos = pd.read_csv('dnis_urls_alcaldes_provinciales.csv', index_col=0)

dict = {}
for dni_candidato, url_candidato in candidatos.itertuples(index=False):
    dict[dni_candidato] = {}
    try:
        body = {"token": "KOlSDC8AUxc=lC"}
        r = session.post(f"https://infogob.jne.gob.pe/Politico/_HistorialFichaPolitico?istrParameters={url_candidato}", verify=False, data=body)

        about = r.html.find('.alias')
        for idx, partido in enumerate(about):
            dict[dni_candidato][idx] = partido.text

    except:
        continue

df = pd.DataFrame.from_dict(dict, orient="index")
df.to_csv("historial_partidario_alcaldes_provinciales.csv")

# PROCESOS ELECTORALES

candidatos = pd.read_csv('dnis_urls_alcaldes_provinciales.csv', index_col=0)

dict = {}
for dni_candidato, url_candidato in candidatos.itertuples(index=False):
    dict[dni_candidato] = {}
    try:
        body = {"token": "KOlSDC8AUxc=lC"}
        r = session.post(f"https://infogob.jne.gob.pe/Politico/_ProcesosFichaPolitico?istrParameters={url_candidato}", verify=False, data=body)

        about = r.html.find('tr')
        for idx, partido in list(enumerate(about))[1:]:
            dict[dni_candidato][idx] = partido.text.split('\n',5)[:5]

    except:
        continue

df = pd.DataFrame.from_dict(dict, orient="index")
df = df.apply(pd.Series.explode)
df = df.T
df.to_csv("procesos_electorales_alcaldes_provinciales.csv")