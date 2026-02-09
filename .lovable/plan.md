

## Statement Bingo Game - Implementation Plan

### Overview
A fun, colorful real-time multiplayer statement bingo game where you create custom bingo cards with statements, share a game link, and players compete to get BINGO first.

---

### 🎮 Core Features

**1. Game Creation & Card Setup**
- Form to enter 25 statements (for the 5×5 grid, with a free space in the center)
- Ability to give your game a name (e.g., "Meeting Bingo", "Wedding Bingo")
- Save and generate a shareable game link

**2. Player Join Flow**
- Players click the shared link
- Enter their display name to join
- See a waiting lobby until the host starts the game

**3. The Bingo Card**
- 5×5 grid with your statements displayed
- Fun, colorful design with satisfying click animations when marking squares
- Center free space (auto-marked)
- Visual feedback when a square is marked

**4. Real-Time Dashboard**
- Live leaderboard showing all players and their progress
- Visual indicator when someone is close to winning (has 4 in a row)
- Celebration animation when someone gets BINGO
- Shows the winning player prominently

**5. Win Detection**
- Automatically checks for horizontal, vertical, and diagonal lines
- First player to complete any line wins
- Announces winner to all players in real-time

---

### 🎨 Design Style
- Bright, vibrant colors with a playful feel
- Smooth animations for marking squares
- Confetti or celebration effects for the winner
- Mobile-friendly so players can join from their phones

---

### 🔧 Technical Approach
- **Backend**: Supabase for real-time game state sync between players
- **Real-time**: Players see each other's progress live using Supabase Realtime
- **No login required**: Players just enter a name to join (simple and fast)

---

### 📱 Pages
1. **Home** - Create a new game or join with a code
2. **Create Game** - Enter your 25 statements and game name
3. **Lobby** - Waiting room showing joined players
4. **Play** - The bingo card + live leaderboard
5. **Results** - Winner announcement with option to play again

