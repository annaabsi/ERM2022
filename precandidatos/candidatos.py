import pandas as pd
import requests

# LISTA DE CANDIDATOS - NACIONAL (14021 listas)

# for id_solicitud_lista in range(16861):
#     url = f'https://apiplataformaelectoral.jne.gob.pe/api/v1/candidato/candidatos-lista-internas/{id_solicitud_lista}'
#     resp = requests.get(url=url, verify=False)
#     data = resp.json()['data']
#     if data != []:
#         df = pd.DataFrame(data)
#         df = df.drop(['archivoBase64'], axis=1)
#         df['idSolicitudLista'] = id_solicitud_lista
#         df.to_csv(f"listas/{id_solicitud_lista}.csv")
#     print(id_solicitud_lista)

# LISTAS CON ERRORES:
# 3087
# 14434

# MERGE

df1 = pd.read_csv('candidatos_general_limpio.csv')
df2 = pd.read_csv('partidos_general.csv')

df_merged = df1.merge(df2, how='inner', on='idSolicitudLista').drop(columns=['Unnamed: 0.1','Unnamed: 0_x','idListaCandidatoInt','idTipoCandidato','idTipoDocumento','txTipoDocumento','idCargoEleccion','txSexo','Unnamed: 0_y','numCandidatos','idTipoEleccion','numTotalCandidatoHombre','numTotalCandidatoMujer','fgFormula','numNumeroCandidato','fgTieneAccesitario','numTotalAccesitarios','numTotalObligatorios', 'txAlertasTexto','txRutaArchivo']).set_index('idSolicitudLista')

df_merged.to_csv('base_datos_final.csv')
