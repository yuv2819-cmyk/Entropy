import { X, Key, Faders, Globe, Brain } from '@phosphor-icons/react';
import { useState } from 'react';

const defaultSettings = {
    vibe: 'casual',
    chaos: 30,
    dialect: 'us'
};

const SettingsModal = ({ onClose, apiKey, settings, onSave }) => {
    const [key, setKey] = useState(() => apiKey || '');
    const [localSettings, setLocalSettings] = useState(() => ({
        ...defaultSettings,
        ...(settings || {})
    }));

    const handleSettingChange = (key, value) => {
        setLocalSettings(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="glass-panel" style={{ width: '500px', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
                <button
                    onClick={onClose}
                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                    <X size={24} />
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Faders size={24} color="var(--accent-primary)" weight="fill" />
                    Advanced Settings
                </h2>

                {/* API Key Section */}
                <div style={{ marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        <Key size={18} /> API Key (Required for Pro)
                    </label>
                    <input
                        type="password"
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        placeholder="sk-..."
                        style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-input)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'white' }}
                    />
                </div>

                {/* Vibe / Tone */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        <Brain size={18} /> Vibe / Tone
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {['Casual', 'Professional', 'Academic', 'Aggressive'].map(vibe => (
                            <button
                                key={vibe}
                                onClick={() => handleSettingChange('vibe', vibe.toLowerCase())}
                                style={{
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid ' + (localSettings.vibe === vibe.toLowerCase() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'),
                                    background: localSettings.vibe === vibe.toLowerCase() ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                    color: localSettings.vibe === vibe.toLowerCase() ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {vibe}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chaos Level */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        <span>Chaos Level (Imperfections)</span>
                        <span style={{ color: 'var(--accent-primary)' }}>{localSettings.chaos}%</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={localSettings.chaos}
                        onChange={(e) => handleSettingChange('chaos', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        <span>Clean</span>
                        <span>Natural</span>
                        <span>Messy</span>
                    </div>
                </div>

                {/* Dialect */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                        <Globe size={18} /> Dialect
                    </label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {[{ id: 'us', label: '🇺🇸 US English' }, { id: 'uk', label: '🇬🇧 UK English' }].map(dialect => (
                            <button
                                key={dialect.id}
                                onClick={() => handleSettingChange('dialect', dialect.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '0.5rem',
                                    border: '1px solid ' + (localSettings.dialect === dialect.id ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)'),
                                    background: localSettings.dialect === dialect.id ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                                    color: localSettings.dialect === dialect.id ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {dialect.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button onClick={onClose} className="btn btn-secondary">Cancel</button>
                    <button onClick={() => { onSave(key, localSettings); onClose(); }} className="btn">Save Settings</button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
