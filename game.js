// ScoreManager class for persistent score tracking
class ScoreManager {
    constructor() {
        this.currentScore = 0;
        this.highScore = 0;
        this.loadHighScore();
    }
    
    loadHighScore() {
        try {
            const stored = localStorage.getItem('pacKiroHighScore');
            this.highScore = stored ? parseInt(stored, 10) : 0;
            if (isNaN(this.highScore)) {
                this.highScore = 0;
            }
        } catch (error) {
            console.warn('Error loading high score:', error);
            this.highScore = 0;
        }
    }
    
    saveHighScore() {
        try {
            localStorage.setItem('pacKiroHighScore', this.highScore.toString());
        } catch (error) {
            console.warn('Error saving high score:', error);
        }
    }
    
    updateCurrentScore(score) {
        this.currentScore = score;
    }
    
    checkNewHighScore() {
        if (this.currentScore > this.highScore) {
            this.highScore = this.currentScore;
            this.saveHighScore();
            return true;
        }
        return false;
    }
    
    getHighScore() {
        return this.highScore;
    }
    
    getCurrentScore() {
        return this.currentScore;
    }
}

// Particle class for individual particles
class Particle {
    constructor(x, y, vx, vy, color, size, maxLife, type, options = {}) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
        this.opacity = 1.0;
        this.age = 0;
        this.maxLife = maxLife;
        this.type = type;
        this.gravity = options.gravity || 0;
        this.twinkle = options.twinkle || false;
        this.twinklePhase = 0;
    }
    
    update() {
        this.age++;
        this.x += this.vx;
        this.y += this.vy;
        
        // Apply gravity
        if (this.gravity > 0) {
            this.vy += this.gravity;
        }
        
        // Update opacity based on age
        this.opacity = Math.max(0, 1 - (this.age / this.maxLife));
        
        // Twinkling effect for sparkles
        if (this.twinkle) {
            this.twinklePhase += 0.3;
            this.opacity *= (0.5 + 0.5 * Math.sin(this.twinklePhase));
        }
    }
    
    render(ctx) {
        if (this.opacity <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.age >= this.maxLife;
    }
}

// ParticleSystem class for managing visual effects
class ParticleSystem {
    constructor(canvasContext) {
        this.ctx = canvasContext;
        this.particles = [];
        this.maxParticles = 150; // Reduced for better performance
        this.particlePool = []; // Pool for particle reuse
        this.poolSize = 50;
        this.performanceMode = false;
        this.frameTime = 0;
        this.lastFrameTime = performance.now();
        
        // Initialize particle pool
        this.initializePool();
    }
    
    initializePool() {
        for (let i = 0; i < this.poolSize; i++) {
            this.particlePool.push(new Particle(0, 0, 0, 0, '#FFFFFF', 1, 1, 'pool'));
        }
    }
    
    getPooledParticle() {
        if (this.particlePool.length > 0) {
            return this.particlePool.pop();
        }
        return null;
    }
    
    returnToPool(particle) {
        if (this.particlePool.length < this.poolSize) {
            // Reset particle properties
            particle.age = 0;
            particle.opacity = 1.0;
            particle.twinklePhase = 0;
            this.particlePool.push(particle);
        }
    }
    
    checkPerformance() {
        const currentTime = performance.now();
        this.frameTime = currentTime - this.lastFrameTime;
        this.lastFrameTime = currentTime;
        
        // If frame time exceeds 20ms (below 50 FPS), enable performance mode
        if (this.frameTime > 20) {
            this.performanceMode = true;
            this.maxParticles = Math.max(50, this.maxParticles - 10);
        } else if (this.frameTime < 12 && this.performanceMode) {
            // If performance improves, gradually increase particle limit
            this.performanceMode = false;
            this.maxParticles = Math.min(150, this.maxParticles + 5);
        }
    }
    
    update() {
        // Check performance and adjust settings
        this.checkPerformance();
        
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            
            // Remove dead particles and return to pool if possible
            if (particle.isDead()) {
                this.particles.splice(i, 1);
                this.returnToPool(particle);
            }
        }
        
        // Aggressive particle limiting for performance
        if (this.particles.length > this.maxParticles) {
            const excessParticles = this.particles.splice(0, this.particles.length - this.maxParticles);
            excessParticles.forEach(particle => this.returnToPool(particle));
        }
    }
    
    render() {
        // Skip rendering if too many particles and performance is poor
        if (this.performanceMode && this.particles.length > 100) {
            // Only render every other particle in performance mode
            for (let i = 0; i < this.particles.length; i += 2) {
                this.particles[i].render(this.ctx);
            }
        } else {
            this.particles.forEach(particle => particle.render(this.ctx));
        }
    }
    
    createTrailParticle(x, y) {
        // Skip trail particles in performance mode
        if (this.performanceMode) return;
        
        const pooledParticle = this.getPooledParticle();
        let particle;
        
        if (pooledParticle) {
            // Reuse pooled particle
            particle = pooledParticle;
            particle.x = x + 15;
            particle.y = y + 15;
            particle.vx = 0;
            particle.vy = 0;
            particle.color = '#790ECB';
            particle.size = 4;
            particle.maxLife = 20;
            particle.type = 'trail';
            particle.gravity = 0;
            particle.twinkle = false;
        } else {
            // Create new particle if pool is empty
            particle = new Particle(
                x + 15, // Center of cell
                y + 15,
                0, 0, // No velocity for trail
                '#790ECB', // Kiro purple
                4, // Size
                20, // Max life (20 frames)
                'trail'
            );
        }
        
        this.particles.push(particle);
    }
    
    createExplosion(x, y) {
        const colors = ['#FF0000', '#FF8800', '#FFFF00'];
        const particleCount = this.performanceMode ? 4 : 8; // Reduce particles in performance mode
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const speed = 2 + Math.random() * 2;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const pooledParticle = this.getPooledParticle();
            let particle;
            
            if (pooledParticle) {
                // Reuse pooled particle
                particle = pooledParticle;
                particle.x = x + 15;
                particle.y = y + 15;
                particle.vx = vx;
                particle.vy = vy;
                particle.color = color;
                particle.size = 6;
                particle.maxLife = 30;
                particle.type = 'explosion';
                particle.gravity = 0.1;
                particle.twinkle = false;
            } else {
                // Create new particle if pool is empty
                particle = new Particle(
                    x + 15, // Center of cell
                    y + 15,
                    vx, vy,
                    color,
                    6, // Size
                    30, // Max life
                    'explosion',
                    { gravity: 0.1 }
                );
            }
            
            this.particles.push(particle);
        }
    }
    
    createSparkles(x, y) {
        const colors = ['#FFFFFF', '#FFFF00'];
        const particleCount = this.performanceMode ? 2 : (3 + Math.floor(Math.random() * 3)); // 3-5 particles, reduced in performance mode
        
        for (let i = 0; i < particleCount; i++) {
            const vx = (Math.random() - 0.5) * 2;
            const vy = (Math.random() - 0.5) * 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const pooledParticle = this.getPooledParticle();
            let particle;
            
            if (pooledParticle) {
                // Reuse pooled particle
                particle = pooledParticle;
                particle.x = x + 15 + (Math.random() - 0.5) * 20;
                particle.y = y + 15 + (Math.random() - 0.5) * 20;
                particle.vx = vx;
                particle.vy = vy;
                particle.color = color;
                particle.size = 3;
                particle.maxLife = 25;
                particle.type = 'sparkle';
                particle.gravity = 0;
                particle.twinkle = true;
            } else {
                // Create new particle if pool is empty
                particle = new Particle(
                    x + 15 + (Math.random() - 0.5) * 20, // Spread around cell
                    y + 15 + (Math.random() - 0.5) * 20,
                    vx, vy,
                    color,
                    3, // Size
                    25, // Max life
                    'sparkle',
                    { twinkle: true }
                );
            }
            
            this.particles.push(particle);
        }
    }
    
    createConfetti() {
        const colors = ['#790ECB', '#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
        const particleCount = this.performanceMode ? 25 : 50; // Reduce confetti in performance mode
        
        for (let i = 0; i < particleCount; i++) {
            const x = Math.random() * 600; // Spread across screen width
            const y = -10; // Start above screen
            const vx = (Math.random() - 0.5) * 4;
            const vy = Math.random() * 2 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            const pooledParticle = this.getPooledParticle();
            let particle;
            
            if (pooledParticle) {
                // Reuse pooled particle
                particle = pooledParticle;
                particle.x = x;
                particle.y = y;
                particle.vx = vx;
                particle.vy = vy;
                particle.color = color;
                particle.size = 5;
                particle.maxLife = 120;
                particle.type = 'confetti';
                particle.gravity = 0.1;
                particle.twinkle = false;
            } else {
                // Create new particle if pool is empty
                particle = new Particle(
                    x, y,
                    vx, vy,
                    color,
                    5, // Size
                    120, // Max life (2 seconds at 60 FPS)
                    'confetti',
                    { gravity: 0.1 }
                );
            }
            
            this.particles.push(particle);
        }
    }
    
    cleanupParticles() {
        this.particles = this.particles.filter(particle => !particle.isDead());
    }
    
    // Performance monitoring methods
    getPerformanceStats() {
        return {
            particleCount: this.particles.length,
            maxParticles: this.maxParticles,
            performanceMode: this.performanceMode,
            frameTime: this.frameTime,
            poolSize: this.particlePool.length,
            poolUtilization: ((this.poolSize - this.particlePool.length) / this.poolSize * 100).toFixed(1) + '%'
        };
    }
    
    // Force performance mode for testing
    setPerformanceMode(enabled) {
        this.performanceMode = enabled;
        if (enabled) {
            this.maxParticles = Math.min(this.maxParticles, 75);
        } else {
            this.maxParticles = 150;
        }
    }
}

class PacKiroGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.messageElement = document.getElementById('gameMessage');
        
        // Initialize new systems
        this.scoreManager = new ScoreManager();
        this.particleSystem = new ParticleSystem(this.ctx);
        this.newHighScoreMessage = false;
        this.newHighScoreTimer = 0;
        
        // Game constants
        this.CELL_SIZE = 30;
        this.MAZE_WIDTH = 20;
        this.MAZE_HEIGHT = 20;
        this.PLAYER_SPEED = 8; // frames between moves
        this.GHOST_SPEED = 12; // frames between moves
        
        // Game state
        this.gameState = 'start';
        this.score = 0;
        this.lives = 3;
        this.frameCount = 0;
        
        // Player
        this.player = {
            x: 1,
            y: 1,
            direction: { x: 0, y: 0 },
            nextDirection: { x: 0, y: 0 },
            moveTimer: 0,
            sprite: null
        };
        
        // Ghosts
        this.ghosts = [
            { x: 9, y: 9, direction: { x: 1, y: 0 }, moveTimer: 0, color: '#FF0000' },
            { x: 10, y: 9, direction: { x: -1, y: 0 }, moveTimer: 0, color: '#FFB8FF' },
            { x: 9, y: 10, direction: { x: 0, y: 1 }, moveTimer: 0, color: '#00FFFF' },
            { x: 10, y: 10, direction: { x: 0, y: -1 }, moveTimer: 0, color: '#FFB852' }
        ];
        
        // Original maze template (1 = wall, 0 = dot, 2 = empty)
        this.originalMaze = [
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
            [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
            [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
            [1,1,1,1,0,1,2,1,1,2,2,1,1,2,1,0,1,1,1,1],
            [2,2,2,2,0,2,2,1,2,2,2,2,1,2,2,0,2,2,2,2],
            [1,1,1,1,0,1,2,1,1,1,1,1,1,2,1,0,1,1,1,1],
            [1,1,1,1,0,1,2,2,2,2,2,2,2,2,1,0,1,1,1,1],
            [1,1,1,1,0,1,1,1,2,1,1,2,1,1,1,0,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1],
            [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
            [1,1,0,1,0,1,0,1,1,1,1,1,1,0,1,0,1,0,1,1],
            [1,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        // Working maze copy
        this.maze = [];
        this.resetMaze();
        
        this.loadPlayerSprite();
        this.setupEventListeners();
        this.updateUI(); // Initialize UI with high score
        this.gameLoop();
    }
    
    loadPlayerSprite() {
        this.player.sprite = new Image();
        this.player.sprite.onload = () => {
            console.log('Fortive sprite loaded successfully!');
        };
        this.player.sprite.onerror = () => {
            console.log('Could not load Fortive-logo.png, using default circle');
        };
        this.player.sprite.src = 'Fortive-logo.png';
    }
    
    resetMaze() {
        this.maze = this.originalMaze.map(row => [...row]);
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameState === 'start') {
                if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'].includes(e.key)) {
                    this.startGame();
                }
            }
            
            if (this.gameState === 'playing') {
                switch(e.key) {
                    case 'ArrowUp':
                    case 'w':
                    case 'W':
                        this.player.nextDirection = { x: 0, y: -1 };
                        break;
                    case 'ArrowDown':
                    case 's':
                    case 'S':
                        this.player.nextDirection = { x: 0, y: 1 };
                        break;
                    case 'ArrowLeft':
                    case 'a':
                    case 'A':
                        this.player.nextDirection = { x: -1, y: 0 };
                        break;
                    case 'ArrowRight':
                    case 'd':
                    case 'D':
                        this.player.nextDirection = { x: 1, y: 0 };
                        break;
                }
            }
            
            if (this.gameState === 'gameOver' || this.gameState === 'levelComplete') {
                if (e.key === ' ') {
                    this.restartGame();
                }
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.messageElement.textContent = '';
        
        // Check if player is on a dot when starting and collect it
        if (this.maze[this.player.y][this.player.x] === 0) {
            this.maze[this.player.y][this.player.x] = 2; // Mark as empty
            this.score += 10;
            this.scoreManager.updateCurrentScore(this.score);
            
            // Create sparkle effect at dot position
            const dotX = this.player.x * this.CELL_SIZE;
            const dotY = this.player.y * this.CELL_SIZE;
            this.particleSystem.createSparkles(dotX, dotY);
            
            this.updateUI();
        }
    }
    
    restartGame() {
        // Save current score before resetting (in case of high score)
        this.scoreManager.checkNewHighScore();
        
        this.gameState = 'start';
        this.score = 0;
        this.lives = 3;
        this.frameCount = 0;
        this.newHighScoreMessage = false;
        this.newHighScoreTimer = 0;
        
        // Reset score manager current score
        this.scoreManager.updateCurrentScore(0);
        
        // Reset player
        this.player.x = 1;
        this.player.y = 1;
        this.player.direction = { x: 0, y: 0 };
        this.player.nextDirection = { x: 0, y: 0 };
        this.player.moveTimer = 0;
        
        // Reset ghosts
        this.ghosts = [
            { x: 9, y: 9, direction: { x: 1, y: 0 }, moveTimer: 0, color: '#FF0000' },
            { x: 10, y: 9, direction: { x: -1, y: 0 }, moveTimer: 0, color: '#FFB8FF' },
            { x: 9, y: 10, direction: { x: 0, y: 1 }, moveTimer: 0, color: '#00FFFF' },
            { x: 10, y: 10, direction: { x: 0, y: -1 }, moveTimer: 0, color: '#FFB852' }
        ];
        
        // Reset maze
        this.resetMaze();
        
        // Clear particles and reset particle system performance
        this.particleSystem.particles = [];
        this.particleSystem.performanceMode = false;
        this.particleSystem.maxParticles = 150;
        
        this.messageElement.textContent = 'Use arrow keys or WASD to move! Press any movement key to start';
        this.updateUI();
    }
    
    canMove(x, y, direction) {
        const newX = x + direction.x;
        const newY = y + direction.y;
        
        // Check bounds
        if (newX < 0 || newX >= this.MAZE_WIDTH || newY < 0 || newY >= this.MAZE_HEIGHT) {
            return false;
        }
        
        // Check walls
        return this.maze[newY][newX] !== 1;
    }
    
    updatePlayer() {
        if (this.gameState !== 'playing') return;
        
        this.player.moveTimer++;
        
        if (this.player.moveTimer >= this.PLAYER_SPEED) {
            // Try to change direction if requested
            if (this.player.nextDirection.x !== 0 || this.player.nextDirection.y !== 0) {
                if (this.canMove(this.player.x, this.player.y, this.player.nextDirection)) {
                    this.player.direction = { ...this.player.nextDirection };
                }
            }
            
            // Move in current direction
            if (this.canMove(this.player.x, this.player.y, this.player.direction)) {
                // Create trail particle at previous position
                const prevX = this.player.x * this.CELL_SIZE;
                const prevY = this.player.y * this.CELL_SIZE;
                this.particleSystem.createTrailParticle(prevX, prevY);
                
                this.player.x += this.player.direction.x;
                this.player.y += this.player.direction.y;
                
                // Collect dots
                if (this.maze[this.player.y][this.player.x] === 0) {
                    this.maze[this.player.y][this.player.x] = 2; // Mark as empty
                    this.score += 10;
                    this.scoreManager.updateCurrentScore(this.score);
                    
                    // Create sparkle effect at dot position
                    const dotX = this.player.x * this.CELL_SIZE;
                    const dotY = this.player.y * this.CELL_SIZE;
                    this.particleSystem.createSparkles(dotX, dotY);
                    
                    this.updateUI();
                    
                    // Check for level complete
                    if (this.checkLevelComplete()) {
                        this.gameState = 'levelComplete';
                        
                        // Check for new high score
                        if (this.scoreManager.checkNewHighScore()) {
                            this.particleSystem.createConfetti();
                            this.newHighScoreMessage = true;
                            this.newHighScoreTimer = 180; // 3 seconds at 60 FPS
                            this.messageElement.textContent = 'New High Score! Level Complete! Press SPACE to restart';
                        } else {
                            this.messageElement.textContent = 'Level Complete! Press SPACE to restart';
                        }
                    }
                }
            }
            
            this.player.moveTimer = 0;
        }
    }
    
    updateGhosts() {
        if (this.gameState !== 'playing') return;
        
        this.ghosts.forEach((ghost, index) => {
            ghost.moveTimer++;
            
            if (ghost.moveTimer >= this.GHOST_SPEED) {
                // Enhanced AI: Chase the player with different behaviors per ghost
                const newDirection = this.getGhostDirection(ghost, index);
                
                if (newDirection) {
                    ghost.direction = newDirection;
                }
                
                // Move ghost
                if (this.canMove(ghost.x, ghost.y, ghost.direction)) {
                    ghost.x += ghost.direction.x;
                    ghost.y += ghost.direction.y;
                } else {
                    // If blocked, try to find alternative path
                    const alternativeDirection = this.getAlternativeDirection(ghost);
                    if (alternativeDirection) {
                        ghost.direction = alternativeDirection;
                        if (this.canMove(ghost.x, ghost.y, ghost.direction)) {
                            ghost.x += ghost.direction.x;
                            ghost.y += ghost.direction.y;
                        }
                    }
                }
                
                ghost.moveTimer = 0;
            }
        });
    }
    
    // Enhanced AI: Get direction for ghost to chase player
    getGhostDirection(ghost, ghostIndex) {
        const dx = this.player.x - ghost.x;
        const dy = this.player.y - ghost.y;
        const distance = Math.abs(dx) + Math.abs(dy);
        
        // Different behavior for each ghost
        switch (ghostIndex) {
            case 0: // Red ghost - Direct chaser (most aggressive)
                return this.getDirectChaseDirection(ghost, dx, dy);
            
            case 1: // Pink ghost - Ambush behavior (tries to get ahead of player)
                return this.getAmbushDirection(ghost, dx, dy);
            
            case 2: // Cyan ghost - Patrol behavior (chases when close, patrols when far)
                return distance < 8 ? this.getDirectChaseDirection(ghost, dx, dy) : this.getPatrolDirection(ghost);
            
            case 3: // Orange ghost - Shy behavior (chases when far, runs when close)
                return distance > 6 ? this.getDirectChaseDirection(ghost, dx, dy) : this.getFleeDirection(ghost, dx, dy);
            
            default:
                return this.getDirectChaseDirection(ghost, dx, dy);
        }
    }
    
    // Direct chase - move towards player
    getDirectChaseDirection(ghost, dx, dy) {
        const directions = [];
        
        // Prioritize the direction that gets closer to player
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal movement is more important
            if (dx > 0) directions.push({ x: 1, y: 0 });   // right
            if (dx < 0) directions.push({ x: -1, y: 0 });  // left
            if (dy > 0) directions.push({ x: 0, y: 1 });   // down
            if (dy < 0) directions.push({ x: 0, y: -1 });  // up
        } else {
            // Vertical movement is more important
            if (dy > 0) directions.push({ x: 0, y: 1 });   // down
            if (dy < 0) directions.push({ x: 0, y: -1 });  // up
            if (dx > 0) directions.push({ x: 1, y: 0 });   // right
            if (dx < 0) directions.push({ x: -1, y: 0 });  // left
        }
        
        // Try directions in order of preference
        for (const dir of directions) {
            if (this.canMove(ghost.x, ghost.y, dir)) {
                return dir;
            }
        }
        
        return null;
    }
    
    // Ambush behavior - try to intercept player
    getAmbushDirection(ghost, dx, dy) {
        // Try to predict where player will be and head there
        const playerDir = this.player.direction;
        const targetX = this.player.x + (playerDir.x * 4); // Predict 4 steps ahead
        const targetY = this.player.y + (playerDir.y * 4);
        
        const ambushDx = targetX - ghost.x;
        const ambushDy = targetY - ghost.y;
        
        return this.getDirectChaseDirection(ghost, ambushDx, ambushDy);
    }
    
    // Patrol behavior - move in a pattern when not chasing
    getPatrolDirection(ghost) {
        // Simple patrol: prefer horizontal movement, change direction at walls
        const directions = [
            { x: 1, y: 0 },   // right
            { x: -1, y: 0 },  // left
            { x: 0, y: 1 },   // down
            { x: 0, y: -1 }   // up
        ];
        
        // Try to continue in current direction
        if (this.canMove(ghost.x, ghost.y, ghost.direction)) {
            return ghost.direction;
        }
        
        // If blocked, try other directions
        const validDirections = directions.filter(dir => 
            this.canMove(ghost.x, ghost.y, dir)
        );
        
        if (validDirections.length > 0) {
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        }
        
        return null;
    }
    
    // Flee behavior - run away from player
    getFleeDirection(ghost, dx, dy) {
        const directions = [];
        
        // Move away from player
        if (dx > 0) directions.push({ x: -1, y: 0 });  // left (away from player)
        if (dx < 0) directions.push({ x: 1, y: 0 });   // right (away from player)
        if (dy > 0) directions.push({ x: 0, y: -1 });  // up (away from player)
        if (dy < 0) directions.push({ x: 0, y: 1 });   // down (away from player)
        
        // Add perpendicular directions as backup
        if (Math.abs(dx) > Math.abs(dy)) {
            directions.push({ x: 0, y: 1 });   // down
            directions.push({ x: 0, y: -1 });  // up
        } else {
            directions.push({ x: 1, y: 0 });   // right
            directions.push({ x: -1, y: 0 });  // left
        }
        
        // Try directions in order
        for (const dir of directions) {
            if (this.canMove(ghost.x, ghost.y, dir)) {
                return dir;
            }
        }
        
        return null;
    }
    
    // Get alternative direction when blocked
    getAlternativeDirection(ghost) {
        const directions = [
            { x: 0, y: -1 }, // up
            { x: 0, y: 1 },  // down
            { x: -1, y: 0 }, // left
            { x: 1, y: 0 }   // right
        ];
        
        // Filter out the opposite of current direction to avoid immediate reversal
        const oppositeDir = { x: -ghost.direction.x, y: -ghost.direction.y };
        const validDirections = directions.filter(dir => 
            this.canMove(ghost.x, ghost.y, dir) && 
            !(dir.x === oppositeDir.x && dir.y === oppositeDir.y)
        );
        
        if (validDirections.length > 0) {
            return validDirections[Math.floor(Math.random() * validDirections.length)];
        }
        
        // If no alternatives, allow reversal
        const allValidDirections = directions.filter(dir => 
            this.canMove(ghost.x, ghost.y, dir)
        );
        
        if (allValidDirections.length > 0) {
            return allValidDirections[Math.floor(Math.random() * allValidDirections.length)];
        }
        
        return null;
    }
    
    checkCollisions() {
        if (this.gameState !== 'playing') return;
        
        // Check ghost collisions
        this.ghosts.forEach(ghost => {
            if (ghost.x === this.player.x && ghost.y === this.player.y) {
                // Create explosion effect at collision position
                const collisionX = this.player.x * this.CELL_SIZE;
                const collisionY = this.player.y * this.CELL_SIZE;
                this.particleSystem.createExplosion(collisionX, collisionY);
                
                this.lives--;
                this.updateUI();
                
                if (this.lives <= 0) {
                    this.gameState = 'gameOver';
                    
                    // Check for new high score
                    if (this.scoreManager.checkNewHighScore()) {
                        this.particleSystem.createConfetti();
                        this.newHighScoreMessage = true;
                        this.newHighScoreTimer = 180; // 3 seconds at 60 FPS
                        this.messageElement.textContent = 'New High Score! Game Over! Press SPACE to restart';
                    } else {
                        this.messageElement.textContent = 'Game Over! Press SPACE to restart';
                    }
                } else {
                    // Reset player position
                    this.player.x = 1;
                    this.player.y = 1;
                    this.player.direction = { x: 0, y: 0 };
                    this.player.nextDirection = { x: 0, y: 0 };
                    
                    // Reset ghosts to center positions
                    this.ghosts = [
                        { x: 9, y: 9, direction: { x: 1, y: 0 }, moveTimer: 0, color: '#FF0000' },
                        { x: 10, y: 9, direction: { x: -1, y: 0 }, moveTimer: 0, color: '#FFB8FF' },
                        { x: 9, y: 10, direction: { x: 0, y: 1 }, moveTimer: 0, color: '#00FFFF' },
                        { x: 10, y: 10, direction: { x: 0, y: -1 }, moveTimer: 0, color: '#FFB852' }
                    ];
                }
            }
        });
    }
    
    checkLevelComplete() {
        // Check if all dots are collected
        for (let y = 0; y < this.MAZE_HEIGHT; y++) {
            for (let x = 0; x < this.MAZE_WIDTH; x++) {
                if (this.maze[y][x] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    
    updateUI() {
        this.scoreElement.textContent = `Score: ${this.score}`;
        this.livesElement.textContent = `Lives: ${this.lives}`;
        
        // Update high score display
        let highScoreElement = document.getElementById('highScore');
        if (!highScoreElement) {
            // Create high score element if it doesn't exist
            highScoreElement = document.createElement('div');
            highScoreElement.id = 'highScore';
            highScoreElement.style.color = '#790ECB';
            highScoreElement.style.fontSize = '18px';
            const gameInfo = document.getElementById('gameInfo');
            gameInfo.appendChild(highScoreElement);
        }
        highScoreElement.textContent = `High Score: ${this.scoreManager.getHighScore()}`;
        
        // Add performance indicator if in performance mode
        let perfElement = document.getElementById('performance');
        if (this.particleSystem.performanceMode) {
            if (!perfElement) {
                perfElement = document.createElement('div');
                perfElement.id = 'performance';
                perfElement.style.color = '#FF8800';
                perfElement.style.fontSize = '12px';
                perfElement.style.marginTop = '5px';
                const gameInfo = document.getElementById('gameInfo');
                gameInfo.appendChild(perfElement);
            }
            perfElement.textContent = `Performance Mode: ${this.particleSystem.particles.length}/${this.particleSystem.maxParticles} particles`;
        } else if (perfElement) {
            perfElement.remove();
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw maze
        for (let y = 0; y < this.MAZE_HEIGHT; y++) {
            for (let x = 0; x < this.MAZE_WIDTH; x++) {
                const cellX = x * this.CELL_SIZE;
                const cellY = y * this.CELL_SIZE;
                
                if (this.maze[y][x] === 1) {
                    // Wall
                    this.ctx.fillStyle = '#790ECB';
                    this.ctx.fillRect(cellX, cellY, this.CELL_SIZE, this.CELL_SIZE);
                } else if (this.maze[y][x] === 0) {
                    // Dot
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.beginPath();
                    this.ctx.arc(
                        cellX + this.CELL_SIZE / 2,
                        cellY + this.CELL_SIZE / 2,
                        3,
                        0,
                        Math.PI * 2
                    );
                    this.ctx.fill();
                }
            }
        }
        
        // Draw player
        const playerX = this.player.x * this.CELL_SIZE;
        const playerY = this.player.y * this.CELL_SIZE;
        
        if (this.player.sprite && this.player.sprite.complete) {
            // Draw Fortive sprite
            this.ctx.drawImage(
                this.player.sprite,
                playerX + 2,
                playerY + 2,
                this.CELL_SIZE - 4,
                this.CELL_SIZE - 4
            );
        } else {
            // Fallback: draw yellow circle
            this.ctx.fillStyle = '#FFFF00';
            this.ctx.beginPath();
            this.ctx.arc(
                playerX + this.CELL_SIZE / 2,
                playerY + this.CELL_SIZE / 2,
                this.CELL_SIZE / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
        
        // Draw ghosts
        this.ghosts.forEach(ghost => {
            const ghostX = ghost.x * this.CELL_SIZE;
            const ghostY = ghost.y * this.CELL_SIZE;
            
            this.ctx.fillStyle = ghost.color;
            this.ctx.beginPath();
            this.ctx.arc(
                ghostX + this.CELL_SIZE / 2,
                ghostY + this.CELL_SIZE / 2,
                this.CELL_SIZE / 2 - 2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
    }
    
    gameLoop() {
        this.frameCount++;
        
        // Update new high score message timer
        if (this.newHighScoreMessage && this.newHighScoreTimer > 0) {
            this.newHighScoreTimer--;
            if (this.newHighScoreTimer <= 0) {
                this.newHighScoreMessage = false;
            }
        }
        
        // Update game systems
        this.updatePlayer();
        this.updateGhosts();
        this.checkCollisions();
        
        // Update particle system with error handling
        try {
            this.particleSystem.update();
        } catch (error) {
            console.warn('Particle system update error:', error);
            // Reset particle system if it fails
            this.particleSystem.particles = [];
            this.particleSystem.performanceMode = true;
        }
        
        // Render everything
        this.render();
        
        // Render particles on top with error handling
        try {
            this.particleSystem.render();
        } catch (error) {
            console.warn('Particle rendering error:', error);
            // Continue without particles if rendering fails
        }
        
        // Performance monitoring - log warnings if frame rate drops
        if (this.frameCount % 300 === 0) { // Every 5 seconds at 60 FPS
            const particleCount = this.particleSystem.particles.length;
            const performanceMode = this.particleSystem.performanceMode;
            
            if (performanceMode) {
                console.log(`Performance mode active. Particles: ${particleCount}, Max: ${this.particleSystem.maxParticles}`);
            }
            
            // Auto-adjust particle limits based on count
            if (particleCount > 100 && !performanceMode) {
                this.particleSystem.performanceMode = true;
                this.particleSystem.maxParticles = Math.max(50, this.particleSystem.maxParticles - 20);
            }
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new PacKiroGame();
});