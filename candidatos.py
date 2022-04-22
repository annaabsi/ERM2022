import pandas as pd
import requests

# LISTA DE CANDIDATOS - NACIONAL

for id_solicitud_lista in range(3088,16860):
    url = f'https://apiplataformaelectoral.jne.gob.pe/api/v1/candidato/candidatos-lista-internas/{id_solicitud_lista}'
    resp = requests.get(url=url, verify=False)
    data = resp.json()['data']
    if data != []:
        df = pd.DataFrame(data)
        df = df.drop(['archivoBase64'], axis=1)
        df['idSolicitudLista'] = id_solicitud_lista
        df.to_csv(f"listas/{id_solicitud_lista}.csv")

# LISTAS CON ERRORES:
# 3087