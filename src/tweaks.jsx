// Tweaks panel + defaults (EDITMODE markers)

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "blue",
  "density": "balanced",
  "hudIntensity": "normal",
  "showMobileAlongside": true,
  "monoFont": "JetBrains Mono"
}/*EDITMODE-END*/;

function TweaksPanel({ open, tweaks, setTweaks }) {
  if (!open) return null;
  const set = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, width: 300, zIndex: 90,
      background: 'var(--bg-2)', border: '1px solid var(--border-2)', borderRadius: 12,
      padding: 16, boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="sec-label">LIVE CONTROLS</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>Tweaks</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <TweakRow label="Accent">
          <Select value={tweaks.accent} onChange={v => set('accent', v)} options={[
            { value: 'blue', label: 'Blue' }, { value: 'cyan', label: 'Cyan' },
            { value: 'both', label: 'Both' }, { value: 'violet', label: 'Violet' },
          ]}/>
        </TweakRow>
        <TweakRow label="Density">
          <Select value={tweaks.density} onChange={v => set('density', v)} options={[
            { value: 'tight', label: 'Tight' }, { value: 'balanced', label: 'Balanced' }, { value: 'airy', label: 'Airy' },
          ]}/>
        </TweakRow>
        <TweakRow label="HUD intensity">
          <Select value={tweaks.hudIntensity} onChange={v => set('hudIntensity', v)} options={[
            { value: 'off', label: 'Off' }, { value: 'subtle', label: 'Subtle' },
            { value: 'normal', label: 'Normal' }, { value: 'heavy', label: 'Heavy' },
          ]}/>
        </TweakRow>
        <TweakRow label="Mobile frames">
          <Select value={tweaks.showMobileAlongside ? 'on' : 'off'} onChange={v => set('showMobileAlongside', v === 'on')} options={[
            { value: 'on', label: 'Visible' }, { value: 'off', label: 'Hidden' },
          ]}/>
        </TweakRow>
      </div>
    </div>
  );
}

function TweakRow({ label, children }) {
  return (
    <div>
      <div className="mono t-11" style={{ color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

// Apply tweaks via CSS vars
function applyTweaks(t) {
  const r = document.documentElement;
  const accents = {
    blue:   { a: '#3B82F6', b: '#06B6D4' },
    cyan:   { a: '#06B6D4', b: '#3B82F6' },
    both:   { a: '#3B82F6', b: '#06B6D4' },
    violet: { a: '#A78BFA', b: '#06B6D4' },
  };
  const pair = accents[t.accent] || accents.blue;
  r.style.setProperty('--blue', pair.a);
  r.style.setProperty('--cyan', pair.b);

  const densities = {
    tight:    { pad: '10px', padCard: '12px' },
    balanced: { pad: '14px', padCard: '18px' },
    airy:     { pad: '20px', padCard: '24px' },
  };
  const d = densities[t.density] || densities.balanced;
  // Note: we don't remap vars to avoid chaos; density is largely descriptive.
}

Object.assign(window, { TweaksPanel, applyTweaks, TWEAK_DEFAULTS });
