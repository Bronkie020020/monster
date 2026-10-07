import { jsPDF } from 'jspdf';

export function generateHuurcommissieDossier(auditData = {}, userDetails = {}) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  });

  const huurderNaam = userDetails.naam || '[Naam Huurder]';
  const huurderAdres = userDetails.adres || auditData.huurderAdres || '[Straat en Huisnummer]';
  const huurderPostcodePlaats = userDetails.postcodePlaats || '[Postcode en Plaats]';
  const beheerder = auditData.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer Leeuwarden';
  const afrekenPeriode = auditData.afrekenPeriode || '[Afrekenperiode]';
  const betwistBedrag = auditData.bijteBetalenSaldo 
    ? Number(auditData.bijteBetalenSaldo).toFixed(2) 
    : '0.00';

  const margin = 20;
  const pageWidth = 210;
  const maxLineWidth = pageWidth - (margin * 2);
  let y = 25;

  const addText = (text, size = 10, isBold = false, spacing = 5) => {
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

  // Header Huurcommissie Model
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('AAN DE HUURCOMMISSIE', margin, y);
  y += 6;
  doc.setFontSize(11);
  doc.text('Afdeling Geschillenbeslechting Service- en Verwarmingskosten', margin, y);
  y += 10;

  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Dossier Partijen
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  addText(`VERZOEKER (Huurder): ${huurderNaam}, wonende te ${huurderAdres}, ${huurderPostcodePlaats}`, 9.5, true, 4.5);
  addText(`VERWEERDER (Verhuurder / Beheerder): ${beheerder}`, 9.5, true, 4.5);
  y += 4;

  // Onderwerp
  addText(
    `BETREFT: Verzoekschrift ex art. 7:260 lid 1 BW – Vaststelling betalingsverplichting afrekening stook- en servicekosten over de periode ${afrekenPeriode}`,
    10.5,
    true,
    5
  );
  y += 4;

  // Feitenrelaas
  addText('I. FEITELIJKE TOEDRACHT', 10, true, 5);
  addText(
    `1. Verzoeker huurt de woonruimte aan het adres ${huurderAdres}. Verweerder treedt op als beheerder/verhuurder van het complex.`,
    9.5,
    false,
    4.5
  );
  addText(
    `2. Verweerder heeft aan verzoeker een jaarafrekening service- en stookkosten doen toekomen (opgesteld door meetbedrijf ista Nederland B.V.) met een nagevorderd saldo van € ${betwistBedrag}.`,
    9.5,
    false,
    4.5
  );
  addText(
    '3. Verzoeker heeft tijdig en gemotiveerd schriftelijk bezwaar gemaakt tegen deze afrekening en op grond van artikel 7:259 lid 4 BW volledige inzage gevorderd in de brondocumenten (inkoopfacturen energiebedrijf en technische meetstaten).',
    9.5,
    false,
    4.5
  );
  addText(
    '4. De door verzoeker gestelde wettelijke termijn van drie weken is ongebruikt verstreken, dan wel heeft verweerder geweigerd de onderliggende brondocumenten te overleggen onder verwijzing naar het meetbedrijf.',
    9.5,
    false,
    4.5
  );
  y += 3;

  // Juridische Gronden
  addText('II. JURIDISCHE GRONDEN EN TOETSING AAN BELEIDSBOEK HUURCOMMISSIE', 10, true, 5);
  addText(
    'A. Schending van het wettelijk inzagerecht (Art. 7:259 lid 4 BW): Verweerder weigert de werkelijke energienota’s van het complex ter inzage te leggen. Zonder deze inkoopnota’s ontbeert de vordering iedere deugdelijke grondslag.',
    9,
    false,
    4.5
  );
  addText(
    'B. Ondeugdelijke berekeningswijze warmtekostenverdelers: De door ista geregistreerde eenheden stroken niet met het werkelijke verbruik. Verweerder weigert aan te tonen of de juiste K-waarden (radiatorcapaciteiten) en liggingsfactoren zijn toegepast.',
    9,
    false,
    4.5
  );
  addText(
    'C. Onrechtmatig leidingverlies: Conform vaste jurisprudentie van de Huurcommissie mag ongeïsoleerd leidingverlies bij centrale verwarmingsinstallaties niet eenzijdig worden afgewenteld op individuele huurders via radiatormeters.',
    9,
    false,
    4.5
  );
  y += 3;

  // Het Verzoek (Petitio)
  addText('III. HET VERZOEK', 10, true, 5);
  addText(
    'Verzoeker verzoekt de Huurcommissie met eerbied om:',
    9.5,
    false,
    4.5
  );
  addText(
    `1. De betalingsverplichting van verzoeker ter zake van de service- en stookkosten over de periode ${afrekenPeriode} vast te stellen op nihil (€ 0,00) boven het reeds betaalde voorschot, subsidiair op een door de commissie in goede justitie te bepalen redelijk bedrag;`,
    9,
    false,
    4.5
  );
  addText(
    '2. Te bepalen dat verweerder het door verzoeker voldane voorschotbedrag aan leges integraal aan verzoeker dient te vergoeden.',
    9,
    false,
    4.5
  );
  y += 6;

  // Bijlagenlijst
  addText('IV. BIJLAGEN IN DIT DOSSIER', 10, true, 5);
  addText('• Productie 1: Kopie van de betwiste ista-afrekening;', 9, false, 4);
  addText('• Productie 2: Kopie van de aangetekende sommatiebrief d.d. [Datum brief];', 9, false, 4);
  addText('• Productie 3: Bewijs van verzending / ontvangstbevestiging;', 9, false, 4);
  addText('• Productie 4: Eventuele afwijzende correspondentie van verweerder.', 9, false, 4);
  y += 8;

  addText('Plaats: Leeuwarden / Amsterdam              Datum: ' + new Date().toLocaleDateString('nl-NL'), 9.5, false, 5);
  y += 8;
  addText(huurderNaam, 10, true, 5);
  addText('(Ondertekening verzoeker)', 8.5, false, 5);

  const cleanPeriod = String(afrekenPeriode).replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Huurcommissie_Verzoekschrift_${cleanPeriod}.pdf`);
}
