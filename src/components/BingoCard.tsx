import BingoCell from "./BingoCell";
import { cn } from "@/lib/utils";

interface BingoCardProps {
  statements: string[]; // might be broken
  markedSquares: boolean[];
  winningLine: number[] | null;
  onMarkSquare: (index: number) => void;
  disabled?: boolean;
}

// Helper: flatten array or weird multi-line string into single line
const normalizeStatement = (statement: string | string[]): string => {
  if (Array.isArray(statement)) {
    statement = statement.join(" "); // join letters
  }
  return statement
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const BingoCard = ({
  statements,
  markedSquares,
  winningLine,
  onMarkSquare,
  disabled = false,
}: BingoCardProps) => {
  // Ensure statements is always an array
  const statementsArray = Array.isArray(statements)
    ? statements
    : typeof statements === "string"
      ? (statements as string).split(",").map((s: string) => s.trim())
      : [];

  // Insert "FREE" at center (index 12) after cleaning
  const cleanStatements = statementsArray.map(normalizeStatement);
  const displayStatements = [
    ...cleanStatements.slice(0, 12),
    "FREE",
    ...cleanStatements.slice(12, 24),
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
        {displayStatements.map((statement, index) => (
          <BingoCell
            key={index}
            index={index}
            statement={statement}
            isMarked={index === 12 || markedSquares[index]}
            isFreeSpace={index === 12}
            isWinningCell={winningLine?.includes(index) ?? false}
            onMark={() => onMarkSquare(index)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default BingoCard;
