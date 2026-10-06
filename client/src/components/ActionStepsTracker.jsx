import React, { useState } from 'react';
import { CheckCircle2, Circle, Scale } from 'lucide-react';

export default function ActionStepsTracker({ auditData }) {
  const [completedSteps, setCompletedSteps] = useState([1]); // Stap 1 standaard gereed na scan

  const steps = [
    {
      id: 1,
      title: "Document Geanalyseerd & Vormfouten Gelokaliseerd",
      desc: "De AI-scan heeft de afrekening getoetst aan art. 7:259 BW en geconstateerd dat brondocumenten en K-waarden ontbreken.",
      statusBadge: "Voltooid",
      badgeColor: "#15803d"
    },
    {
      id: 2,
      title: "Sommatiebrief & Beroep op Opschorting Verzenden",
      desc: "Download de officiële PDF-sommatiebrief. Verstuur deze direct per e-mail (met leesbevestiging) én per aangetekende post naar Hoekstra Vastgoedbeheer.",
      actionText: "Wettelijke grondslag: Art. 7:259 lid 4 BW & Art. 6:52 BW"
    },
    {
      id: 3,
      title: "Betaling Nagevorderd Saldo Pauzeren",
      desc: `Schort de betaling van € ${auditData.bijteBetalenSaldo || '0.00'} op. Blijf uw normale kale huur en maandelijkse voorschotten altijd stipt doorbetalen. Laat u niet intimideren door automatische herinneringen.`,
      actionText: "Incassobescherming: vordering is gemotiveerd betwist"
    },
    {
      id: 4,
      title: "Wachten op de 21-Dagen Termijn (Wettelijk Verzuim)",
      desc: "Hoekstra heeft 3 weken de tijd om de originele gasfacturen van het complex en het ista-rapport te overleggen. Zwijgen ze of wijzen ze naar ista? Dan staan ze juridisch in verzuim.",
      actionText: "Termijn: 21 kalenderdagen na verzenddatum"
    },
    {
      id: 5,
      title: "Procedure Starten bij de Huurcommissie",
      desc: "Geen volledige inzage ontvangen binnen 3 weken? Dien online een verzoekschrift in bij Huurcommissie.nl ('Geschil Verwarmingskosten'). Hoekstra wordt gedwongen alle inkoopbonnen te tonen. Zo niet, dan vervalt de naheffing integraal.",
      actionText: "Kosten: leges worden terugbetaald na winst"
    }
  ];

  const toggleStep = (id) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(s => s !== id));
    } else {
      setCompletedSteps([...completedSteps, id]);
    }
  };

  return (
    <div style={{ marginTop: '24px', background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Scale size={24} color="#0f172a" />
        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
          Uw Juridische Stappenplan naar 100% Gelijk
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0, marginBottom: '20px' }}>
        Volg deze stappen exact om juridisch onaantastbaar te staan tegenover Hoekstra en ista.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {steps.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div 
              key={step.id}
              onClick={() => toggleStep(step.id)}
              style={{
                display: 'flex',
                gap: '14px',
                padding: '14px',
                borderRadius: '8px',
                border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                background: isDone ? '#f0fdf4' : '#fafafa',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ paddingTop: '2px' }}>
                {isDone ? (
                  <CheckCircle2 size={22} color="#16a34a" />
                ) : (
                  <Circle size={22} color="#94a3b8" />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', fontSize: '14px', color: isDone ? '#166534' : '#1e293b' }}>
                    Stap {step.id}: {step.title}
                  </span>
                  {step.statusBadge && (
                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                      {step.statusBadge}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: isDone ? '#14532d' : '#475569', margin: '6px 0 8px 0', lineHeight: 1.4 }}>
                  {step.desc}
                </p>
                {step.actionText && (
                  <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: '500' }}>
                    👉 {step.actionText}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
