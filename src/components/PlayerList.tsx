import { cn } from "@/lib/utils";
import { getClosestToWin } from "@/lib/bingo-utils";
import { Crown, User, Star, Flame } from "lucide-react";

interface Player {
  id: string;
  name: string;
  marked_squares: boolean[];
  has_bingo: boolean;
  is_host: boolean;
}

interface PlayerListProps {
  players: Player[];
  currentPlayerId?: string;
  showProgress?: boolean;
}

const PlayerList = ({ players, currentPlayerId, showProgress = true }: PlayerListProps) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.has_bingo !== b.has_bingo) return a.has_bingo ? -1 : 1;
    if (showProgress) {
      return getClosestToWin(b.marked_squares) - getClosestToWin(a.marked_squares);
    }
    return 0;
  });

  return (
    <div className="space-y-2">
      {sortedPlayers.map((player) => {
        const progress = getClosestToWin(player.marked_squares);
        const isCloseToWin = progress >= 4;
        const isCurrentPlayer = player.id === currentPlayerId;

        return (
          <div
            key={player.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-all",
              player.has_bingo
                ? "bg-secondary text-secondary-foreground animate-bounce"
                : isCloseToWin
                ? "bg-bingo-orange/20 border-2 border-bingo-orange"
                : "bg-card border border-border",
              isCurrentPlayer && "ring-2 ring-primary"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                player.has_bingo
                  ? "bg-secondary"
                  : isCloseToWin
                  ? "bg-bingo-orange"
                  : "bg-primary"
              )}
            >
              {player.has_bingo ? (
                <Crown className="w-5 h-5" />
              ) : player.is_host ? (
                <Star className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold truncate">{player.name}</span>
                {isCurrentPlayer && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
                {player.is_host && (
                  <span className="text-xs bg-bingo-purple/20 text-bingo-purple px-2 py-0.5 rounded-full">
                    Host
                  </span>
                )}
              </div>
              
              {showProgress && (
                <div className="flex items-center gap-2 mt-1">
                  {player.has_bingo ? (
                    <span className="text-sm font-bold text-bingo-yellow">🎉 BINGO!</span>
                  ) : (
                    <>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all duration-300",
                            isCloseToWin ? "bg-bingo-orange" : "bg-primary"
                          )}
                          style={{ width: `${(progress / 5) * 100}%` }}
                        />
                      </div>
                      {isCloseToWin && (
                        <Flame className="w-4 h-4 text-bingo-orange animate-wiggle" />
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerList;
