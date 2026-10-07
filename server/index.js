import express from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { analyzeInvoiceImage, analyzeInvoiceDocuments, formatVoiceToLawyerBrief } from './analyzer.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDist = path.join(__dirname, '../client/dist');

const app = express();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024, files: 25 } // 100 MB per bestand, tot 25 bestanden
});

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
}

app.post('/api/scan', upload.any(), async (req, res) => {
  try {
    const uploadedFiles = req.files || (req.file ? [req.file] : []);
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'Geen documenten geüpload.' });
    }

    const audit = await analyzeInvoiceDocuments(uploadedFiles);

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

    const filenames = uploadedFiles.map((f) => f.originalname || 'Document');
    const totalSizeBytes = uploadedFiles.reduce((acc, f) => acc + (f.size || 0), 0);

    res.json({
      success: true,
      audit,
      legalViolations,
      filesSummary: {
        count: uploadedFiles.length,
        names: filenames,
        totalSizeBytes: totalSizeBytes
      }
    });
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Fout bij verwerking door AI engine: ' + (error?.message || 'Onbekende fout') });
  }
});

// Spraak naar advocaat endpoint
app.post('/api/lawyer-brief', async (req, res) => {
  try {
    const { transcript, auditData, userDetails } = req.body;
    if (!transcript) {
      return res.status(400).json({ error: 'Geen ingesproken tekst ontvangen.' });
    }

    const lawyerBrief = await formatVoiceToLawyerBrief({ transcript, auditData, userDetails });
    res.json({ success: true, lawyerBrief });
  } catch (error) {
    console.error('Lawyer brief error:', error);
    res.status(500).json({ error: 'Fout bij genereren advocatenbriefing: ' + (error?.message || 'Onbekende fout') });
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
