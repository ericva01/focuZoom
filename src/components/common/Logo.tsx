import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  theme?: "dark" | "light" | "auto";
}

/** The FucuFlow mark with its wordmark. The wordmark takes the surrounding text colour. */
export function Logo({ size = "md", showText = true, className = "" }: LogoProps) {
  const sizes = {
    sm: { img: 26, text: "text-lg" },
    md: { img: 34, text: "text-2xl" },
    lg: { img: 42, text: "text-[28px]" },
  }[size];

  return (
    <div className={`flex select-none items-center gap-2.5 ${className}`}>
      <Image
        src="/icon.png"
        alt=""
        width={sizes.img}
        height={sizes.img}
        priority
        className="flex-shrink-0 object-contain"
      />
      {showText && (
        <span className={`font-display font-medium tracking-[-0.01em] ${sizes.text}`}>FucuFlow</span>
      )}
    </div>
  );
}
