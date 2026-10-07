import React, { useState } from 'react';
import { Camera, ShieldAlert, Download, Mic, FileText, CheckSquare } from 'lucide-react';
import { generateLegalLetterPdf } from './utils/generatePdf';
import InteractiveChecklist from './components/InteractiveChecklist';
import VoiceLawyerBrief from './components/VoiceLawyerBrief';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'checklist' | 'voice'
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [userDetails, setUserDetails] = useState({
    naam: '',
    adres: '',
    postcodePlaats: '',
    email: '',
    telefoon: ''
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('invoice', file);

    try {
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3001/api/scan' : '/api/scan';
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Serverfout bij analyseren van factuur');
      }
      setData(result);
    } catch (err) {
      alert('Er ging iets mis bij het analyseren van de factuur: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '30px auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1 style={{ color: '#0f172a', fontSize: '26px', margin: '0 0 8px 0' }}>
          ista & Vastgoedbeheer Dispute Shield
        </h1>
        <p style={{ color: '#475569', fontSize: '14px', margin: 0 }}>
          Wettelijke verweer-engine, stappentracker en spraakgestuurde advocatenbriefing conform Boek 7 BW.
        </p>
      </header>

      {/* Navigatiemenu / Tabs */}
      <nav style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('scanner')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'scanner' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'scanner' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
        >
          <Camera size={16} /> 1. Factuur Scanner & Sommatie
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'checklist' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'checklist' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckSquare size={16} /> 2. Juridische Checklist & Tips
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'voice' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'voice' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'all 0.2s ease'
          }}
        >
          <Mic size={16} /> 3. Inspreken voor Advocaat
        </button>
      </nav>

      {/* Tab 1: Scanner */}
      {activeTab === 'scanner' && (
        <div>
          <div style={{
            border: '2px dashed #94a3b8',
            borderRadius: '12px',
            padding: '36px',
            textAlign: 'center',
            background: '#ffffff',
            cursor: 'pointer'
          }}>
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              capture="environment" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              id="camera-upload" 
            />
            <label htmlFor="camera-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Camera size={44} color="#0284c7" style={{ marginBottom: '10px' }} />
              <span style={{ fontWeight: '600', color: '#0f172a' }}>Maak een foto of upload de jaarafrekening</span>
              <span style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>PNG, JPG of duidelijke smartphonefoto</span>
            </label>
          </div>

          {loading && (
            <p style={{ textAlign: 'center', marginTop: '20px', color: '#0284c7', fontWeight: '500' }}>
              Document analyseren met Gemini AI en toetsen aan artikelen 7:259 BW & 6:52 BW...
            </p>
          )}

          {data && (
            <div style={{ marginTop: '24px' }}>
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991b1b', fontWeight: 'bold' }}>
                  <ShieldAlert size={20} />
                  <span>Gedetecteerde Juridische Schendingen ({data.legalViolations?.length || 0})</span>
                </div>
                <ul style={{ marginTop: '8px', color: '#7f1d1d', fontSize: '13px', paddingLeft: '20px' }}>
                  {data.legalViolations?.map((item, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px' }}>
                <h3 style={{ margin: '0 0 14px 0', fontSize: '17px', color: '#0f172a' }}>Factuur Samenvatting</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
                  <div><strong>Geadresseerde:</strong> {data.audit?.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer'}</div>
                  <div><strong>Factuurdatum:</strong> {data.audit?.factuurDatum || 'Onbekend'}</div>
                  <div><strong>Afrekenperiode:</strong> {data.audit?.afrekenPeriode || 'Onbekend'}</div>
                  <div style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    <strong>Betwist Saldo (Naheffing):</strong> € {data.audit?.bijteBetalenSaldo || '0.00'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Uw gegevens voor op het bezwaar:</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '8px' }}>
                    <input 
                      type="text" 
                      placeholder="Volledige Naam" 
                      value={userDetails.naam} 
                      onChange={(e) => setUserDetails({ ...userDetails, naam: e.target.value })} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Adres & Huisnummer" 
                      value={userDetails.adres} 
                      onChange={(e) => setUserDetails({ ...userDetails, adres: e.target.value })} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                    <input 
                      type="text" 
                      placeholder="Postcode en Plaats" 
                      value={userDetails.postcodePlaats} 
                      onChange={(e) => setUserDetails({ ...userDetails, postcodePlaats: e.target.value })} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                    <input 
                      type="email" 
                      placeholder="E-mailadres" 
                      value={userDetails.email} 
                      onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} 
                      style={{ padding: '8px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => generateLegalLetterPdf(data.audit, userDetails)}
                  style={{
                    width: '100%',
                    background: '#0f172a',
                    color: '#ffffff',
                    padding: '13px',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <Download size={18} />
                  Download Aangetekende Sommatiebrief Hoekstra (PDF)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Stappen Tracker & Checklist */}
      {activeTab === 'checklist' && (
        <InteractiveChecklist auditData={data?.audit || null} />
      )}

      {/* Tab 3: Inspreken voor Advocaat */}
      {activeTab === 'voice' && (
        <VoiceLawyerBrief auditData={data?.audit} userDetails={userDetails} />
      )}
    </div>
  );
}
