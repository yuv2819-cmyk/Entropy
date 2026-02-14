import { Copy, Check, Warning, ShieldCheck, ShieldWarning } from '@phosphor-icons/react';
import { useState } from 'react';

const OutputSection = ({ result }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (result?.text) {
            navigator.clipboard.writeText(result.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const getRiskColor = (risk) => {
        if (risk === 'High') return '#ef4444';
        if (risk === 'Medium') return '#f59e0b';
        return '#22c55e';
    };

    const getRiskIcon = (risk) => {
        if (risk === 'High' || risk === 'Medium') return <ShieldWarning size={24} weight="fill" color={getRiskColor(risk)} />;
        return <ShieldCheck size={24} weight="fill" color={getRiskColor(risk)} />;
    };

    if (!result) {
        return (
            <div className="glass-panel" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                <p>Waiting for input...</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    RESULT
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    {getRiskIcon(result.risk)}
                    <span style={{ color: getRiskColor(result.risk), fontWeight: '700', fontSize: '0.875rem' }}>
                        {result.risk ? result.risk.toUpperCase() + ' RISK' : 'UNKNOWN RISK'}
                    </span>
                </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.5rem', fontFamily: 'var(--font-sans)', whiteSpace: 'pre-wrap' }}>
                {result.text}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>CHANGES MADE:</h3>
                    <ul style={{ fontSize: '0.875rem', paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
                        {result.changes?.slice(0, 3).map((change, i) => (
                            <li key={i}>{change}</li>
                        ))}
                        {result.changes?.length > 3 && <li>...and more</li>}
                    </ul>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                    onClick={handleCopy}
                    className="btn"
                    style={{ background: copied ? 'var(--success)' : 'var(--accent-primary)' }}
                >
                    {copied ? <Check size={20} weight="bold" /> : <Copy size={20} weight="bold" />}
                    {copied ? 'COPIED!' : 'COPY TEXT'}
                </button>
            </div>
        </div>
    );
};

export default OutputSection;
