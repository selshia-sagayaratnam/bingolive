import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  size: number;
}

interface ConfettiProps {
  isActive: boolean;
}

const Confetti = ({ isActive }: ConfettiProps) => {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      const colors = [
        "hsl(330, 90%, 65%)", // pink
        "hsl(280, 80%, 55%)", // purple
        "hsl(200, 90%, 55%)", // blue
        "hsl(150, 80%, 45%)", // green
        "hsl(45, 100%, 60%)", // yellow
        "hsl(25, 95%, 55%)",  // orange
      ];

      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 100; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 2,
          size: Math.random() * 10 + 5,
        });
      }
      setPieces(newPieces);

      // Clear confetti after animation
      const timer = setTimeout(() => setPieces([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!isActive || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti"
          style={{
            left: `${piece.x}%`,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            borderRadius: Math.random() > 0.5 ? "50%" : "0",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
