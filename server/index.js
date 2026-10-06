import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeInvoiceImage } from './analyzer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../client/dist');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.post('/api/scan', upload.single('invoice'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Geen document geüpload.' });
    }

    const audit = await analyzeInvoiceImage(req.file.buffer, req.file.mimetype);

    // Juridische validatie conform Boek 7 BW
    const legalViolations = [];
    if (audit.isNa1JuliOntvangen) {
      legalViolations.push('Vormfout art. 7:259 lid 2 BW: afrekening verstuurd na de wettelijke vervaldatum van 1 juli.');
    }
    if (!audit.bevatOrigineleFacturenGas) {
      legalViolations.push("Strijd met art. 7:259 lid 4 BW: geen inzage in onderliggende inkoopnota's van de energieleverancier.");
    }
    legalViolations.push('Ondeugdelijke grondslag: elektronische meeteenheden ontberen verifieerbare radiatorcapaciteitsfactoren (K-waarden).');

    if (audit.geconstateerdeGebreken && Array.isArray(audit.geconstateerdeGebreken)) {
      audit.geconstateerdeGebreken.forEach((gebrek) => {
        if (!legalViolations.includes(gebrek)) legalViolations.push(gebrek);
      });
    }

    res.json({
      success: true,
      audit,
      legalViolations
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Fout bij verwerking door AI engine: ' + (error?.message || 'Onbekende fout') });
  }
});

if (fs.existsSync(clientDist)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend draait op http://localhost:${PORT}`);
});
