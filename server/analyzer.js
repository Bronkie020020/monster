import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeInvoiceImage(imageBuffer, mimeType) {
  const base64Data = imageBuffer.toString('base64');

  const prompt = `
  Je bent een gespecialiseerde Nederlandse huurrechtjurist en forensisch accountant.
  Analyseer deze stookkosten- of servicekostenafrekening (afkomstig van ista of vastgoedbeheerder Hoekstra).

  Haal de kerngegevens op en controleer strikt op wettelijke gebreken (Boek 7 BW).
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

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          { inlineData: { data: base64Data, mimeType: mimeType } },
          { text: prompt }
        ]
      }
    ],
    config: {
      responseMimeType: 'application/json'
    }
  });

  return JSON.parse(response.text);
}
