/* calcolichiari.it — parametri di legge in un unico posto.
   Quando cambia una norma si modifica SOLO questo file: tutti i calcolatori
   leggono da qui, così non possono più dare due risposte diverse.
   Ultima verifica sulle fonti primarie: 2 settembre 2026. */
const DATI = {
  verificato: '2026-09-02',

  /* Contributi previdenziali a carico del lavoratore, settore privato ordinario */
  contributi: { dipendente: 0.0919 },

  /* IRPEF 2026 — legge 30 dicembre 2025 n. 199 (secondo scaglione sceso dal 35% al 33%) */
  irpef: { sc1: 28000, sc2: 50000, a1: 0.23, a2: 0.33, a3: 0.43 },

  /* Detrazione lavoro dipendente — art. 13 comma 1 e comma 1.1 TUIR (DPR 917/1986) */
  detrazione: {
    fascia1: 1955, minimo: 690, minimoTermine: 1380,
    b1: 1910, b2: 1190, b3: 13000, c1: 1910, c2: 22000,
    magg: 65, maggDa: 25000, maggA: 35000
  },

  /* Riduzione cuneo fiscale — legge 207/2024 */
  cuneo: {
    trattamento: 1200, trattamentoSoglia: 15000, trattamentoRid: 75,
    esente1: 0.071, esente2: 0.053, esente3: 0.048, ulteriore: 1000
  },

  /* Addizionali regionali e comunali: forbice nazionale stimata.
     NON si applicano alle mensilità aggiuntive (tredicesima e quattordicesima). */
  addizionali: { min: 0.012, max: 0.033 },

  /* NASpI — D.Lgs. 22/2015 artt. 3, 4, 5, 8; Circolare INPS n. 4 del 28/01/2026 */
  naspi: {
    soglia: 1456.72, massimale: 1584.70, qBase: 0.75, qEcc: 0.25,
    dec: 0.03, decDa: 6, decDa55: 8, eta55: 55,
    sMin: 13, sMax: 208, durMax: 104, sMese: 4.33,
    irpefMin: 0.20, irpefMax: 0.25,
    rata1: 0.70, rata2: 0.30   /* anticipata in due rate — legge 199/2025 */
  },

  /* TFR — art. 2120 Codice Civile; legge 297/1982 */
  tfr: { divisore: 13.5, contributo: 0.005 },

  /* Tredicesima — D.P.R. 28 luglio 1960 n. 1070 */
  tredicesima: { giorniPerRateo: 15 }
};
