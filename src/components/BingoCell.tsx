import { useState } from "react";
import { cn } from "@/lib/utils";
import { getCellColor } from "@/lib/bingo-utils";
import { Star } from "lucide-react";

interface BingoCellProps {
  index: number;
  statement: string;
  isMarked: boolean;
  isFreeSpace: boolean;
  isWinningCell: boolean;
  onMark: () => void;
  disabled?: boolean;
}

const BingoCell = ({
  index,
  statement,
  isMarked,
  isFreeSpace,
  isWinningCell,
  onMark,
  disabled = false,
}: BingoCellProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled || isFreeSpace || isMarked) return;
    setIsAnimating(true);
    onMark();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isFreeSpace}
      className={cn(
        "relative aspect-square p-1.5 sm:p-2.5 rounded-lg border-2 transition-all duration-200",
        "flex items-center justify-center text-center overflow-hidden",
        "text-[7px] sm:text-[9px] md:text-[11px] font-medium leading-snug break-words hyphens-auto",
        isMarked || isFreeSpace
          ? cn(getCellColor(index), "text-white border-white/30 shadow-lg")
          : "bg-card hover:bg-muted border-border hover:border-primary/50",
        isWinningCell && "animate-wiggle ring-4 ring-secondary",
        isAnimating && "animate-pop",
        !disabled && !isFreeSpace && !isMarked && "cursor-pointer hover:scale-105",
        (disabled || isMarked) && !isFreeSpace && "cursor-default"
      )}
    >
      {isFreeSpace ? (
        <div className="flex flex-col items-center gap-1">
          <Star className="w-4 h-4 sm:w-6 sm:h-6 fill-current" />
          <span className="text-[8px] sm:text-xs font-bold">FREE</span>
        </div>
      ) : (
        <span className="line-clamp-4">{statement}</span>
      )}
      
      {isMarked && !isFreeSpace && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white/30 flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl">✓</span>
          </div>
        </div>
      )}
    </button>
  );
};

export default BingoCell;
