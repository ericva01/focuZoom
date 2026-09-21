import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  theme?: "dark" | "light" | "auto";
}

export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const iconSizes = {
    sm: { img: 28, text: "text-base tracking-tight" },
    md: { img: 36, text: "text-lg tracking-tight" },
    lg: { img: 44, text: "text-xl tracking-tight" },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 group select-none ${className}`}>
      {/* FucuFlow Official Brand Logo Mark */}
      <div className="relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105 flex-shrink-0">
        <Image
          src="/icon.png"
          alt="FucuFlow Logo"
          width={iconSizes.img}
          height={iconSizes.img}
          priority
          className="object-contain drop-shadow-[0_2px_8px_rgba(255,107,44,0.3)]"
        />
      </div>

      {/* Brand Name in Orange */}
      {showText && (
        <span className={`font-extrabold font-sans text-[#FF6B2C] tracking-tight ${iconSizes.text}`}>
          FucuFlow
        </span>
      )}
    </div>
  );
}
