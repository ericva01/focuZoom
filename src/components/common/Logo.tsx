import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconSizes = {
    sm: { img: 26, text: "text-sm tracking-wider" },
    md: { img: 32, text: "text-base tracking-wider" },
    lg: { img: 40, text: "text-lg tracking-wider" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* Generated High-Res Glideo App Logo */}
      <div className="relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(251,113,133,0.35)] border border-rose-400/30 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(251,113,133,0.5)] transition-all duration-300 flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Glideo"
          width={iconSizes.img}
          height={iconSizes.img}
          className="object-cover"
          priority
        />
      </div>

      {/* Brand Name */}
      {showText && (
        <span className={`font-bold text-white uppercase font-sans ${iconSizes.text}`}>
          GLIDEO
        </span>
      )}
    </div>
  );
}
