import { useId } from "react";

/** Diagonal red / white / blue stripe, the shop's signature divider. */
export function BarberPole({ className = "h-3" }: { className?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className="border-y-2 border-ink" aria-hidden="true">
      <svg className={`block w-full ${className}`} focusable="false">
        <defs>
          <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect x="0" width="10" height="40" className="fill-barber-red" />
            <rect x="10" width="10" height="40" fill="#FBF6EA" />
            <rect x="20" width="10" height="40" className="fill-barber-blue" />
            <rect x="30" width="10" height="40" fill="#FBF6EA" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}
