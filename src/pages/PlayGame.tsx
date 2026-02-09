import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import BingoCard from "@/components/BingoCard";
import PlayerList from "@/components/PlayerList";
import Confetti from "@/components/Confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { checkBingo } from "@/lib/bingo-utils";
import { Loader2, Trophy, RefreshCw, Home } from "lucide-react";

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
    resetGame,
  } = useGame(gameCode || null);

  // Redirect if not in playing or finished state
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
  const winner = players.find((p) => p.id === game.winner_id);
  const isFinished = game.status === "finished";
  const isWinner = currentPlayer.id === game.winner_id;

  return (
    <div className="min-h-screen bg-background p-4">
      <Confetti isActive={isFinished && isWinner} />

      <div className="max-w-6xl mx-auto">
        {/* Winner Banner */}
        {isFinished && winner && (
          <Card className="mb-6 gradient-celebration text-white animate-bounce">
            <CardContent className="py-6 text-center">
              <Trophy className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-3xl font-bold mb-2">
                🎉 {winner.name} wins! 🎉
              </h2>
              <p className="text-white/80">
                {isWinner
                  ? "Congratulations! You got BINGO!"
                  : "Better luck next time!"}
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

            {/* Game Controls */}
            {currentPlayer.is_host && isFinished && (
              <Card>
                <CardContent className="pt-6 space-y-2">
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
