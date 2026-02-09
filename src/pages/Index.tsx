import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Sparkles, Users, Play } from "lucide-react";

const Index = () => {
  const [gameCode, setGameCode] = useState("");
  const navigate = useNavigate();

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim()) {
      navigate(`/lobby/${gameCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Hero */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl sm:text-6xl font-bold text-gradient" style={{ fontFamily: "'Fredoka', cursive" }}>
            Statement Bingo
          </h1>
          <p className="text-lg text-muted-foreground">
            Create custom bingo cards with statements and compete with friends in real-time!
          </p>
        </div>

        {/* Create Game */}
        <Card className="border-2 hover:border-primary transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 gradient-fun rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Create a Game</CardTitle>
            <CardDescription>
              Enter your own statements and host a game
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/create")}
              className="w-full text-lg gradient-fun hover:opacity-90"
              size="lg"
            >
              Create New Game
            </Button>
          </CardContent>
        </Card>

        {/* Join Game */}
        <Card className="border-2 hover:border-accent transition-colors">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-2 bg-accent rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-accent-foreground" />
            </div>
            <CardTitle>Join a Game</CardTitle>
            <CardDescription>
              Enter the game code to join your friends
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinGame} className="space-y-3">
              <Input
                placeholder="Enter game code"
                value={gameCode}
                onChange={(e) => setGameCode(e.target.value.toUpperCase())}
                className="text-center text-2xl font-mono tracking-widest uppercase"
                maxLength={6}
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full text-lg border-2"
                size="lg"
                disabled={!gameCode.trim()}
              >
                <Play className="w-5 h-5 mr-2" />
                Join Game
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Fun Footer */}
        <p className="text-center text-sm text-muted-foreground">
          🎲 No login required • Share the link • Have fun! 🎉
        </p>
      </div>
    </div>
  );
};

export default Index;
