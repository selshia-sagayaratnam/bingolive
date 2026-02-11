import BingoCell from "./BingoCell";
import { cn } from "@/lib/utils";

interface BingoCardProps {
  statements: string[];
  markedSquares: boolean[];
  winningLine: number[] | null;
  onMarkSquare: (index: number) => void;
  disabled?: boolean;
}

const FREE_TILE_INDEX = 12;

const BingoCard = ({
  statements,
  markedSquares,
  winningLine,
  onMarkSquare,
  disabled = false,
}: BingoCardProps) => {
  // Insert "FREE" at center (index 12)
  const displayStatements = [
    ...statements.slice(0, FREE_TILE_INDEX),
    "FREE",
    ...statements.slice(FREE_TILE_INDEX, 24),
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* BINGO Header */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2">
        {["B", "I", "N", "G", "O"].map((letter, i) => (
          <div
            key={letter}
            className={cn(
              "text-center text-2xl sm:text-4xl font-bold py-2 rounded-lg text-white",
              i === 0 && "bg-bingo-pink",
              i === 1 && "bg-bingo-purple",
              i === 2 && "bg-bingo-blue",
              i === 3 && "bg-bingo-green",
              i === 4 && "bg-bingo-yellow"
            )}
            style={{ fontFamily: "'Fredoka', cursive" }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Bingo Grid */}
      <div className="grid grid-cols-5 gap-1 sm:gap-2 bg-muted p-2 rounded-xl">
        {displayStatements.map((statement, index) => {
          const isFreeSpace = index === FREE_TILE_INDEX;

          return (
            <BingoCell
              key={index}
              index={index}
              statement={statement}
              isFreeSpace={isFreeSpace}
              isMarked={isFreeSpace || markedSquares[index]}
              isWinningCell={winningLine?.includes(index) ?? false}
              onMark={() => {
                // 🚫 Do nothing if FREE tile or board disabled
                if (isFreeSpace || disabled) return;
                onMarkSquare(index);
              }}
              disabled={disabled || isFreeSpace}
            />
          );
        })}
      </div>
    </div>
  );
};

export default BingoCard;
