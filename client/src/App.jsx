import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShieldAlert, 
  Download, 
  Mic, 
  FileText, 
  CheckSquare, 
  FileUp, 
  CheckCircle2, 
  ArrowRightLeft, 
  Calculator, 
  Scale, 
  Gavel,
  FolderArchive,
  PlusCircle,
  Layers,
  Files
} from 'lucide-react';
import { generateLegalLetterPdf } from './utils/generatePdf';
import { generateHuurcommissieDossier } from './utils/generateHuurcommissieDossier';
import InteractiveChecklist from './components/InteractiveChecklist';
import VoiceLawyerBrief from './components/VoiceLawyerBrief';
import PingpongDetector from './components/PingpongDetector';
import RadiatorAudit from './components/RadiatorAudit';
import DossierHistory from './components/DossierHistory';

const DOSSIERS_STORAGE_KEY = 'dispute_shield_dossiers_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState('scan'); // 'scan' | 'checklist' | 'pingpong' | 'radiator' | 'voice' | 'history'
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [data, setData] = useState(null);
  const [currentDossierId, setCurrentDossierId] = useState(null);
  
  // Laad opgeslagen dossiers uit localStorage
  const [dossiers, setDossiers] = useState(() => {
    try {
      const saved = localStorage.getItem(DOSSIERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Fout bij laden van dossiers uit localStorage', e);
    }
    return [];
  });

  const [userDetails, setUserDetails] = useState({
    naam: '',
    adres: '',
    postcodePlaats: '',
    email: '',
    telefoon: ''
  });

  // Bewaar dossiers in localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DOSSIERS_STORAGE_KEY, JSON.stringify(dossiers));
    } catch (e) {
      console.error('Fout bij opslaan van dossiers in localStorage', e);
    }
  }, [dossiers]);

  const processFiles = async (filesList) => {
    const filesArray = Array.from(filesList);
    if (!filesArray || filesArray.length === 0) return;

    // Controleer totale bestandsgrootte (max 100 MB)
    const totalBytes = filesArray.reduce((acc, f) => acc + f.size, 0);
    if (totalBytes > 105 * 1024 * 1024) {
      alert('De totale grootte van de geüploade bestanden is groter dan 100 MB. Verklein de documenten a.u.b.');
      return;
    }

    setSelectedFiles(filesArray);
    setLoading(true);

    const formData = new FormData();
    filesArray.forEach((file) => {
      formData.append('invoices', file);
    });

    try {
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3001/api/scan' : '/api/scan';
      const res = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Serverfout bij analyseren van documenten');
      }

      setData(result);

      // Maak nieuw dossier aan en sla op in geschiedenis
      const newDossierId = Date.now().toString();
      const newDossier = {
        id: newDossierId,
        timestamp: new Date().toISOString(),
        formattedDate: new Date().toLocaleDateString('nl-NL', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        audit: result.audit,
        legalViolations: result.legalViolations,
        filesCount: filesArray.length,
        fileNames: filesArray.map(f => f.name),
        totalSizeMb: (totalBytes / (1024 * 1024)).toFixed(2)
      };

      setDossiers((prev) => [newDossier, ...prev.filter(d => d.id !== newDossierId)]);
      setCurrentDossierId(newDossierId);

    } catch (err) {
      alert('Er ging iets mis bij het analyseren van het dossier: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
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
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Schakel direct naar een dossier uit de geschiedenis
  const handleSelectDossier = (dossier) => {
    setData({
      success: true,
      audit: dossier.audit,
      legalViolations: dossier.legalViolations
    });
    setCurrentDossierId(dossier.id);
    setSelectedFiles([]);
    setActiveTab('scan');
  };

  // Start een nieuwe scan (reset huidig actief dossier)
  const handleStartNewScan = () => {
    setData(null);
    setCurrentDossierId(null);
    setSelectedFiles([]);
    setActiveTab('scan');
  };

  // Verwijder dossier
  const handleDeleteDossier = (id) => {
    if (window.confirm('Weet u zeker dat u dit dossier uit de geschiedenis wilt verwijderen?')) {
      setDossiers((prev) => prev.filter(d => d.id !== id));
      if (currentDossierId === id) {
        setCurrentDossierId(null);
        setData(null);
      }
    }
  };

  // Wis alle dossiers
  const handleClearAllDossiers = () => {
    if (window.confirm('Weet u zeker dat u ALLE opgeslagen dossiers wilt wissen?')) {
      setDossiers([]);
      setCurrentDossierId(null);
      setData(null);
    }
  };

  return (
    <div style={{ maxWidth: '880px', margin: '30px auto', padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header met YourMine Logo */}
      <header style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <img 
            src="/icon-192.png" 
            alt="YourMine Logo" 
            style={{ 
              width: '56px', 
              height: '56px', 
              borderRadius: '12px', 
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)', 
              objectFit: 'cover' 
            }} 
          />
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ color: '#0f172a', fontSize: '24px', margin: 0, fontWeight: '800', letterSpacing: '-0.5px' }}>
              your<span style={{ color: '#dc2626' }}>mine</span> Dispute Shield
            </h1>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ista & Hoekstra Huurrecht Defensie
            </span>
          </div>
        </div>
        <p style={{ color: '#475569', fontSize: '14px', margin: 0, maxWidth: '640px', lineHeight: 1.4 }}>
          Wettelijke verweer-engine, meervoudige documentenscanner tot 100 MB, dossiergeschiedenis en verzoekschrift-generator conform Boek 7 BW.
        </p>
      </header>

      {/* SNEL-SCHAKELAAR BALK (Indien er dossiers in de geschiedenis staan) */}
      {dossiers.length > 0 && (
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 12px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FolderArchive size={14} color="#0284c7" /> Snel Schakelen:
          </span>

          {dossiers.map((d) => {
            const isSelected = currentDossierId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => handleSelectDossier(d)}
                style={{
                  background: isSelected ? '#0f172a' : '#f8fafc',
                  color: isSelected ? '#ffffff' : '#334155',
                  border: isSelected ? '1px solid #0f172a' : '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '4px 10px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{d.audit?.verhuurderBeheerder || 'Hoekstra'}</span>
                <span style={{ color: isSelected ? '#f87171' : '#dc2626' }}>
                  (€ {d.audit?.bijteBetalenSaldo || '0'})
                </span>
              </button>
            );
          })}

          <button
            onClick={handleStartNewScan}
            style={{
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              borderRadius: '20px',
              padding: '4px 10px',
              fontSize: '11.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <PlusCircle size={12} />
            + Nieuwe Scan
          </button>
        </div>
      )}

      {/* Navigatiemenu / 6 Tabs */}
      <nav style={{ display: 'flex', gap: '6px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('scan')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'scan' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'scan' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <Camera size={15} /> 1. Factuur Scanner
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'checklist' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'checklist' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <CheckSquare size={15} /> 2. Stappen Checklist
        </button>
        <button
          onClick={() => setActiveTab('pingpong')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'pingpong' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'pingpong' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <ArrowRightLeft size={15} /> 3. Anti-Pingpong
        </button>
        <button
          onClick={() => setActiveTab('radiator')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'radiator' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'radiator' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <Calculator size={15} /> 4. Radiator K-Audit
        </button>
        <button
          onClick={() => setActiveTab('voice')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'voice' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'voice' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <Mic size={15} /> 5. Inspreken Advocaat
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            borderRadius: '6px',
            border: 'none',
            background: activeTab === 'history' ? '#0f172a' : '#f1f5f9',
            color: activeTab === 'history' ? '#ffffff' : '#475569',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '12.5px',
            transition: 'all 0.2s ease'
          }}
        >
          <FolderArchive size={15} /> 6. Geschiedenis ({dossiers.length})
        </button>
      </nav>

      {/* Tab 1: Scanner met Meervoudige Upload & 100 MB Opslag */}
      {activeTab === 'scan' && (
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
              multiple 
              accept=".pdf,application/pdf,image/png,image/jpeg,image/webp" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
              id="file-upload-multiple" 
            />
            <label htmlFor="file-upload-multiple" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ background: '#e0f2fe', padding: '12px', borderRadius: '12px', color: '#0284c7' }}>
                  <Files size={36} />
                </div>
                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '12px', color: '#475569' }}>
                  <Camera size={36} />
                </div>
              </div>

              <span style={{ fontWeight: '700', color: '#0f172a', fontSize: '17px' }}>
                Upload één of meerdere documenten / pagina's tegelijk
              </span>
              <span style={{ fontSize: '13px', color: '#475569', marginTop: '6px' }}>
                Sleep alle pagina's / PDF's hierheen of klik om meerdere bestanden te selecteren
              </span>

              {/* Ondersteunde formaten & Ruime 100 MB Badges */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  📄 Multi-pagina PDF & scans
                </span>
                <span style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '600' }}>
                  📷 Meerdere foto's tegelijk
                </span>
                <span style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#047857', padding: '3px 10px', borderRadius: '6px', fontSize: '11.5px', fontWeight: '700' }}>
                  ⚡ Tot 100 MB opslag
                </span>
              </div>

              {selectedFiles.length > 0 && (
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
                  {selectedFiles.length} bestand(en) geselecteerd: {selectedFiles.map(f => f.name).join(', ')}
                </div>
              )}
            </label>
          </div>

          {loading && (
            <div style={{ textAlign: 'center', marginTop: '24px', padding: '16px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd' }}>
              <p style={{ margin: 0, color: '#0284c7', fontWeight: '600', fontSize: '14px' }}>
                ⏳ Meervoudig dossier analyseren met Gemini 2.5 Flash...
              </p>
              <p style={{ margin: '4px 0 0 0', color: '#0369a1', fontSize: '12.5px' }}>
                Alle documenten, pagina's, meterstanden en K-waarden worden gelijktijdig gecombineerd en getoetst aan artikelen 7:259 BW & 6:52 BW.
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>Dossier & Factuur Samenvatting</h3>
                  <button
                    onClick={handleStartNewScan}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: '#475569',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    + Scan Ander Dossier
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px', marginBottom: '18px' }}>
                  <div><strong>Geadresseerde beheerder:</strong> {data.audit?.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer'}</div>
                  <div><strong>Factuurdatum:</strong> {data.audit?.factuurDatum || 'Onbekend'}</div>
                  <div><strong>Afrekenperiode:</strong> {data.audit?.afrekenPeriode || 'Onbekend'}</div>
                  <div style={{ color: '#dc2626', fontWeight: 'bold' }}>
                    <strong>Betwist Saldo (Naheffing):</strong> € {data.audit?.bijteBetalenSaldo || '0.00'}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginBottom: '18px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Uw gegevens voor op het bezwaar en de verzoekschriften:</span>
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

                {/* PDF Knoppen Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

                  <button 
                    onClick={() => generateHuurcommissieDossier(data.audit, userDetails)}
                    style={{
                      width: '100%',
                      background: '#b91c1c',
                      color: '#ffffff',
                      padding: '12px',
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
                    <Gavel size={18} />
                    Download Officieel Huurcommissie Verzoekschrift (PDF ex Art. 7:260 BW)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Stappen Checklist & Tips */}
      {activeTab === 'checklist' && (
        <InteractiveChecklist auditData={data?.audit || null} />
      )}

      {/* Tab 3: Anti-Pingpong Detector & Weerwoord */}
      {activeTab === 'pingpong' && (
        <PingpongDetector beheerder={data?.audit?.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer'} />
      )}

      {/* Tab 4: Radiator K-Waarde Audit */}
      {activeTab === 'radiator' && (
        <RadiatorAudit />
      )}

      {/* Tab 5: Inspreken voor Advocaat */}
      {activeTab === 'voice' && (
        <VoiceLawyerBrief auditData={data?.audit} userDetails={userDetails} />
      )}

      {/* Tab 6: Dossier Geschiedenis & Snelschakelaar */}
      {activeTab === 'history' && (
        <DossierHistory 
          dossiers={dossiers}
          currentDossierId={currentDossierId}
          onSelectDossier={handleSelectDossier}
          onDeleteDossier={handleDeleteDossier}
          onClearAllDossiers={handleClearAllDossiers}
          userDetails={userDetails}
        />
      )}
    </div>
  );
}
