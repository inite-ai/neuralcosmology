export default function SiteBackground() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 w-full h-full pointer-events-none bg-gradient-to-br from-[#0a1026] via-[#1a1a2e] to-[#232946]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at top left, rgba(58,58,124,0.45) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(127,90,240,0.30) 0%, transparent 65%)",
        }}
      />
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-30 mix-blend-screen" />
    </div>
  );
}
