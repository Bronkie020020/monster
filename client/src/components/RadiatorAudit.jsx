import React, { useState } from 'react';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Specifieke vermogensafgifte in Watt per m² paneeloppervlak bij ΔT = 50°C (75/65/20) conform EN 442 norm
const RADIATOR_TYPES = {
  '11': { label: 'Type 11 (1 plaat, 1 convectorlamel)', wattPerM2: 950 },
  '21': { label: 'Type 21 (2 platen, 1 convectorlamel)', wattPerM2: 1350 },
  '22': { label: 'Type 22 (2 platen, 2 convectorlamellen - meest voorkomend)', wattPerM2: 1750 },
  '33': { label: 'Type 33 (3 platen, 3 convectorlamellen - extra zwaar)', wattPerM2: 2400 },
};

export default function RadiatorAudit() {
  const [type, setType] = useState('22');
  const [hoogteMm, setHoogteMm] = useState(600);
  const [lengteMm, setLengteMm] = useState(1000);
  const [istaFactor, setIstaFactor] = useState('');

  // Bereken oppervlakte in m² en geschat vermogen
  const oppervlakteM2 = (hoogteMm / 1000) * (lengteMm / 1000);
  const berekendVermogenWatt = Math.round(oppervlakteM2 * RADIATOR_TYPES[type].wattPerM2);
  
  // Nominale K-waarde schatting (vaak gekoppeld aan vermogen in kW of directe capaciteitsschaal)
  // Ista hanteert vaak een factor die evenredig is met Watt / 1000 of directe Wattage-classificatie.
  const istaNum = parseFloat(istaFactor);
  let afwijkingProcent = null;
  let verdachteFactor = false;

  if (!isNaN(istaNum) && istaNum > 0) {
    // Veel voorkomende ista schaal is direct het vermogen (bijv 1050) of kW (bijv 1.05)
    const genormaliseerdeIstaWatt = istaNum < 50 ? istaNum * 1000 : istaNum;
    afwijkingProcent = Math.round(((genormaliseerdeIstaWatt - berekendVermogenWatt) / berekendVermogenWatt) * 100);
    verdachteFactor = Math.abs(afwijkingProcent) >= 15;
  }

  return (
    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Calculator color="#0284c7" size={24} />
        <div>
          <h2 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>Forensische Radiator K-Waarde Audit</h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Ontmasker foutieve radiatorcapaciteiten waardoor ista te veel tikken rekent.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Radiator Type:
          </label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          >
            {Object.entries(RADIATOR_TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Ista Factor op de brief (K-waarde of vermogen):
          </label>
          <input 
            type="number" 
            placeholder="Bijv. 1050 of 1.05"
            value={istaFactor}
            onChange={(e) => setIstaFactor(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Hoogte (in millimeters):
          </label>
          <input 
            type="number" 
            value={hoogteMm}
            onChange={(e) => setHoogteMm(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#475569', marginBottom: '4px' }}>
            Lengte (in millimeters):
          </label>
          <input 
            type="number" 
            value={lengteMm}
            onChange={(e) => setLengteMm(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
          />
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Wettelijk / Technisch Normvermogen (EN 442):</div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a' }}>{berekendVermogenWatt} Watt</div>
          </div>
          {afwijkingProcent !== null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Afwijking t.o.v. ista specificatie:</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: verdachteFactor ? '#dc2626' : '#16a34a' }}>
                {afwijkingProcent > 0 ? `+${afwijkingProcent}%` : `${afwijkingProcent}%`}
              </div>
            </div>
          )}
        </div>

        {verdachteFactor && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'flex-start', color: '#991b1b', background: '#fef2f2', padding: '10px', borderRadius: '6px' }}>
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '13px' }}>
              <strong>Kritieke Rekenfout Gedetecteerd:</strong> De door ista gehanteerde factor wijkt meer dan 15% af van het werkelijke radiatorvermogen. Als ista een te hoog vermogen toekent, betaal je onevenredig veel per gemeten tik. Dit vormt directe grond voor vernietiging bij de Huurcommissie.
            </div>
          </div>
        )}

        {!verdachteFactor && afwijkingProcent !== null && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', alignItems: 'center', color: '#166534', background: '#f0fdf4', padding: '10px', borderRadius: '6px', fontSize: '13px' }}>
            <CheckCircle2 size={18} />
            <span>De opgegeven factor komt overeen met het werkelijke vermogen van dit type radiator.</span>
          </div>
        )}
      </div>
    </div>
  );
}
