import React, { useState } from 'react';
import { Camera, ShieldAlert, Download, Mic, FileText, CheckSquare, FileUp, CheckCircle2, UploadCloud } from 'lucide-react';
import { generateLegalLetterPdf } from './utils/generatePdf';
import InteractiveChecklist from './components/InteractiveChecklist';
import VoiceLawyerBrief from './components/VoiceLawyerBrief';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner'); // 'scanner' | 'checklist' | 'voice'
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);
  const [userDetails, setUserDetails] = useState({
    naam: '',
    adres: '',
    postcodePlaats: '',
    email: '',
    telefoon: ''
  });

  const processFile = async (file) => {
    if (!file) return;

    setSelectedFile(file);
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
      alert('Er ging iets mis bij het analyseren van het document: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
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
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed #0284c7' : '2px dashed #94a3b8',
              borderRadius: '12px',
              padding: '40px 24px',
              textAlign: 'center',
              background: isDragging ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input 
              type="file" 
              accept=".pdf,application/pdf,image/png,image/jpeg,image/webp" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              id="file-upload" 
            />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: '#0284c7' }}>
                  <FileUp size={36} />
                </div>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#475569' }}>
                  <Camera size={36} />
                </div>
              </div>

              <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '16px' }}>
                Upload PDF-jaarafrekening of maak een foto
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                Sleep je bestand hierheen of klik om te bladeren
              </span>

              {/* Ondersteunde formaten & badges */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  📄 PDF (alle pagina's ondersteund)
                </span>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  📷 PNG / JPG
                </span>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 9px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  Tot 35 MB
                </span>
              </div>

              {selectedFile && (
                <div style={{
                  marginTop: '16px',
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#166534',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={16} />
                  Geselecteerd: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </label>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <p style={{ margin: 0, color: '#0284c7', fontWeight: '600', fontSize: '14px' }}>
                ⏳ Document analyseren met Gemini 2.5 Flash...
              </p>
              <p style={{ margin: '4px 0 0 0', color: '#0369a1', fontSize: '12.5px' }}>
                Alle pagina's, verbruikstabel(len), voorschotten en meetbedrijf-specificaties worden getoetst aan artikelen 7:259 BW & 6:52 BW.
              </p>
            </div>
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
