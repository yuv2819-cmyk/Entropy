import { useState } from 'react';
import { PaperPlaneRight, Eraser, Lightning, MagicWand } from '@phosphor-icons/react';

const InputSection = ({ onProcess, isProcessing }) => {
    const [text, setText] = useState('');
    const [mode, setMode] = useState('lite');

    const handleProcess = () => {
        if (text.trim()) {
            onProcess(text, mode);
        }
    };

    const handleClear = () => {
        setText('');
    };

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Lightning size={24} weight="fill" />
                    INPUT
                </h2>

                <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={() => setMode('lite')}
                        style={{
                            background: mode === 'lite' ? 'var(--bg-input)' : 'transparent',
                            color: mode === 'lite' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        LITE
                    </button>
                    <button
                        onClick={() => setMode('pro')}
                        style={{
                            background: mode === 'pro' ? 'var(--accent-primary)' : 'transparent',
                            color: mode === 'pro' ? 'white' : 'var(--text-secondary)',
                            border: 'none',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '0.25rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        PRO
                    </button>
                </div>
            </div>

            <textarea
                className="input-area"
                placeholder="Paste your AI-generated text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1, resize: 'none', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                    onClick={handleClear}
                    className="btn btn-secondary"
                    disabled={!text}
                    style={{ opacity: !text ? 0.5 : 1 }}
                >
                    <Eraser size={20} />
                    CLEAR
                </button>

                <button
                    onClick={handleProcess}
                    className="btn"
                    disabled={!text || isProcessing}
                    style={{
                        opacity: !text || isProcessing ? 0.7 : 1,
                        minWidth: '140px',
                        justifyContent: 'center'
                    }}
                >
                    {isProcessing ? 'HUMANIZING...' : (
                        <>
                            <MagicWand size={20} weight="fill" />
                            HUMANIZE
                        </>
                    )}
                </button>
            </div>

            {mode === 'pro' && (
                <div style={{ position: 'absolute', bottom: '5rem', left: '1.5rem', right: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', color: '#fca5a5', display: 'none' }}>
                    * Pro mode requires API Key in settings.
                </div>
            )}
        </div>
    );
};

export default InputSection;
