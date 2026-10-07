import React, { useState, useEffect } from 'react';
import { Mic, Square, Sparkles, Download, FileCheck, AlertCircle } from 'lucide-react';
import { generateLawyerPdf } from '../utils/generateLawyerPdf';

export default function VoiceLawyerBrief({ auditData, userDetails }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [lawyerBrief, setLawyerBrief] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'nl-NL';

      recognizer.onresult = (event) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText);
      };

      recognizer.onerror = (e) => {
        console.error('Speech recognition error:', e);
        setIsRecording(false);
      };

      setRecognition(recognizer);
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert('Spraakherkenning wordt niet direct ondersteund door deze specifieke browser. Gebruik Google Chrome of Microsoft Edge, of typ direct uw relaas in het tekstvak.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const handleGenerateBrief = async () => {
    if (!transcript.trim()) {
      alert('Spreek eerst uw verhaal in of typ uw toelichting in het tekstvak.');
      return;
    }

    setIsProcessing(true);
    try {
      const apiUrl = window.location.port === '5173' ? 'http://localhost:3001/api/lawyer-brief' : '/api/lawyer-brief';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, auditData, userDetails })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Fout bij serververwerking');
      }
      if (data.lawyerBrief) {
        setLawyerBrief(data.lawyerBrief);
      }
    } catch (err) {
      alert('Fout bij het omzetten naar advocatentaal: ' + (err?.message || err));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', padding: '24px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Mic size={24} color="#0284c7" />
        <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
          Spreek in voor uw Advocaat (Voice-to-Lawyer)
        </h3>
      </div>
      <p style={{ fontSize: '13px', color: '#64748b', marginTop: 0, marginBottom: '20px' }}>
        Vertel in uw eigen woorden wat er is gebeurd (hoe Hoekstra weigert te helpen, wat ista rekent, etc.). De AI zet uw gesproken relaas om in een gestructureerde, begrijpelijke procesinstructie voor uw raadsman.
      </p>

      {/* Opname knop */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
        <button
          onClick={toggleRecording}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isRecording ? '#dc2626' : '#0284c7',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s ease'
          }}
        >
          {isRecording ? <Square size={16} /> : <Mic size={16} />}
          {isRecording ? 'Stop Opname' : 'Start met Inspreken'}
        </button>

        {isRecording && (
          <span style={{ fontSize: '13px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', background: '#dc2626', borderRadius: '50%', display: 'inline-block' }}></span>
            Microfoon luistert... spreek rustig uw ervaring in.
          </span>
        )}
      </div>

      {/* Ingesproken / te bewerken tekst */}
      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Uw gesproken woorden verschijnen hier realtime. U kunt dit ook handmatig aanvullen of typen..."
        rows={5}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid #cbd5e1',
          fontSize: '13px',
          fontFamily: 'inherit',
          marginBottom: '14px'
        }}
      />

      <button
        onClick={handleGenerateBrief}
        disabled={isProcessing}
        style={{
          width: '100%',
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          padding: '12px',
          borderRadius: '6px',
          fontWeight: '600',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '14px',
          transition: 'background 0.2s ease'
        }}
      >
        <Sparkles size={16} color="#38bdf8" />
        {isProcessing ? 'AI compileert advocatendossier...' : 'Vertaal naar Juridische Advocatenbriefing'}
      </button>

      {/* Resultaat & Export */}
      {lawyerBrief && (
        <div style={{ marginTop: '24px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FileCheck size={18} color="#16a34a" /> Gegenereerd Advocatendossier (Klaar voor verzending)
            </span>
            <button
              onClick={() => generateLawyerPdf(lawyerBrief, userDetails)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#16a34a',
                color: '#fff',
                border: 'none',
                padding: '6px 14px',
                borderRadius: '4px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              <Download size={14} /> Download PDF voor Advocaat
            </button>
          </div>
          <pre style={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'inherit',
            fontSize: '13px',
            color: '#334155',
            lineHeight: 1.5,
            margin: 0
          }}>
            {lawyerBrief}
          </pre>
        </div>
      )}
    </div>
  );
}
