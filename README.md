# Pac-Kiro Game - Enhanced Edition

🎮 **Play the game live:** [https://yourusername.github.io/pac-kiro-game/](https://yourusername.github.io/pac-kiro-game/)

A modern take on the classic Pac-Man arcade game featuring the Fortive logo as the main character, enhanced with stunning visual effects, intelligent ghost AI, and persistent high scores.

![Pac-Kiro Game Screenshot](https://via.placeholder.com/600x400/000000/790ECB?text=Pac-Kiro+Game)

## 🆕 Latest Updates

### ✅ **Gameplay Fixes**
- **First Dot Collection**: Player now automatically collects the first dot when starting the game
- **Ghost Respawn**: All 4 ghosts properly reset to center positions when player loses a life
- **Perfect Game Flow**: Smooth gameplay experience from start to finish

### 🧠 **Intelligent Ghost AI**
- **🔴 Red Ghost (Aggressive):** Direct chaser - always moves toward the player with relentless pursuit
- **🩷 Pink Ghost (Ambush):** Smart interceptor - predicts player movement and tries to cut you off
- **🩵 Cyan Ghost (Patrol):** Tactical hunter - chases when close, patrols when far away  
- **🟠 Orange Ghost (Shy):** Unpredictable behavior - chases when far, flees when too close to player
- Advanced pathfinding with alternative route detection
- No more ghosts getting stuck in corners!

## ✨ Enhanced Features

### 🟣 **Trail Particles**
- Purple particles follow Kiro as you move through the maze
- Uses the signature Kiro brand color (#790ECB)
- Smooth fading animation with opacity-based lifecycle

### 💥 **Explosion Effects**
- Dynamic red and orange particle explosions on ghost collisions
- Realistic physics with gravity and random velocities
- 8 particles per explosion for maximum visual impact

### ✨ **Sparkle Effects**
- White and yellow sparkle particles when collecting dots
- Twinkling animation with sine wave opacity modulation
- 3-5 particles per dot collection for satisfying feedback

### 🎊 **Confetti Celebration**
- Multi-colored confetti animation for new high scores
- 50 particles with realistic falling physics
- Includes Kiro purple along with vibrant celebration colors

### 💾 **Persistent High Scores**
- Automatic saving using localStorage API
- High scores persist across browser sessions
- Graceful error handling for storage issues

### ⚡ **Performance Optimization**
- Maintains smooth 60 FPS gameplay
- Automatic particle limiting under heavy loads
- Particle pooling system for memory efficiency
- Performance mode activation when frame rate drops

## 🎯 How to Play

- **Movement:** Use arrow keys or WASD keys to navigate through the maze
- **Objective:** Collect all dots while avoiding the intelligent ghosts
- **Strategy:** Each ghost has unique behavior - learn their patterns!
  - **Red ghost** chases you directly - stay mobile!
  - **Pink ghost** tries to ambush you - be unpredictable!
  - **Cyan ghost** patrols and chases when close - use distance wisely!
  - **Orange ghost** is shy and runs away when you get too close - use this to your advantage!
- **Goal:** Try to beat your high score for a confetti celebration!

## 🛠️ Technical Details

### **Technology Stack**
- **Frontend:** Vanilla JavaScript (ES6+ classes)
- **Graphics:** HTML5 Canvas API for 2D rendering
- **Styling:** CSS3 with gradient backgrounds and responsive design
- **Storage:** localStorage for persistent data

### **Architecture**
- Object-oriented design with modular class structure
- Advanced AI system with multiple ghost behaviors
- Particle system with pooling for performance
- Score management with error handling
- 60 FPS game loop using requestAnimationFrame

### **AI System**
- **Pathfinding:** Smart direction selection based on player position
- **Behavior Trees:** Each ghost has unique decision-making logic
- **Collision Avoidance:** Ghosts find alternative routes when blocked
- **Performance Optimized:** AI calculations don't impact frame rate

### **Performance Features**
- **Particle Pooling:** Reuses particle objects to reduce garbage collection
- **Performance Mode:** Automatically reduces particle count when needed
- **Frame Rate Monitoring:** Tracks performance and adjusts settings dynamically
- **Error Resilience:** Game continues even if particle effects fail

## 🚀 Getting Started

### **Play Online**
Visit the live game at: [https://yourusername.github.io/pac-kiro-game/](https://yourusername.github.io/pac-kiro-game/)

### **Run Locally**
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/pac-kiro-game.git
   cd pac-kiro-game
   ```

2. Serve the files using any HTTP server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser and navigate to `http://localhost:8000`

### **Files Structure**
```
pac-kiro-game/
├── index.html          # Main game page with enhanced UI
├── game.js            # Complete game logic with AI and particle effects
├── Fortive-logo.png   # Player character sprite
└── README.md          # This file
```

## 🎨 Visual Effects System

The game features a sophisticated particle system with multiple effect types:

### **Particle Classes**
- **Particle:** Base class with position, velocity, color, and lifecycle
- **ParticleSystem:** Manages all particles with pooling and performance monitoring

### **Effect Types**
- **Trail:** Follows player movement with purple color and fade
- **Explosion:** Burst effect on collisions with physics simulation
- **Sparkle:** Twinkling effect on dot collection with sine wave animation
- **Confetti:** Celebration effect with gravity and multiple colors

### **Performance Optimizations**
- Particle pooling to reduce object creation
- Automatic particle count limiting
- Performance mode for lower-end devices
- Error handling to maintain game stability

## 🧠 Ghost AI System

### **AI Behaviors**
Each ghost has a unique personality and strategy:

#### 🔴 **Red Ghost - "Blinky" (Aggressive Chaser)**
- **Behavior:** Direct pursuit of the player
- **Strategy:** Always takes the shortest path toward the player
- **Difficulty:** High - relentless and predictable
- **Counter:** Stay mobile and use maze corners

#### 🩷 **Pink Ghost - "Pinky" (Ambush Predator)**
- **Behavior:** Tries to intercept the player
- **Strategy:** Predicts player movement 4 steps ahead
- **Difficulty:** Very High - unpredictable positioning
- **Counter:** Change direction frequently

#### 🩵 **Cyan Ghost - "Inky" (Tactical Hunter)**
- **Behavior:** Distance-based strategy switching
- **Strategy:** Chases when close (< 8 cells), patrols when far
- **Difficulty:** Medium - balanced approach
- **Counter:** Use distance to control its behavior

#### 🟠 **Orange Ghost - "Clyde" (Shy Wanderer)**
- **Behavior:** Flees when close, chases when far
- **Strategy:** Runs away when within 6 cells, pursues from distance
- **Difficulty:** Low-Medium - can be manipulated
- **Counter:** Get close to make it flee, then collect dots safely

### **AI Features**
- **Smart Pathfinding:** Ghosts find optimal routes around obstacles
- **Alternative Routes:** When blocked, ghosts find secondary paths
- **No Reversal:** Ghosts avoid immediately reversing direction
- **Performance Optimized:** AI calculations are frame-rate friendly

## 🎮 Game Mechanics

### **Player Character**
- Grid-based movement system
- 8 frames between moves for smooth animation
- Collision detection with walls and entities
- Sprite loading with fallback to geometric shapes
- **Fixed:** First dot collection now works perfectly
- **Fixed:** Proper respawn behavior after losing a life

### **Ghost Behavior**
- **Fixed:** All ghosts reset to center positions when player dies
- Intelligent AI with 4 unique behavior patterns
- 12 frames between moves (slower than player, but still challenging!)
- Advanced pathfinding with collision avoidance

### **Scoring System**
- 10 points per dot collected
- High score tracking with localStorage
- New high score detection and celebration
- Score persistence across browser sessions

### **Lives System**
- 3 lives per game
- Lose a life when caught by a ghost
- Game over when all lives are lost
- **Fixed:** Player and ghosts properly reset positions after losing a life

## 🔧 Development

### **Adding New Features**
The modular architecture makes it easy to extend:

1. **New Ghost Behaviors:** Extend the ghost AI methods
2. **New Particle Effects:** Extend the ParticleSystem class
3. **Game Mechanics:** Modify the PacKiroGame class
4. **Visual Enhancements:** Update the render methods
5. **Performance Tweaks:** Adjust the performance monitoring system

### **Testing**
The game includes comprehensive error handling and performance monitoring:
- Particle system failures are gracefully handled
- localStorage errors don't crash the game
- Performance metrics are logged to console
- Automatic quality adjustment based on frame rate
- AI pathfinding errors are handled gracefully

## 📱 Browser Compatibility

- **Chrome:** Full support with optimal performance
- **Firefox:** Full support with good performance
- **Safari:** Full support (may require user interaction for audio)
- **Edge:** Full support with optimal performance
- **Mobile:** Responsive design works on touch devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (especially AI behaviors and gameplay fixes)
5. Submit a pull request

### **AI Development Guidelines**
- Test each ghost behavior individually
- Ensure ghosts don't get stuck in corners
- Verify performance impact of AI calculations
- Test edge cases (player in corners, maze boundaries)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by the classic Pac-Man arcade game
- Built with modern web technologies
- Enhanced with Kiro branding and visual effects
- Advanced AI system for challenging gameplay
- Designed for educational and demonstration purposes

## 📈 Version History

### v3.0 (Current - Final Release)
- ✅ **FIXED:** First dot collection - player now eats first dot when starting
- ✅ **FIXED:** Ghost respawn - all ghosts reset to center when player dies
- ✅ **ENHANCED:** Intelligent ghost AI with 4 unique behaviors
- ✅ **ENHANCED:** Advanced pathfinding and collision avoidance
- ✅ **ENHANCED:** Professional UI with responsive design
- ✅ **ENHANCED:** Comprehensive documentation and setup guide

### v2.0
- ✅ Intelligent ghost AI with 4 unique behaviors
- ✅ Enhanced pathfinding and collision avoidance
- ✅ Improved performance optimization
- ✅ Better error handling and stability

### v1.0
- ✅ Basic game mechanics
- ✅ Particle effects system
- ✅ Score persistence
- ✅ Performance monitoring

---

**Built with ❤️ and 🧠 for the Kiro community**

🎮 **[Play Now!](https://yourusername.github.io/pac-kiro-game/)** 🎮