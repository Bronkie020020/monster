import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ShieldCheck, 
  Scale, 
  PhoneOff, 
  FileCheck, 
  Ban, 
  Calendar, 
  Send, 
  RefreshCw,
  Info,
  ExternalLink
} from 'lucide-react';

const STORAGE_KEY = 'dispute_shield_checklist_v1';
const SCENARIO_STORAGE_KEY = 'dispute_shield_scenario_v1';

const SCENARIOS = [
  {
    id: 'net_ontvangen',
    label: 'Net de jaarafrekening ontvangen (Bezwaar starten)',
    badgeColor: '#0284c7',
    proTip: {
      title: 'Do\'s & Don\'ts: Direct na ontvangst',
      doText: 'Betaal de naheffing niet direct en onderteken geen akkoordverklaring. Boek 7 BW verplicht de beheerder om alle onderliggende inkoopnota\'s van het energiebedrijf én de meterstanden ter inzage te leggen.',
      dontText: 'Laat je niet intimideren door een korte betalingstermijn (bijv. "binnen 14 dagen"). Zolang je gemotiveerd bezwaar maakt ex art. 7:259 lid 4 BW, schort je de betaling rechtmatig op.'
    }
  },
  {
    id: 'wachttijd_21_dagen',
    label: 'Bezwaarbrief verstuurd (In de 21-dagen wachttijd)',
    badgeColor: '#d97706',
    proTip: {
      title: 'Do\'s & Don\'ts: Wachttijd & Bewijslast',
      doText: 'Houd de datum nauwkeurig bij in je agenda. Hoekstra heeft 21 kalenderdagen vanaf ontvangst om integrale afschriften van de energiefacturen en het ista-rapport te verstrekken. Bewaar je verzendbewijs en e-mailbevestiging veilig in je dossier.',
      dontText: 'Accepteer geen vage antwoorden zoals "wij hebben de stukken niet, vraag maar aan ista". De wet verplicht de verhuurder/beheerder om deze stukken zélf te tonen.'
    }
  },
  {
    id: 'geen_gehoor_huurcommissie',
    label: 'Geen gehoor of weigering ontvangen van Hoekstra (Naar Huurcommissie)',
    badgeColor: '#dc2626',
    proTip: {
      title: 'Do\'s & Don\'ts: Starten Huurcommissie Procedure',
      doText: 'Zijn de 21 dagen voorbij zonder volledige inzage? Dien online een verzoekschrift in via Huurcommissie.nl onder "Geschil nutsvoorzieningen en servicekosten". Hoekstra wordt dwingend opgedragen de brondocumenten te bewijzen; ontbreken deze, dan vervalt de naheffing.',
      dontText: 'Wacht niet langer dan 30 maanden na afloop van het kalenderjaar. Blijf niet eindeloos e-mailen als ze weigeren: de Huurcommissie is de bindende vervolgstap.'
    }
  },
  {
    id: 'incasso_dreiging',
    label: 'Dreiging met incasso / aanmaning ontvangen',
    badgeColor: '#7c3aed',
    proTip: {
      title: 'Do\'s & Don\'ts: Incassobescherming ex Art. 6:52 BW',
      doText: 'Niet schrikken! Een incassobureau mag een gemotiveerd betwiste vordering niet zomaar innen. Stuur het incassobureau direct een kopie van je sommatiebrief en meld: "De vordering is integraal betwist wegens schending art. 7:259 lid 4 BW; betaling is opgeschort ex art. 6:52 BW. Verwijs de zaak terug naar uw opdrachtgever."',
      dontText: 'Betaal nooit onder druk van dreigende incassokosten of loonbeslagpraatjes. Zonder rechterlijk vonnis kan een incassobureau niets afdwingen.'
    }
  },
  {
    id: 'telefonisch_overleg',
    label: 'Vastgoedbeheerder vraagt om telefonisch overleg',
    badgeColor: '#e11d48',
    proTip: {
      title: 'Do\'s & Don\'ts: Weiger Telefoongesprekken',
      doText: 'Reageer schriftelijk met: "In het belang van een zuivere dossiervorming en juridische verificatie communiceer ik in dit geschil uitsluitend schriftelijk per e-mail." Zo dwing je hen tot concrete, controleerbare toezeggingen.',
      dontText: 'Ga NOOIT telefonisch in discussie. Aan de telefoon proberen beheerders huurders te overdonderen met technische vaktermen of toezeggingen die later niet te bewijzen zijn.'
    }
  }
];

const CHECKLIST_ITEMS = [
  {
    id: 'scan_done',
    title: 'Foto/scan gemaakt van alle pagina\'s van de ista-afrekening',
    subtitle: 'Basisdossier vastleggen inclusief specificaties en meterstanden',
    doneBadge: 'Dossier Geregistreerd',
    doneDetails: 'U heeft de originele afrekening gedocumenteerd en door de AI-analyzer laten scannen op Boek 7 BW gebreken.',
    actionRequired: 'Controleer of alle pagina\'s (ook de achterkant en de verdeelsleutel van meetbedrijf ista) scherp zijn vastgelegd.',
    pitfalls: 'Beheerders proberen vaak alleen de eerste pagina te bespreken en laten de misleidende K-waardecorrecties op latere pagina\'s onvermeld.',
    lawRef: 'Art. 7:259 lid 1 & 2 BW'
  },
  {
    id: 'letter_downloaded',
    title: 'Aangetekende sommatiebrief gedownload en digitaal ondertekend',
    subtitle: 'Officiële PDF met dwingende vordering tot inzage en opschorting',
    doneBadge: 'Brief Gegenereerd',
    doneDetails: 'De sommatiebrief bevat de correcte juridische bepalingen (art. 7:259 lid 4 BW en het opschortingsrecht ex art. 6:52 BW).',
    actionRequired: 'Download de PDF via de knop hierboven, controleer uw ingevulde persoonsgegevens en sla het document lokaal op.',
    pitfalls: 'Zorg dat uw naam en het juiste correspondentieadres overeenkomen met het huurcontract.',
    lawRef: 'Art. 6:52 BW & Art. 7:259 lid 4 BW'
  },
  {
    id: 'letter_sent',
    title: 'Brief verstuurd per e-mail met leesbevestiging én per aangetekende post',
    subtitle: 'Dubbele verzending sluit ontkenning van ontvangst juridisch uit',
    doneBadge: 'Rechtsgeldig Verzonden',
    doneDetails: 'U heeft de sommatiebrief zowel digitaal als fysiek aangeboden aan het directieadres van Hoekstra Vastgoedbeheer.',
    actionRequired: 'Verstuur de brief per e-mail met ontvangst-/leesbevestiging naar het officiële servicekosten e-mailadres én doe een aangetekende zending op de post.',
    pitfalls: 'Beheerders beweren regelmatig "de brief nooit te hebben ontvangen". Met een PostNL Track & Trace code en e-mailbevestiging staat de ontvangstdatum onomstotelijk vast.',
    lawRef: 'Art. 3:37 lid 3 BW (Ontvangsttheorie)'
  },
  {
    id: 'direct_debit_blocked',
    title: 'Automatische incasso van het betwiste naheffingsbedrag geblokkeerd/gestorneerd bij de bank',
    subtitle: 'Voorkom dat het bedrag ongemerkt van uw rekening wordt afgeschreven',
    doneBadge: 'Betaling Veiliggesteld',
    doneDetails: 'U heeft de bankrekening beschermd tegen automatische incasso van de naheffing, terwijl uw reguliere kale huur gewoon doorloopt.',
    actionRequired: 'Log in bij uw bankieren-app en blokkeer eenmalige incasso\'s van de beheerder of storneer het bedrag binnen 8 weken indien al afgeschreven.',
    pitfalls: 'Let op: storneer NOOIT uw maandelijkse reguliere huur en voorschotten, enkel en alleen het betwiste naheffingsbedrag!',
    lawRef: 'Art. 6:52 BW (Wettelijk Opschortingsrecht)'
  },
  {
    id: 'deadline_calendar',
    title: '21-dagen agendamelding ingesteld voor het verstrijken van de wettelijke termijn',
    subtitle: 'Start van het juridisch verzuim van de verhuurder bij niet-nakoming',
    doneBadge: 'Termijn Geagendeerd',
    doneDetails: 'De 21-kalenderdagen reactietermijn is vastgelegd vanaf de datum van ontvangst van uw sommatiebrief.',
    actionRequired: 'Zet een agendamelding 21 dagen na de verzenddatum. Komen de brondocumenten niet binnen? Dan treedt van rechtswege verzuim in.',
    pitfalls: 'Beheerders rekken tijd door pas na 20 dagen te zeggen dat ze "nog even navraag doen bij ista". Laat u niet aan het lijntje houden.',
    lawRef: 'Art. 6:81 BW & Art. 7:259 lid 4 BW'
  },
  {
    id: 'huurcommissie_prep',
    title: 'Dossier klaargezet voor formele indiening bij Huurcommissie.nl',
    subtitle: 'Sluitstuk: bindende vernietiging van de afrekening bij aanhoudend verzuim',
    doneBadge: 'Klaar voor Arbitrage',
    doneDetails: 'Uw dossier (factuur, sommatiebrief, verzendbewijs, termijnoverschrijding) ligt gereed voor het online formulier.',
    actionRequired: 'Ga na dag 21 naar Huurcommissie.nl, log in met DigiD en start de zaak "Jaarafrekening service- en verwarmingskosten".',
    pitfalls: 'De leges bedragen ca. € 25,- maar deze krijgt u 100% terugbetaald zodra Hoekstra in het ongelijk wordt gesteld (wat vrijwel altijd gebeurt bij ontbrekende brondocumenten).',
    lawRef: 'Art. 7:260 BW & Uitvoeringswet Huurprijzen'
  }
];

export default function InteractiveChecklist({ auditData }) {
  // Scenario state
  const [selectedScenario, setSelectedScenario] = useState(() => {
    return localStorage.getItem(SCENARIO_STORAGE_KEY) || SCENARIOS[0].id;
  });

  // Checklist completion state
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Fout bij laden van checklist uit localStorage', e);
    }
    // Standaard stap 1 voltooid als auditData aanwezig is
    return auditData ? ['scan_done'] : [];
  });

  // Expanded accordion states
  const [expandedItems, setExpandedItems] = useState({
    scan_done: true,
    letter_downloaded: true
  });

  // Save checklist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedItems));
    } catch (e) {
      console.error('Fout bij opslaan in localStorage', e);
    }
  }, [completedItems]);

  // Save scenario to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SCENARIO_STORAGE_KEY, selectedScenario);
    } catch (e) {
      console.error('Fout bij opslaan scenario in localStorage', e);
    }
  }, [selectedScenario]);

  const toggleItem = (id) => {
    setCompletedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const resetChecklist = () => {
    if (window.confirm('Weet u zeker dat u de checklist wilt resetten?')) {
      const resetState = auditData ? ['scan_done'] : [];
      setCompletedItems(resetState);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetState));
    }
  };

  const activeScenario = SCENARIOS.find(s => s.id === selectedScenario) || SCENARIOS[0];
  const progressPercent = Math.round((completedItems.length / CHECKLIST_ITEMS.length) * 100);

  return (
    <div style={{
      marginTop: '28px',
      background: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '24px 24px 18px 24px',
        borderBottom: '1px solid #f1f5f9',
        background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: '#0f172a',
              color: '#38bdf8',
              padding: '8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scale size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '19px', color: '#0f172a', fontWeight: '700' }}>
                Interactieve Juridische Actieplanner & Checklist
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                Conform Boek 7 Burgerlijk Wetboek & Huurcommissie Protocol
              </p>
            </div>
          </div>

          <button 
            onClick={resetChecklist}
            title="Reset checklist voortgang"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              color: '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#0f172a'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            <RefreshCw size={13} />
            Reset Voortgang
          </button>
        </div>

        {/* 1. INTERACTIEVE SCENARIO KIEZER */}
        <div style={{ marginTop: '16px' }}>
          <label htmlFor="scenario-select" style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
            marginBottom: '6px'
          }}>
            📍 Wat is jouw huidige situatie?
          </label>
          <div style={{ position: 'relative' }}>
            <select
              id="scenario-select"
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#0f172a',
                background: '#f8fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0284c7'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            >
              {SCENARIOS.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.label}
                </option>
              ))}
            </select>
            <div style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#64748b'
            }}>
              <ChevronDown size={18} />
            </div>
          </div>
        </div>

        {/* DYNAMISCHE PRO-TIP BANNER */}
        <div style={{
          marginTop: '16px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          padding: '14px 16px',
          display: 'flex',
          gap: '12px'
        }}>
          <div style={{ color: '#0284c7', paddingTop: '2px' }}>
            <Lightbulb size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontWeight: '700', fontSize: '13.5px', color: '#0369a1' }}>
                💡 Pro-Tip: {activeScenario.proTip.title}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#0c4a6e', lineHeight: '1.5' }}>
              <p style={{ margin: '0 0 6px 0' }}>
                <strong style={{ color: '#15803d' }}>✓ DO:</strong> {activeScenario.proTip.doText}
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#b91c1c' }}>✗ DON'T:</strong> {activeScenario.proTip.dontText}
              </p>
            </div>
          </div>
        </div>

        {/* 2. PROGRESS BAR */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
              Voortgang Dossier & Actieplan
            </span>
            <span style={{
              fontSize: '12.5px',
              fontWeight: '700',
              color: progressPercent === 100 ? '#16a34a' : '#0284c7',
              background: progressPercent === 100 ? '#dcfce7' : '#e0f2fe',
              padding: '2px 8px',
              borderRadius: '12px'
            }}>
              {completedItems.length} van de {CHECKLIST_ITEMS.length} stappen afgerond — {progressPercent}%
            </span>
          </div>

          <div style={{
            height: '10px',
            background: '#e2e8f0',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: progressPercent === 100 
                ? 'linear-gradient(90deg, #16a34a, #22c55e)' 
                : 'linear-gradient(90deg, #0284c7, #38bdf8)',
              borderRadius: '999px',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }} />
          </div>
        </div>
      </div>

      {/* 3. CHECKLIST ACCORDION ITEMS */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {CHECKLIST_ITEMS.map((item, index) => {
          const isDone = completedItems.includes(item.id);
          const isExpanded = !!expandedItems[item.id];

          return (
            <div
              key={item.id}
              style={{
                border: isDone ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                borderRadius: '8px',
                background: isDone ? '#f0fdf4' : '#ffffff',
                transition: 'all 0.2s ease',
                boxShadow: isExpanded ? '0 2px 4px rgba(0,0,0,0.03)' : 'none'
              }}
            >
              {/* Item Header / Checkbox row */}
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  gap: '12px'
                }}
                onClick={() => toggleExpand(item.id)}
              >
                {/* Checkbox Button */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleItem(item.id);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: '2px',
                    transition: 'transform 0.15s ease'
                  }}
                  title={isDone ? 'Klik om als niet-afgerond te markeren' : 'Klik om als afgerond te markeren'}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.9)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {isDone ? (
                    <CheckCircle2 size={24} color="#16a34a" style={{ flexShrink: 0 }} />
                  ) : (
                    <Circle size={24} color="#94a3b8" style={{ flexShrink: 0 }} />
                  )}
                </div>

                {/* Title & Subtitle */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: '600',
                      fontSize: '14px',
                      color: isDone ? '#15803d' : '#0f172a',
                      textDecoration: isDone ? 'none' : 'none'
                    }}>
                      Stap {index + 1}: {item.title}
                    </span>
                    {isDone && (
                      <span style={{
                        fontSize: '11px',
                        background: '#dcfce7',
                        color: '#166534',
                        padding: '1px 7px',
                        borderRadius: '6px',
                        fontWeight: '700'
                      }}>
                        {item.doneBadge}
                      </span>
                    )}
                  </div>
                  <p style={{
                    margin: '3px 0 0 0',
                    fontSize: '12px',
                    color: isDone ? '#166534' : '#64748b',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item.subtitle}
                  </p>
                </div>

                {/* Chevron Toggle */}
                <div style={{
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '4px'
                }}>
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Collapsible Details Content */}
              {isExpanded && (
                <div style={{
                  padding: '0 16px 16px 52px',
                  borderTop: isDone ? '1px dashed #bbf7d0' : '1px dashed #e2e8f0',
                  marginTop: '4px',
                  paddingTop: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontSize: '13px'
                }}>
                  {/* Wat is er gedaan? */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: '700', marginBottom: '4px', fontSize: '12px' }}>
                      <FileCheck size={16} />
                      <span>WAT IS ER GEDAAN?</span>
                    </div>
                    <div style={{ color: '#334155', lineHeight: '1.45' }}>
                      {item.doneDetails}
                    </div>
                  </div>

                  {/* Wat moet er nu gebeuren? */}
                  <div style={{
                    background: isDone ? '#ffffff' : '#fffbeb',
                    border: isDone ? '1px solid #e2e8f0' : '1px solid #fef3c7',
                    borderRadius: '6px',
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: isDone ? '#0284c7' : '#d97706', fontWeight: '700', marginBottom: '4px', fontSize: '12px' }}>
                      <Clock size={16} />
                      <span>WAT MOET ER NU GEBEUREN?</span>
                    </div>
                    <div style={{ color: '#451a03', lineHeight: '1.45' }}>
                      {item.actionRequired}
                    </div>
                  </div>

                  {/* Risico's & Valkuilen */}
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '10px 12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#b91c1c', fontWeight: '700', marginBottom: '4px', fontSize: '12px' }}>
                      <AlertTriangle size={16} />
                      <span>RISICO'S & VALKUILEN VAN DE BEHEERDER</span>
                    </div>
                    <div style={{ color: '#7f1d1d', lineHeight: '1.45' }}>
                      {item.pitfalls}
                    </div>
                  </div>

                  {/* Wetsartikel badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                    <ShieldCheck size={15} color="#0284c7" />
                    <span style={{ fontSize: '11.5px', color: '#0369a1', fontWeight: '600' }}>
                      Wettelijke Verankering: {item.lawRef}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
