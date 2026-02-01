# Pong 🏓

A classic HTML5 Pong game with a CPU opponent, featuring retro styling and modern gameplay enhancements.

![Pong Game](https://img.shields.io/badge/HTML5-Game-green) ![Canvas](https://img.shields.io/badge/Canvas-Retro-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

![Screenshot](screenshot.png)

## Features

- **Classic Gameplay**: Traditional pong mechanics with a retro aesthetic
- **CPU Opponent**: Medium difficulty AI that tracks the ball with realistic reaction times
- **Ball Speed Increase**: Ball speeds up after each paddle hit for increasing difficulty
- **Angle Variation**: Ball bounce angle changes based on where it hits the paddle
- **Sound Effects**: Retro-style sounds using Web Audio API
- **Mobile Support**: Touch controls for playing on mobile devices
- **Responsive Design**: Adapts to different screen sizes automatically

## How to Play

### Controls
- **Keyboard**: Arrow Up/Down or W/S keys to move your paddle
- **Mouse**: Move mouse up and down to control paddle
- **Touch**: Touch and drag on mobile devices

### Rules
- You control the left paddle
- CPU controls the right paddle
- First player to score 11 points wins
- Ball speeds up with each paddle hit
- Hit the ball with different parts of your paddle to change the angle

## Live Demo

Play the game at: **[https://pong-labs.vercel.app](https://pong-labs.vercel.app)**

## Installation & Running

### Option 1: Using Python (Simplest)
```bash
# Clone the repository
git clone https://github.com/nearbycoder/pong.git
cd pong

# Start a local server
python3 -m http.server 3000

# Open in browser
# Navigate to http://localhost:3000
```

### Option 2: Using Node.js
```bash
# Install http-server globally
npm install -g http-server

# Clone and navigate
git clone https://github.com/nearbycoder/pong.git
cd pong

# Start server
http-server -p 3000
```

### Option 3: Direct File Access
Simply open `index.html` directly in your web browser. However, some browsers may restrict local file access, so using a local server is recommended.

## Game Architecture

### Files
- `index.html` - Main HTML structure with canvas element
- `styles.css` - Retro styling with mobile responsiveness
- `game.js` - Complete game engine with physics, AI, and audio

### Key Components

**Game Engine**
- 60 FPS game loop using `requestAnimationFrame`
- State management (menu, playing, game over)
- Canvas-based rendering

**Physics**
- Ball movement with velocity vectors
- Collision detection for walls and paddles
- Dynamic angle calculation based on paddle hit position
- Progressive speed increase (multiplies by 1.05 per paddle hit)

**CPU AI**
- Ball trajectory prediction
- Medium difficulty with reaction speed of 0.08
- Random error margin for realistic gameplay
- Smooth paddle movement with easing

**Audio System**
- Web Audio API for sound synthesis
- No external audio files required
- Sounds for: paddle hits, wall bounces, scoring

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Adjust Difficulty
Edit `game.js`:
- `CPU_REACTION_SPEED` - Higher = faster reaction (default: 0.08)
- `CPU_ERROR_MARGIN` - Lower = more accurate (default: 25)

### Adjust Speed
- `INITIAL_BALL_SPEED` - Starting speed (default: 8)
- `BALL_SPEED_INCREASE` - Speed multiplier (default: 1.05)
- `PADDLE_SPEED` - Player paddle speed (default: 10)

### Adjust Scoring
- `WINNING_SCORE` - Points to win (default: 11)

## License

MIT License - feel free to use and modify for your own projects!

## Credits

Created as a demonstration of HTML5 Canvas game development with vanilla JavaScript.

---

**Enjoy the game!** 🎮
