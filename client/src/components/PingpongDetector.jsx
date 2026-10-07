import React, { useState } from 'react';
import { ShieldAlert, Copy, Check, MessageSquareOff, ArrowRightLeft, PhoneOff } from 'lucide-react';

const RESPONSES = {
  ista_verwijzing: {
    title: 'Hoekstra zegt: "U moet contact opnemen met ista, wij hebben de berekening niet gemaakt"',
    wetsartikelen: 'Art. 7:259 lid 1 & 4 BW, Art. 6:76 BW (Aansprakelijkheid voor hulppersonen)',
    tekst: (beheerder = 'Hoekstra Vastgoedbeheer') => `Geachte heer/mevrouw,

Onder verwijzing naar uw bericht waarin u mij doorverwijst naar ista Nederland B.V., wijs ik dit standpunt op grond van dwingend huurrecht uitdrukkelijk van de hand.

1. Contractuele en wettelijke verantwoordingsplicht:
Op grond van artikel 7:259 lid 1 en lid 4 van het Burgerlijk Wetboek rust de wettelijke verplichting tot het verstrekken en onderbouwen van de afrekening van de service- en energiekosten te allen tijde op u als verhuurder/beheerder. Ik heb als huurder geen enkele contractuele rechtsverhouding met ista.

2. Aansprakelijkheid voor hulppersonen (Art. 6:76 BW):
Ista treedt in deze uitsluitend op als uw ingeschakelde hulppersoon/meetdienst. Ingevolge artikel 6:76 BW bent u voor het handelen en de administratie van deze hulppersoon op gelijke wijze aansprakelijk als voor uw eigen gedragingen. Het doorschuiven van de verantwoordingsplicht kwalificeert in rechte niet als een bevrijdend verweer.

Ik verzoek u dan ook om binnen de reeds gestelde termijn zélf de gevraagde brondocumenten (inkoopfacturen energieleverancier en technische opnamerapporten) te verstrekken. Zolang u hieraan niet voldoet, blijft mijn beroep op het opschortingsrecht ex artikel 6:52 BW onverminderd van kracht.

Hoogachtend,`
  },
  telefonisch_contact: {
    title: 'Hoekstra wil telefonisch overleggen ("Wij bellen u even om het uit te leggen")',
    wetsartikelen: 'Dossiervorming conform Huurcommissie & Art. 6:52 BW',
    tekst: () => `Geachte heer/mevrouw,

Naar aanleiding van uw voorstel tot telefonisch overleg deel ik u mede dat ik uitsluitend schriftelijk communiceer over de betwiste jaarafrekening service- en stookkosten.

Gelet op het formele karakter van het geschil, het ingeroepen opschortingsrecht (art. 6:52 BW) en de eventueel aanhangig te maken procedure bij de Huurcommissie dan wel kantonrechter, is een volledige, verifieerbare schriftelijke verslaglegging noodzakelijk. 

Ik verzoek u dan ook om uw inhoudelijke standpunt en de eerder gevorderde brondocumenten (originele gas/warmtenota's en meetstaten) per ommegaande per e-mail aan mij toe te zenden.

Hoogachtend,`
  },
  standaard_afwijzing: {
    title: 'Hoekstra reageert met een standaardbrief: "De meters zijn geijkt en wijken nooit af"',
    wetsartikelen: 'Art. 7:259 lid 4 BW, Beleidsboek Huurcommissie § 5.2',
    tekst: () => `Geachte heer/mevrouw,

Uw mededeling dat de warmtemeters gecertificeerd zijn, doet niet ter zake voor hetgeen bij brief d.d. is gevorderd. 

De betwisting ziet niet primair op de mechanische werking van het telwerk, doch op:
1. De controleerbaarheid van de inkoopfacturen van het energiebedrijf van het gehele complex (art. 7:259 lid 4 BW);
2. De gehanteerde K-waarden (radiatorcapaciteitsfactoren) en liggingscorrecties;
3. De toerekening van ongecompenseerd leidingverlies conform de vaste richtlijnen van de Huurcommissie.

Aangezien een algemene verklaring omtrent meterijking niet voldoet aan de wettelijke stelplicht van art. 7:259 lid 4 BW, blijft de betalingsverplichting integraal opgeschort ex art. 6:52 BW totdat de specifieke brondocumenten zijn overgelegd.

Hoogachtend,`
  }
};

export default function PingpongDetector({ beheerder = 'Hoekstra Vastgoedbeheer' }) {
  const [selectedCase, setSelectedCase] = useState('ista_verwijzing');
  const [copied, setCopied] = useState(false);

  const current = RESPONSES[selectedCase];
  const generatedText = current.tekst(beheerder);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <ArrowRightLeft color="#dc2626" size={24} />
        <div>
          <h2 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>Anti-Pingpong Detector & Weerwoord Generator</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Snoer doorschuiftrucs direct de mond met dwingend aansprakelijkheidsrecht.</p>
        </div>
      </div>

      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>
        Welke reactie heb je ontvangen van de beheerder?
      </label>
      <select 
        value={selectedCase} 
        onChange={(e) => setSelectedCase(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '16px' }}
      >
        <option value="ista_verwijzing">"U moet bij ista zijn, niet bij ons" (Doorschuiftruc)</option>
        <option value="telefonisch_contact">"Zullen we even bellen?" (Mondeling ontwijken van dossieropbouw)</option>
        <option value="standaard_afwijzing">"Onze meters zijn gecertificeerd en wijken nooit af" (Standaardafwijzing)</option>
      </select>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Wettelijke grondslag:
        </div>
        <div style={{ fontSize: '13px', color: '#1e293b', marginTop: '2px', fontWeight: '500' }}>
          {current.wetsartikelen}
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        <textarea 
          readOnly 
          value={generatedText} 
          rows={12} 
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '13px',
            lineHeight: '1.5',
            fontFamily: 'monospace',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            boxSizing: 'border-box'
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: copied ? '#16a34a' : '#0f172a',
            color: '#fff',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Gekopieerd!' : 'Kopieer Repliek'}
        </button>
      </div>
    </div>
  );
}
