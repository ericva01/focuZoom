import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const dimensions = {
    sm: { box: "w-7 h-7", imgSize: 28, text: "text-sm", badge: "text-[9px] px-1.5 py-0.5" },
    md: { box: "w-8 h-8", imgSize: 32, text: "text-sm sm:text-base", badge: "text-[10px] px-2 py-0.5" },
    lg: { box: "w-10 h-10", imgSize: 40, text: "text-base sm:text-lg", badge: "text-xs px-2.5 py-0.5" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Brand Icon */}
      <div
        className={`${dimensions.box} rounded-xl overflow-hidden relative p-0.5 bg-gradient-to-b from-sky-400/40 via-white/10 to-transparent border border-white/20 shadow-[0_0_15px_rgba(56,189,248,0.25)] group-hover:shadow-[0_0_22px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-all duration-300 flex-shrink-0`}
      >
        <Image
          src="/logo.png"
          alt="FocuFlow Logo"
          width={dimensions.imgSize}
          height={dimensions.imgSize}
          className="w-full h-full object-cover rounded-[9px]"
          priority
        />
      </div>

      {/* Brand Name & Version Tag */}
      {showText && (
        <div className="flex items-center gap-2">
          <span className={`font-semibold tracking-tight text-white flex items-center gap-0.5 ${dimensions.text}`}>
            Focu<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">Flow</span>
          </span>
          <span className={`uppercase font-mono font-medium tracking-wider rounded-md bg-white/[0.06] text-sky-300 border border-white/10 shadow-glass-inner ${dimensions.badge}`}>
            v2.0
          </span>
        </div>
      )}
    </div>
  );
}
