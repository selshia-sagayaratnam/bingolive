import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateGameCode } from "@/lib/bingo-utils";
import { ArrowLeft, Sparkles } from "lucide-react";

const CreateGame = () => {
  const [gameName, setGameName] = useState("");
  const [statements, setStatements] = useState<string[]>(Array(24).fill(""));
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStatementChange = (index: number, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = value;
    setStatements(newStatements);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const filledStatements = statements.filter((s) => s.trim() !== "");
    if (filledStatements.length < 24) {
      toast({
        title: "Not enough statements",
        description: `You need 24 statements. You have ${filledStatements.length}.`,
        variant: "destructive",
      });
      return;
    }

    if (!gameName.trim()) {
      toast({
        title: "Game name required",
        description: "Please enter a name for your game.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      const gameCode = generateGameCode();

      // Create the game
      const { data: gameData, error: gameError } = await supabase
        .from("games")
        .insert({
          name: gameName.trim(),
          statements: filledStatements,
          game_code: gameCode,
          status: "waiting",
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Create the host player
      const { data: playerData, error: playerError } = await supabase
        .from("players")
        .insert({
          game_id: gameData.id,
          name: "Host",
          is_host: true,
        })
        .select()
        .single();

      if (playerError) throw playerError;

      // Store player ID in session
      sessionStorage.setItem(`player_${gameCode}`, playerData.id);

      toast({
        title: "Game created!",
        description: `Your game code is ${gameCode}`,
      });

      navigate(`/lobby/${gameCode}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create game. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleBulkImport = () => {
    const text = prompt("Paste 24 statements, one per line:");
    if (text) {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "")
        .slice(0, 24);
      const newStatements = [...statements];
      lines.forEach((line, i) => {
        if (i < 24) newStatements[i] = line;
      });
      setStatements(newStatements);
    }
  };

  const filledCount = statements.filter((s) => s.trim() !== "").length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gradient">
              Create Your Bingo Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="gameName">Game Name</Label>
                <Input
                  id="gameName"
                  placeholder="e.g., Meeting Bingo, Wedding Bingo"
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  className="text-lg"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>
                    Statements ({filledCount}/24)
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleBulkImport}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Bulk Import
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {statements.map((statement, index) => (
                    <div key={index} className="relative">
                      <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold z-10">
                        {index + 1}
                      </span>
                      <Textarea
                        placeholder={`Statement ${index + 1}`}
                        value={statement}
                        onChange={(e) =>
                          handleStatementChange(index, e.target.value)
                        }
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-lg gradient-fun hover:opacity-90"
                disabled={isCreating || filledCount < 24}
              >
                {isCreating ? "Creating..." : "Create Game 🎲"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateGame;
