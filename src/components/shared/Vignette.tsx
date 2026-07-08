export function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-10"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.8) 100%)',
      }}
    />
  );
}
