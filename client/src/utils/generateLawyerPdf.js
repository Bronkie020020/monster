import { jsPDF } from 'jspdf';

export function generateLawyerPdf(briefText, userDetails = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 20;
  const pageWidth = 210;
  const maxLineWidth = pageWidth - (margin * 2);
  let y = 25;

  const addLine = (text, size = 10, isBold = false, spacing = 5) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxLineWidth);
    if (y + (lines.length * spacing) > 275) {
      doc.addPage();
      y = 25;
    }
    doc.text(lines, margin, y);
    y += (lines.length * spacing);
  };

  doc.setTextColor(15, 23, 42);
  addLine('VERTROUWELIJK — DOSSIERNOTITIE EN INSTRUCTIE AAN DE RAADSMAN', 11, true, 6);
  y += 2;

  const datumVandaag = new Date().toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  addLine(`Datum opmaak: ${datumVandaag} | Cliënt: ${userDetails.naam || 'Cliënt'}`, 9, false, 5);
  y += 4;

  // Split brief in alinea's
  const paragraphs = briefText.split('\n');
  paragraphs.forEach((p) => {
    const trimmed = p.trim();
    if (!trimmed) {
      y += 3;
      return;
    }
    const isHeading = trimmed.startsWith('#') || trimmed.match(/^[0-9]\./);
    const cleanText = trimmed.replace(/^[#*]+\s*/, '');
    addLine(cleanText, isHeading ? 10.5 : 9.5, isHeading, isHeading ? 5.5 : 4.8);
  });

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Pagina ${i} van ${totalPages} — Dossier ter attentie van advocaat`, margin, 290);
  }

  doc.save(`Advocaten_Instructie_${(userDetails.naam || 'Client').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
