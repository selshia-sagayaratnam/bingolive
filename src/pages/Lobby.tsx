import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGame } from "@/hooks/useGame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PlayerList from "@/components/PlayerList";
import { Copy, Play, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Lobby = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const { game, players, currentPlayer, loading, error, joinGame, startGame } =
    useGame(gameCode || null);

  // Redirect to play page when game starts
  useEffect(() => {
    if (game?.status === "playing") {
      navigate(`/play/${gameCode}`);
    }
  }, [game?.status, gameCode, navigate]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsJoining(true);
    await joinGame(playerName.trim());
    setIsJoining(false);
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share this link with your players",
    });
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      toast({
        title: "Need more players",
        description: "Wait for at least 2 players to join",
        variant: "destructive",
      });
      return;
    }
    await startGame();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-destructive mb-4">{error || "Game not found"}</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Game Header */}
        <Card className="gradient-fun text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">{game.name}</CardTitle>
            <p className="text-white/80">Waiting for players...</p>
          </CardHeader>
          <CardContent className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-lg px-4 py-2">
              <span className="text-sm opacity-80">Game Code:</span>
              <span className="text-2xl font-mono font-bold tracking-wider">
                {game.game_code}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLink}
                className="text-white hover:bg-white/20"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Join Form or Player View */}
        {!currentPlayer ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Join the Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="flex gap-2">
                <Input
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={isJoining || !playerName.trim()}>
                  {isJoining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Join"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Player List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Players ({players.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PlayerList
                  players={players}
                  currentPlayerId={currentPlayer.id}
                  showProgress={false}
                />
              </CardContent>
            </Card>

            {/* Start Game Button (Host Only) */}
            {currentPlayer.is_host && (
              <Button
                onClick={handleStartGame}
                size="lg"
                className="w-full text-lg gradient-fun hover:opacity-90"
                disabled={players.length < 2}
              >
                <Play className="w-5 h-5 mr-2" />
                Start Game ({players.length} players)
              </Button>
            )}

            {!currentPlayer.is_host && (
              <Card className="bg-muted">
                <CardContent className="py-6 text-center text-muted-foreground">
                  Waiting for the host to start the game...
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Lobby;
