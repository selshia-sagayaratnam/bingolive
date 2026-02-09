-- Create games table
CREATE TABLE public.games (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  statements TEXT[] NOT NULL,
  game_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create players table
CREATE TABLE public.players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  marked_squares BOOLEAN[] NOT NULL DEFAULT ARRAY[false,false,false,false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false,false,false],
  has_bingo BOOLEAN NOT NULL DEFAULT false,
  is_host BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for winner
ALTER TABLE public.games ADD CONSTRAINT games_winner_fkey FOREIGN KEY (winner_id) REFERENCES public.players(id) ON DELETE SET NULL;

-- Enable Row Level Security
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Create policies for games (public access - no login required)
CREATE POLICY "Anyone can view games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Anyone can create games" ON public.games FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update games" ON public.games FOR UPDATE USING (true);

-- Create policies for players (public access - no login required)
CREATE POLICY "Anyone can view players" ON public.players FOR SELECT USING (true);
CREATE POLICY "Anyone can join games" ON public.players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update their progress" ON public.players FOR UPDATE USING (true);

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.games;
ALTER PUBLICATION supabase_realtime ADD TABLE public.players;

-- Create function to generate unique game code
CREATE OR REPLACE FUNCTION public.generate_game_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql SET search_path = public;