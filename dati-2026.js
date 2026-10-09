/* calcolichiari.it — parametri di legge e regole di calcolo in un unico posto.
   Quando cambia una norma si modifica SOLO questo file: tutti i calcolatori
   leggono da qui, così non possono dare due risposte diverse.
   Ultima verifica sulle fonti primarie: 9 ottobre 2026. */
const DATI = {
  verificato: '2026-10-09',

  /* Contributi previdenziali a carico del lavoratore, settore privato ordinario */
  contributi: { dipendente: 0.0919 },

  /* IRPEF 2026 — legge 30 dicembre 2025 n. 199 (secondo scaglione sceso dal 35% al 33%).
     Sulle mensilità aggiuntive la ritenuta si calcola ragguagliando a mese gli scaglioni
     annui, senza detrazioni: art. 23 comma 2 lettera b) DPR 600/1973. */
  irpef: { sc1: 28000, sc2: 50000, a1: 0.23, a2: 0.33, a3: 0.43 },

  /* Detrazione lavoro dipendente — art. 13 comma 1 e comma 1.1 TUIR (DPR 917/1986).
     È rapportata al periodo di lavoro nell'anno. Il minimo di 690 euro (1.380 per i
     contratti a termine) sta solo nella lettera a), cioè fino a 15.000 euro di reddito. */
  detrazione: {
    fascia1: 1955, sogliaMinimo: 15000, minimo: 690, minimoTermine: 1380,
    b1: 1910, b2: 1190, b3: 13000, c1: 1910, c2: 22000,
    magg: 65, maggDa: 25000, maggA: 35000
  },

  /* Trattamento integrativo (D.L. 3/2020) e riduzione del cuneo fiscale (legge 207/2024).
     Trattamento integrativo: 1.200 euro rapportati al periodo, fino a 15.000 euro, se l'imposta
     lorda supera la detrazione diminuita di 75 euro rapportati al periodo.
     Somma esente: percentuale del reddito di lavoro dipendente, con la fascia scelta sul
     reddito rapportato all'intero anno; spetta se il reddito complessivo non supera 20.000 euro.
     Ulteriore detrazione: tra 20.000 e 40.000 euro, rapportata al periodo, nei limiti dell'imposta. */
  cuneo: {
    trattamento: 1200, trattamentoSoglia: 15000, trattamentoRid: 75,
    esente1: 0.071, esente2: 0.053, esente3: 0.048,
    sommaSoglia1: 8500, sommaSoglia2: 15000, sommaMax: 20000,
    ulteriore: 1000, ulterioreDa: 20000, ulteriorePiena: 32000, ulterioreFino: 40000
  },

  /* Addizionali regionali e comunali: forbice nazionale stimata. Non sono dovute se
     l'IRPEF netta dell'anno non supera 10,33 euro. NON si applicano sulle mensilità
     aggiuntive: si trattengono a rate sulle buste dell'anno seguente. */
  addizionali: { min: 0.012, max: 0.033, esenzione: 10.33 },

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

  /* Tredicesima — D.P.R. 28 luglio 1960 n. 1070; part-time: art. 7 c. 2 D.Lgs. 81/2015 */
  tredicesima: { giorniPerRateo: 15 },

  /* Malattia — Guida INPS alla tutela previdenziale della malattia; art. 5 D.L. 463/1983
     (conv. legge 638/1983) per i contratti a termine; circolare INPS 41/2006 per la
     somministrazione; ricadute entro 30 giorni: circolare INPS 134368/1981. */
  malattia: {
    carenza: 3, fascia1Fino: 20, durataMax: 180,
    perc1: 0.50, perc2: 0.6666, percPubbliciEsercizi: 0.80,
    divImpiegati: 30, divOperai: 26, divRateiOperai: 25,
    termineMinimo: 30, ricaduta: 30
  },

  /* Festività nazionali (mese-giorno), legge 260/1949. Il 4 ottobre è festa nazionale
     dal 2026 (legge 151/2025). Il lunedì dell'Angelo si calcola a parte.
     Il santo patrono, che cambia da comune a comune, non è compreso. */
  festivita: ['01-01', '01-06', '04-25', '05-01', '06-02', '08-15', '11-01', '12-08', '12-25', '12-26'],
  festivitaDal2026: ['10-04']
};

/* Regole fiscali condivise. Ogni funzione corrisponde a una norma citata sopra. */
const FISCO = {
  /* IRPEF lorda annua */
  irpefAnnua(x) {
    const I = DATI.irpef;
    if (x <= 0) return 0;
    if (x <= I.sc1) return x * I.a1;
    if (x <= I.sc2) return I.sc1 * I.a1 + (x - I.sc1) * I.a2;
    return I.sc1 * I.a1 + (I.sc2 - I.sc1) * I.a2 + (x - I.sc2) * I.a3;
  },
  /* ritenuta su una mensilità aggiuntiva: scaglioni annui ragguagliati a mese, senza detrazioni */
  irpefMese(x) {
    const I = DATI.irpef, a = I.sc1 / 12, b = I.sc2 / 12;
    if (x <= 0) return 0;
    if (x <= a) return x * I.a1;
    if (x <= b) return a * I.a1 + (x - a) * I.a2;
    return a * I.a1 + (b - a) * I.a2 + (x - b) * I.a3;
  },
  /* detrazione per un anno intero, prima di rapportarla al periodo */
  detrazioneBase(R) {
    const D = DATI.detrazione, I = DATI.irpef;
    let d;
    if (R <= D.sogliaMinimo) d = D.fascia1;
    else if (R <= I.sc1) d = D.b1 + D.b2 * (I.sc1 - R) / D.b3;
    else if (R <= I.sc2) d = D.c1 * (I.sc2 - R) / D.c2;
    else d = 0;
    if (R > D.maggDa && R <= D.maggA) d += D.magg;
    return d;
  },
  /* detrazione spettante: rapportata alla frazione d'anno f, con il minimo della lettera a) */
  detrazione(R, f, termine) {
    const D = DATI.detrazione;
    let d = FISCO.detrazioneBase(R) * f;
    if (R <= D.sogliaMinimo) d = Math.max(d, termine ? D.minimoTermine : D.minimo);
    return d;
  },
  /* ulteriore detrazione per un anno intero (legge 207/2024), da rapportare al periodo */
  ulteriore(R) {
    const K = DATI.cuneo;
    if (R > K.ulterioreDa && R <= K.ulteriorePiena) return K.ulteriore;
    if (R > K.ulteriorePiena && R <= K.ulterioreFino) return K.ulteriore * (K.ulterioreFino - R) / (K.ulterioreFino - K.ulteriorePiena);
    return 0;
  },
  aliquotaSomma(Rann) {
    const K = DATI.cuneo;
    return Rann <= K.sommaSoglia1 ? K.esente1 : (Rann <= K.sommaSoglia2 ? K.esente2 : K.esente3);
  },
  /* somma esente: R reddito effettivo, Rann reddito rapportato all'anno, base reddito di lavoro dipendente */
  somma(R, Rann, base) {
    return R <= DATI.cuneo.sommaMax ? base * FISCO.aliquotaSomma(Rann) : 0;
  },
  /* trattamento integrativo rapportato al periodo, con la verifica di capienza */
  trattamento(R, lorda, d, f) {
    const K = DATI.cuneo;
    return (R <= K.trattamentoSoglia && lorda > d - K.trattamentoRid * f) ? K.trattamento * f : 0;
  }
};

/* Calendario: festività nazionali, con il lunedì dell'Angelo. Date in UTC per evitare
   sorprese con l'ora legale. */
const CALENDARIO = {
  pasqua(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451), mese = Math.floor((h + l - 7 * m + 114) / 31),
      giorno = ((h + l - 7 * m + 114) % 31) + 1;
    return Date.UTC(y, mese - 1, giorno);
  },
  festivo(ms) {
    const dt = new Date(ms), y = dt.getUTCFullYear();
    const md = String(dt.getUTCMonth() + 1).padStart(2, '0') + '-' + String(dt.getUTCDate()).padStart(2, '0');
    if (DATI.festivita.includes(md)) return true;
    if (y >= 2026 && DATI.festivitaDal2026.includes(md)) return true;
    return ms === CALENDARIO.pasqua(y) + 86400000;
  }
};
