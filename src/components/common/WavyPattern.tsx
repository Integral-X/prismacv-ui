import * as React from "react";
import { cn } from "@/lib/utils";

interface WavyPatternProps {
  className?: string;
  height?: number;
}

export const WavyPattern = ({ className, height = 200 }: WavyPatternProps) => {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <svg
        className="block w-full"
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ height: `${height}px` }}
        aria-hidden="true"
      >
        <path
          d="M0 94C150 62 298 48 444 75C583 101 653 132 793 124C945 115 1053 65 1198 53C1281 46 1360 48 1440 63V220H0V94Z"
          fill="var(--color-primary)"
          fillOpacity="0.16"
        />
        <path
          d="M0 158C157 103 309 91 459 121C593 147 660 183 799 177C952 170 1066 111 1221 97C1298 90 1370 96 1440 105V220H0V158Z"
          fill="var(--color-primary)"
          fillOpacity="0.32"
        />
      </svg>
    </div>
  );
};
