import { useState } from 'react'
import { Gear } from '@phosphor-icons/react';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import SettingsModal from './components/SettingsModal';
import { HumanizerEngine } from './lib/humanizer';

const humanizer = new HumanizerEngine();

function App() {
  const [result, setResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('humanizer_api_key') || '');
  const [settings, setSettings] = useState(JSON.parse(localStorage.getItem('humanizer_settings')) || {
    vibe: 'casual',
    chaos: 30,
    dialect: 'us'
  });

  const handleProcess = async (text, mode) => {
    setIsProcessing(true);
    // Add artificial delay for "scanning" effect in Lite mode
    if (mode === 'lite') await new Promise(r => setTimeout(r, 800));

    try {
      const res = await humanizer.process(text, mode, apiKey, settings);
      setResult(res);
    } catch (error) {
      console.error(error);
      setResult({ text: 'Error processing text.', risk: 'Unknown', changes: [error.message] });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSettings = (key, newSettings) => {
    setApiKey(key);
    setSettings(newSettings);
    localStorage.setItem('humanizer_api_key', key);
    localStorage.setItem('humanizer_settings', JSON.stringify(newSettings));
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.05em' }}>
            ENTROPY
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem', fontSize: '0.875rem' }}>
            Restore the human chaos.
          </p>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }}
        >
          <Gear size={24} weight="fill" />
        </button>
      </header>

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', minHeight: '600px' }}>
        <InputSection onProcess={handleProcess} isProcessing={isProcessing} />
        <OutputSection result={result} />
      </main>

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          apiKey={apiKey}
          settings={settings}
          onSave={handleSaveSettings}
        />
      )}

      <footer style={{ marginTop: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
        <p>Anti-AI Detection System v1.0.0 • Local Processing Enabled</p>
      </footer>
    </div>
  )
}

export default App
