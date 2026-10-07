import React from 'react';
import { 
  FolderArchive, 
  Clock, 
  Trash2, 
  FileText, 
  Download, 
  Gavel, 
  ExternalLink, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCcw,
  Layers
} from 'lucide-react';
import { generateLegalLetterPdf } from '../utils/generatePdf';
import { generateHuurcommissieDossier } from '../utils/generateHuurcommissieDossier';

export default function DossierHistory({ 
  dossiers = [], 
  currentDossierId = null,
  onSelectDossier, 
  onDeleteDossier,
  onClearAllDossiers,
  userDetails = {}
}) {
  if (!dossiers || dossiers.length === 0) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: '48px 24px',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <div style={{
          background: '#f1f5f9',
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          color: '#64748b'
        }}>
          <FolderArchive size={32} />
        </div>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>
          Nog geen dossiers in de geschiedenis
        </h3>
        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', maxWidth: '440px', marginInline: 'auto' }}>
          Zodra je een document scant of uploadt via het tabblad <em>Factuur Scanner</em>, wordt het volledige dossier hier automatisch opgeslagen zodat je er altijd direct naar terug kunt schakelen.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FolderArchive size={22} color="#0284c7" />
          <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '700' }}>
            Dossiergeschiedenis ({dossiers.length})
          </h2>
        </div>

        <button
          onClick={onClearAllDossiers}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '12px',
            color: '#dc2626',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#fef2f2'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <Trash2 size={13} />
          Wis Alle Geschiedenis
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {dossiers.map((dossier) => {
          const isCurrent = currentDossierId === dossier.id;
          const audit = dossier.audit || {};
          const violations = dossier.legalViolations || [];

          return (
            <div
              key={dossier.id}
              style={{
                background: '#ffffff',
                border: isCurrent ? '2px solid #0284c7' : '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: isCurrent ? '0 4px 12px rgba(2, 132, 199, 0.1)' : '0 2px 4px rgba(0,0,0,0.02)',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Header van dossier */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a', fontWeight: '700' }}>
                      {audit.verhuurderBeheerder || 'Hoekstra Vastgoedbeheer'}
                    </h3>
                    {isCurrent && (
                      <span style={{
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '12px'
                      }}>
                        Actief Dossier
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '12px', marginTop: '3px' }}>
                    <Clock size={13} />
                    <span>Gescand op: {dossier.formattedDate || new Date(dossier.timestamp).toLocaleDateString('nl-NL')}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>Betwist Saldo (Naheffing):</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626' }}>
                    € {audit.bijteBetalenSaldo || '0.00'}
                  </div>
                </div>
              </div>

              {/* Gegevens grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '10px',
                background: '#f8fafc',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                marginBottom: '14px'
              }}>
                <div>
                  <strong style={{ color: '#475569' }}>Afrekenperiode:</strong><br />
                  <span style={{ color: '#0f172a' }}>{audit.afrekenPeriode || 'Onbekend'}</span>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>Factuurdatum:</strong><br />
                  <span style={{ color: '#0f172a' }}>{audit.factuurDatum || 'Onbekend'}</span>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>Wettelijke Gebreken:</strong><br />
                  <span style={{ color: '#991b1b', fontWeight: '600' }}>{violations.length} overtredingen</span>
                </div>
                <div>
                  <strong style={{ color: '#475569' }}>Bestanden:</strong><br />
                  <span style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Layers size={13} color="#0284c7" />
                    {dossier.filesCount || 1} document(en) ({dossier.totalSizeMb || '1.2'} MB)
                  </span>
                </div>
              </div>

              {/* Bestandsnamen badges */}
              {dossier.fileNames && dossier.fileNames.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {dossier.fileNames.map((fn, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        color: '#475569',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={11} color="#64748b" />
                      {fn}
                    </span>
                  ))}
                </div>
              )}

              {/* Knoppenrij */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={() => onSelectDossier(dossier)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: isCurrent ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <RotateCcw size={14} />
                  {isCurrent ? 'Huidig Geopend Dossier' : 'Schakel Naar Dit Dossier'}
                </button>

                <button
                  onClick={() => generateLegalLetterPdf(audit, userDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#ffffff',
                    color: '#0f172a',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Download size={13} />
                  Sommatiebrief (PDF)
                </button>

                <button
                  onClick={() => generateHuurcommissieDossier(audit, userDetails)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  <Gavel size={13} />
                  Huurcommissie Dossier (PDF)
                </button>

                <button
                  onClick={() => onDeleteDossier(dossier.id)}
                  title="Verwijder dit dossier uit de geschiedenis"
                  style={{
                    marginLeft: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'transparent',
                    color: '#94a3b8',
                    border: 'none',
                    padding: '6px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#dc2626'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
