import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { checkBingo } from "@/lib/bingo-utils";
import { useToast } from "@/hooks/use-toast";

interface Game {
  id: string;
  name: string;
  statements: string[];
  game_code: string;
  status: "waiting" | "playing" | "finished";
  winner_id: string | null;
}

interface Player {
  id: string;
  game_id: string;
  name: string;
  marked_squares: boolean[];
  has_bingo: boolean;
  is_host: boolean;
}

export const useGame = (gameCode: string | null) => {
  const [game, setGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch game by code
  const fetchGame = useCallback(async () => {
    if (!gameCode) return;

    try {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .eq("game_code", gameCode)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError("Game not found");
        return;
      }

      setGame(data as Game);
    } catch (err) {
      setError("Failed to load game");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [gameCode]);

  // Fetch players
  const fetchPlayers = useCallback(async () => {
    if (!game?.id) return;

    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", game.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      return;
    }

    setPlayers(data as Player[]);
  }, [game?.id]);

  // Load current player from session storage
  useEffect(() => {
    const playerId = sessionStorage.getItem(`player_${gameCode}`);
    if (playerId && players.length > 0) {
      const player = players.find((p) => p.id === playerId);
      if (player) {
        setCurrentPlayer(player);
      }
    }
  }, [players, gameCode]);

  // Initial fetch
  useEffect(() => {
    fetchGame();
  }, [fetchGame]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  // Real-time subscriptions
  useEffect(() => {
    if (!game?.id) return;

    const channel = supabase
      .channel(`game_${game.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${game.id}`,
        },
        (payload) => {
          if (payload.new) {
            setGame(payload.new as Game);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${game.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPlayers((prev) => [...prev, payload.new as Player]);
            toast({
              title: "New player joined!",
              description: `${(payload.new as Player).name} has joined the game`,
            });
          } else if (payload.eventType === "UPDATE") {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === (payload.new as Player).id ? (payload.new as Player) : p
              )
            );
            // Check if this player just got BINGO
            if ((payload.new as Player).has_bingo && !(payload.old as Player)?.has_bingo) {
              toast({
                title: "🎉 BINGO!",
                description: `${(payload.new as Player).name} got BINGO!`,
              });
            }
          } else if (payload.eventType === "DELETE") {
            setPlayers((prev) => prev.filter((p) => p.id !== (payload.old as Player).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [game?.id, toast]);

  // Join game
  const joinGame = async (playerName: string): Promise<Player | null> => {
    if (!game?.id) return null;

    try {
      const { data, error } = await supabase
        .from("players")
        .insert({
          game_id: game.id,
          name: playerName,
          is_host: false,
        })
        .select()
        .single();

      if (error) throw error;

      const player = data as Player;
      sessionStorage.setItem(`player_${gameCode}`, player.id);
      setCurrentPlayer(player);
      return player;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to join game",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mark square
  const markSquare = async (index: number) => {
    if (!currentPlayer || currentPlayer.marked_squares[index]) return;

    const newMarkedSquares = [...currentPlayer.marked_squares];
    newMarkedSquares[index] = true;

    const { hasBingo } = checkBingo(newMarkedSquares);

    try {
      const { error } = await supabase
        .from("players")
        .update({
          marked_squares: newMarkedSquares,
          has_bingo: hasBingo,
        })
        .eq("id", currentPlayer.id);

      if (error) throw error;

      // No longer auto-finish the game on bingo - host controls when to end
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to mark square",
        variant: "destructive",
      });
    }
  };

  // Start game (host only)
  const startGame = async () => {
    if (!game?.id || !currentPlayer?.is_host) return;

    try {
      const { error } = await supabase
        .from("games")
        .update({ status: "playing" })
        .eq("id", game.id);

      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to start game",
        variant: "destructive",
      });
    }
  };

  // End game (host only)
  const endGame = async () => {
    if (!game?.id || !currentPlayer?.is_host) return;

    try {
      await supabase
        .from("games")
        .update({ status: "finished" })
        .eq("id", game.id);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to end game",
        variant: "destructive",
      });
    }
  };

  // Reset game (host only)
  const resetGame = async () => {
    if (!game?.id || !currentPlayer?.is_host) return;

    try {
      await supabase
        .from("players")
        .update({
          marked_squares: Array(25).fill(false).map((_, i) => i === 12),
          has_bingo: false,
        })
        .eq("game_id", game.id);

      await supabase
        .from("games")
        .update({
          status: "waiting",
          winner_id: null,
        })
        .eq("id", game.id);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to reset game",
        variant: "destructive",
      });
    }
  };

  return {
    game,
    players,
    currentPlayer,
    loading,
    error,
    joinGame,
    markSquare,
    startGame,
    endGame,
    resetGame,
  };
};
