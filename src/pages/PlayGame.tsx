import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import BingoCard from "@/components/BingoCard";
import PlayerList from "@/components/PlayerList";
import Confetti from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkBingo } from "@/lib/bingo-utils";
import { Loader2, Trophy, RefreshCw, Home, StopCircle, Crown } from "lucide-react";

const PlayGame = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();

  const {
    game,
    players,
    currentPlayer,
    loading,
    error,
    markSquare,
    endGame,
    resetGame,
  } = useGame(gameCode || null);

  useEffect(() => {
    if (game?.status === "waiting") {
      navigate(`/lobby/${gameCode}`);
    }
  }, [game?.status, gameCode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !game || !currentPlayer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">
              {error || "Please join the game first"}
            </p>
            <Button onClick={() => navigate(`/lobby/${gameCode}`)}>
              Go to Lobby
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { winningLine } = checkBingo(currentPlayer.marked_squares);
  const winners = players.filter((p) => p.has_bingo);
  const isFinished = game.status === "finished";
  const currentPlayerHasBingo = currentPlayer.has_bingo;

  return (
    <div className="min-h-screen bg-background p-4">
      <Confetti isActive={currentPlayerHasBingo} />

      <div className="max-w-6xl mx-auto">
        {/* Game Over Banner */}
        {isFinished && (
          <Card className="mb-6 gradient-celebration text-white">
            <CardContent className="py-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-3xl font-bold mb-2">🎉 Game Over! 🎉</h2>
              <p className="text-white/80">
                {winners.length} player{winners.length !== 1 ? "s" : ""} got BINGO!
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Bingo Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-bold text-gradient">
                  {game.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BingoCard
                  statements={game.statements}
                  markedSquares={currentPlayer.marked_squares}
                  winningLine={winningLine}
                  onMarkSquare={markSquare}
                  disabled={isFinished}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Winners Dashboard */}
            {winners.length > 0 && (
              <Card className="border-2 border-bingo-yellow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-bingo-yellow" />
                    Winners ({winners.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {winners.map((w, i) => (
                      <div
                        key={w.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-bingo-yellow/10"
                      >
                        <span className="font-bold text-bingo-yellow">#{i + 1}</span>
                        <span className="font-semibold truncate">{w.name}</span>
                        {w.id === currentPlayer.id && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-auto">
                            You
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Player Leaderboard */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <PlayerList
                  players={players}
                  currentPlayerId={currentPlayer.id}
                  showProgress={true}
                />
              </CardContent>
            </Card>

            {/* Host Controls */}
            {currentPlayer.is_host && (
              <Card>
                <CardContent className="pt-6 space-y-2">
                  {!isFinished && (
                    <Button
                      onClick={endGame}
                      className="w-full"
                      variant="destructive"
                    >
                      <StopCircle className="w-4 h-4 mr-2" />
                      End Game
                    </Button>
                  )}
                  {isFinished && (
                    <>
                      <Button
                        onClick={resetGame}
                        className="w-full"
                        variant="outline"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Play Again
                      </Button>
                      <Button
                        onClick={() => navigate("/")}
                        className="w-full"
                        variant="ghost"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        New Game
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayGame;
