export default function Hero() {
  return (
    <section className="min-h-screen px-24 flex flex-col justify-end pb-24 relative">
      <h1 className="font-light leading-[0.9] tracking-[-0.03em] text-[clamp(100px,17vw,220px)]">
        Software
        <br />
        <span className="inline-flex items-center gap-5">
          Engineer
          <span className="text-[11px] font-normal tracking-normal leading-[1.65] text-muted max-w-[148px] flex-shrink-0">
            specialized in Web Dev,<br />Game Development,<br />C# / OOP &amp; 3D<br />(Unity, Blender).
          </span>
        </span>
      </h1>
    </section>
  );
}
