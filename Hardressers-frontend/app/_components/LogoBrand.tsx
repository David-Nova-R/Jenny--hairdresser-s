export default function LogoBrand() {
  return (
    <div className="flex select-none flex-col items-center leading-none">

      {/* M & D */}
      <div className="flex items-center">
        <span
          className="font-serif text-[26px] font-bold leading-none text-white"
        >
          M
        </span>
        <span
          className="mx-0.5 font-serif text-[17px] italic leading-none text-[#D4AF37]"
        >
          &amp;
        </span>
        <span
          className="font-serif text-[30px] font-bold leading-none text-white"
        >
          D
        </span>
      </div>

      {/* Jenny Rengifo */}
      <span
        style={{ fontFamily: 'var(--font-dancing)' }}
        className="mt-0.5 text-[15px] leading-tight text-white/90"
      >
        Jenny Rengifo
      </span>

      {/* STYLISTE */}
      <span className="mt-0.5 text-[7px] font-medium uppercase tracking-[0.35em] text-white/50">
        Styliste
      </span>
    </div>
  );
}
