import { jsPDF } from 'jspdf';

export function generateLegalLetterPdf(auditData, userDetails = {}) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const huurderNaam = userDetails.naam || '[Uw Naam]';
  const huurderAdres = userDetails.adres || auditData.huurderAdres || '[Adres]';
  const huurderPostcodePlaats = userDetails.postcodePlaats || '[Postcode en Woonplaats]';
  const huurderEmail = userDetails.email || '[E-mailadres]';
  const huurderTelefoon = userDetails.telefoon || '[Telefoonnummer]';

  const beheerder = auditData.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer';
  const afrekenPeriode = auditData.afrekenPeriode || '[Periode]';
  const factuurDatum = auditData.factuurDatum || '[Onbekend]';
  const betwistBedrag = auditData.bijteBetalenSaldo 
    ? Number(auditData.bijteBetalenSaldo).toFixed(2) 
    : '0.00';

  const margin = 20;
  const pageWidth = 210;
  const maxLineWidth = pageWidth - (margin * 2);
  let y = 24;

  const addWrappedText = (text, fontSize = 10, isBold = false, spacing = 4.8) => {
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxLineWidth);
    
    if (y + (lines.length * spacing) > 275) {
      doc.addPage();
      y = 24;
    }
    doc.text(lines, margin, y);
    y += (lines.length * spacing);
  };

  // Header status
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(185, 28, 28);
  doc.text('AANGETEKEND PER POST & PER E-MAIL MET ONTVANGSTBEVESTIGING', margin, y);
  y += 9;

  // Afzender & Geadresseerde
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  
  doc.text([
    'Afzender:',
    huurderNaam,
    huurderAdres,
    huurderPostcodePlaats,
    `E-mail: ${huurderEmail}`,
    `Tel: ${huurderTelefoon}`
  ], margin, y);

  doc.text([
    'Aan:',
    beheerder,
    'T.a.v. Directie & Afdeling Servicekostenadministratie',
    'Postbus / Vestiging Leeuwarden',
    'Nederland'
  ], 120, y);

  y += 30;

  const datumVandaag = new Date().toLocaleDateString('nl-NL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Datum: ${datumVandaag}`, margin, y);
  y += 7;

  addWrappedText(
    `Betreft: Formeel bezwaar afrekening service- en stookkosten (${afrekenPeriode}) – Vorderen inzage brondocumenten ex art. 7:259 lid 4 BW & Beroep op wettelijk opschortingsrecht ex art. 6:52 BW`,
    9.5,
    true,
    4.5
  );
  y += 3;

  addWrappedText('Geachte directie,', 9.5, false, 4.5);
  y += 2;

  addWrappedText(
    `Onder verwijzing naar de door u toegezonden afrekening stook- en servicekosten over de periode ${afrekenPeriode}, opgesteld door meetdienst ista Nederland B.V. onder factuurdatum ${factuurDatum}, deel ik u hierbij mede dat ik de verschuldigdheid en de hoogte van het door u nagevorderde saldo ter hoogte van € ${betwistBedrag} integraal en uitdrukkelijk betwist.`,
    9.5,
    false,
    4.5
  );
  y += 2;

  addWrappedText('1. Schending stelplicht & Reikwijdte inzagerecht (Art. 7:259 lid 4 BW)', 9.5, true, 4.5);
  addWrappedText(
    'Op grond van dwingendrechtelijk huurrecht rust de volledige verantwoording en bewijslast ter zake van de gemaakte kosten op de verhuurder/beheerder. Een door ista gegenereerd overzicht van fictieve of relatieve eenheden geldt in rechte niet als afdoende bewijs zolang de verifieerbare brondocumenten ontbreken. Zonder inzage in de onderliggende stukken ontbreekt iedere controleerbare rechtsgrond.',
    9,
    false,
    4.2
  );
  y += 2;

  addWrappedText('Op grond van artikel 7:259 lid 4 BW sommeer ik u om binnen drie (3) weken na dagtekening volledige inzage te verlenen in, dan wel afschriften te verstrekken van:', 9, false, 4.2);

  const eisen = [
    'a) De originele facturen en jaarafrekeningen van het energienetbedrijf/warmteleverancier van het totale complex;',
    'b) De begin- en eindmeterstanden van de centrale gas-/warmtehoofdmeters;',
    'c) Het volledige ista-opnamerapport inclusief de geregistreerde radiatorcapaciteitsfactoren (K-waarden per meter), reductiefactoren en de gehanteerde vaste/variabele verdeelsleutel;',
    'd) De contractuele verantwoording van meetdienst- en administratiekosten, getoetst aan de normen van het Beleidsboek van de Huurcommissie.'
  ];
  eisen.forEach((e) => addWrappedText(e, 8.5, false, 4));
  y += 2;

  addWrappedText('2. Beroep op wettelijk opschortingsrecht (Art. 6:52 BW)', 9.5, true, 4.5);
  addWrappedText(
    `Zolang u niet aan uw wettelijke plicht ex art. 7:259 lid 4 BW heeft voldaan, is de vordering niet opeisbaar. Op grond van artikel 6:52 BW schort ik de betaling van het nagevorderde saldo ad € ${betwistBedrag} hierbij rechtsgeldig op. Eventuele buitengerechtelijke incassomaatregelen kwalificeren als prematuur en onrechtmatig en worden bij voorbaat integraal betwist.`,
    9,
    false,
    4.2
  );
  y += 2;

  addWrappedText('3. Aanzegging vervolgstappen Huurcommissie / Kantonrechter', 9.5, true, 4.5);
  addWrappedText(
    'Mocht u niet binnen 21 dagen aan dit verzoek voldoen of onvolledige informatie overleggen, dan zal ik het geschil aanhangig maken bij de Huurcommissie ter bindende vernietiging van de afrekening en vaststelling van de betalingsverplichting conform het wettelijk minimum.',
    9,
    false,
    4.2
  );
  y += 5;

  addWrappedText('Hoogachtend,', 9.5, false, 4.5);
  y += 10;
  addWrappedText(huurderNaam, 9.5, true, 4.5);

  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Pagina ${i} van ${totalPages} – Formeel Dossier Art. 7:259 lid 4 & 6:52 BW`, margin, 290);
  }

  const cleanFilename = `Sommatiebrief_${beheerder.replace(/[^a-zA-Z0-9]/g, '_')}_${afrekenPeriode.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(cleanFilename);
}
