import pandas as pd
import requests

# LISTA DE CANDIDATOS

df_regionales = pd.read_csv('partidos_regional.csv')
for txCodExpedienteExt in df_regionales['txCodExpedienteExt']:
    url = f'https://apiplataformaelectoral3.jne.gob.pe/api/v1/plan-gobierno/candidatos?IdProcesoElectoral=113&TxCodExpedienteExt={txCodExpedienteExt}'
    resp = requests.get(url=url, verify=False)
    data = resp.json()['data']
    if data != []:
        df = pd.DataFrame(data)
        df['txCodExpedienteExt'] = txCodExpedienteExt
        df.to_csv(f"listas_regionales/{txCodExpedienteExt}.csv")

df_provinciales = pd.read_csv('partidos_provincial.csv')
for txCodExpedienteExt in df_provinciales['txCodExpedienteExt']:
    url = f'https://apiplataformaelectoral3.jne.gob.pe/api/v1/plan-gobierno/candidatos?IdProcesoElectoral=113&TxCodExpedienteExt={txCodExpedienteExt}'
    resp = requests.get(url=url, verify=False)
    data = resp.json()['data']
    if data != []:
        df = pd.DataFrame(data)
        df['txCodExpedienteExt'] = txCodExpedienteExt
        df.to_csv(f"listas_provinciales/{txCodExpedienteExt}.csv")

df_distritales = pd.read_csv('partidos_distrital.csv')
for txCodExpedienteExt in df_distritales['txCodExpedienteExt']:
    url = f'https://apiplataformaelectoral3.jne.gob.pe/api/v1/plan-gobierno/candidatos?IdProcesoElectoral=113&TxCodExpedienteExt={txCodExpedienteExt}'
    resp = requests.get(url=url, verify=False)
    data = resp.json()['data']
    if data != []:
        df = pd.DataFrame(data)
        df['txCodExpedienteExt'] = txCodExpedienteExt
        df.to_csv(f"listas_distritales/{txCodExpedienteExt}.csv")

# LISTAS CON ERRORES: por llenar

# MERGE

# df1 = pd.read_csv('candidatos_general_limpio.csv')
# df2 = pd.read_csv('partidos_general.csv')

# df_merged = df1.merge(df2, how='inner', on='idSolicitudLista').drop(columns=['Unnamed: 0.1','Unnamed: 0_x','idListaCandidatoInt','idTipoCandidato','idTipoDocumento','txTipoDocumento','idCargoEleccion','txSexo','Unnamed: 0_y','numCandidatos','idTipoEleccion','numTotalCandidatoHombre','numTotalCandidatoMujer','fgFormula','numNumeroCandidato','fgTieneAccesitario','numTotalAccesitarios','numTotalObligatorios', 'txAlertasTexto','txRutaArchivo']).set_index('idSolicitudLista')

# df_merged.to_csv('base_datos_final.csv')
