import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 1. Analyseert één of meerdere geüploade documenten/pagina's (PDF of afbeeldingen tot 100MB)
export async function analyzeInvoiceDocuments(files) {
  const fileArray = Array.isArray(files) ? files : [files];
  const parts = fileArray.map((file) => {
    let effectiveMime = file.mimetype;
    if (!effectiveMime || effectiveMime === 'application/octet-stream') {
      if (file.originalname && file.originalname.toLowerCase().endsWith('.pdf')) {
        effectiveMime = 'application/pdf';
      } else {
        effectiveMime = 'image/jpeg';
      }
    }
    return {
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: effectiveMime
      }
    };
  });

  const prompt = `
  Je bent een gespecialiseerde Nederlandse huurrechtjurist en forensisch accountant.
  Analyseer dit dossier bestaande uit ${fileArray.length} geüploade document(en)/pagina's van een stookkosten- of servicekostenafrekening, opgesteld door ista Nederland B.V. of vastgoedbeheerder Hoekstra.

  Lees en verifieer ALLE pagina's, specificaties, tabellen, verdeelsleutels en meetstaten van alle documenten in dit dossier nauwkeurig door.
  Combineer de gegevens uit alle pagina's en haal de kerngegevens op. Controleer strikt op wettelijke gebreken (Boek 7 BW).
  Retourneer UITSLUITEND valide JSON in dit formaat:
  {
    "verhuurderBeheerder": "naam van beheerder (bijv. Hoekstra Vastgoedbeheer)",
    "huurderAdres": "adres op de brief of 'Onbekend'",
    "factuurDatum": "YYYY-MM-DD",
    "afrekenPeriode": "bijv. 01-01-2023 t/m 31-12-2023",
    "totaalKosten": 0.0,
    "betaaldVoorschot": 0.0,
    "bijteBetalenSaldo": 0.0,
    "isNa1JuliOntvangen": false,
    "bevatOrigineleFacturenGas": false,
    "administratiekosten": 0.0,
    "geconstateerdeGebreken": [
      "korte opsomming van concrete juridische/rekenkundige afwijkingen en ontbrekende bronspecificaties"
    ]
  }
  `;

  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: parts
      }
    ],
    config: {
      responseMimeType: 'application/json'
    }
  });

  let raw = response.text.trim();
  if (raw.startsWith('```')) {
    raw = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  }
  return JSON.parse(raw);
}

// Backwards compatibility alias voor enkele bestanden
export async function analyzeInvoiceImage(imageBuffer, mimeType) {
  return analyzeInvoiceDocuments([{ buffer: imageBuffer, mimetype: mimeType, originalname: 'document.pdf' }]);
}

// 2. Vertaalt ingesproken tekst naar een juridisch helder advocatendossier
export async function formatVoiceToLawyerBrief({ transcript, auditData, userDetails }) {
  const prompt = `
  Je bent een senior jurist die een feitennotitie en instructiebrief opstelt voor een advocaat.
  De cliënt (huurder) heeft mondeling ingesproken wat er speelt tegen verhuurder/beheerder Hoekstra en meetbedrijf ista.

  Informatie van de cliënt:
  - Ingesproken relaas: "${transcript}"
  - Factuurgegevens: ${JSON.stringify(auditData || {})}
  - Cliëntgegevens: ${JSON.stringify(userDetails || {})}

  Doel:
  Maak een gestructureerde 'Instructie- en Feitennotitie ter attentie van de Advocaat'.
  De taal moet glashelder en zakelijk zijn, direct bruikbaar voor een advocaat om een dagvaarding of verweerschrift op te baseren. 
  Hanteer de volgende structuur in de tekst:
  1. PARTIJEN & HOEDANIGHEID (Wie is huurder, wie is verhuurder Hoekstra, rol van ista als hulppersoon)
  2. CHRONOLOGIE DER FEITEN (Wat is er gebeurd op basis van wat de cliënt insprak)
  3. RECHTSGRONDEN & GEBREKEN (Toetsing aan art. 7:259 lid 4 BW inzagerecht, art. 6:52 BW opschorting, ontbreken brondocumenten en betwisting K-factoren/warmtekostenverdelers)
  4. HUIDIGE STATUS & SPOEDEISENDHEID (Dreiging met incasso, verzuim wederpartij)
  5. CONCRETE INSTRUCTIE AAN DE ADVOCAAT (Wat verzoekt de cliënt: nietigverklaring van de claim, afdwingen inzage, afwijzen incassokosten)

  Lever de tekst direct terug in een professionele, verzorgde briefopzet.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });

  return response.text;
}
