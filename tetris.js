class Tetris {
    constructor() {
        this.canvas = document.getElementById('tetris');
        this.ctx = this.canvas.getContext('2d');
        this.nextCanvas = document.getElementById('next-piece-canvas');
        this.nextCtx = this.nextCanvas.getContext('2d');
        
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.blockSize = 30;
        
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameOver = false;
        this.isPaused = false;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropSpeed = 1000;
        this.leaderboard = this.loadLeaderboard();
        
        this.colors = [
            null,
            '#FF0D72', // I
            '#0DC2FF', // J
            '#0DFF72', // L
            '#F538FF', // O
            '#FF8E0D', // S
            '#FFE138', // T
            '#3877FF'  // Z
        ];
        
        this.pieces = [
            null,
            [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            [
                [2, 0, 0],
                [2, 2, 2],
                [0, 0, 0]
            ],
            [
                [0, 0, 3],
                [3, 3, 3],
                [0, 0, 0]
            ],
            [
                [4, 4],
                [4, 4]
            ],
            [
                [0, 5, 5],
                [5, 5, 0],
                [0, 0, 0]
            ],
            [
                [0, 6, 0],
                [6, 6, 6],
                [0, 0, 0]
            ],
            [
                [7, 7, 0],
                [0, 7, 7],
                [0, 0, 0]
            ]
        ];
        
        this.init();
    }
    
    createBoard() {
        return Array.from({ length: this.boardHeight }, () => 
            Array(this.boardWidth).fill(0)
        );
    }
    
    init() {
        this.createNewPiece();
        this.draw();
        this.setupControls();
        this.updateDisplay();
        this.displayLeaderboard();
        this.setupDebugPanel();
    }
    
    createNewPiece() {
        if (!this.nextPiece) {
            this.nextPiece = {
                shape: this.pieces[Math.floor(Math.random() * 7) + 1],
                x: Math.floor(this.boardWidth / 2) - 1,
                y: 0
            };
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = {
            shape: this.pieces[Math.floor(Math.random() * 7) + 1],
            x: Math.floor(this.boardWidth / 2) - 1,
            y: 0
        };
        
        this.drawNextPiece();
        
        if (this.checkCollision(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
            this.gameOver = true;
            this.updateLeaderboard();
            alert('游戏结束！最终得分: ' + this.score);
        }
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制背景网格
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let x = 0; x < this.boardWidth; x++) {
            for (let y = 0; y < this.boardHeight; y++) {
                this.ctx.strokeRect(
                    x * this.blockSize,
                    y * this.blockSize,
                    this.blockSize,
                    this.blockSize
                );
            }
        }
        
        // 绘制已固定的方块
        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = 0; x < this.boardWidth; x++) {
                if (this.board[y][x]) {
                    this.drawBlock(x, y, this.board[y][x]);
                }
            }
        }
        
        // 绘制当前方块
        if (this.currentPiece) {
            for (let y = 0; y < this.currentPiece.shape.length; y++) {
                for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                    if (this.currentPiece.shape[y][x]) {
                        this.drawBlock(
                            this.currentPiece.x + x,
                            this.currentPiece.y + y,
                            this.currentPiece.shape[y][x]
                        );
                    }
                }
            }
        }
    }
    
    drawBlock(x, y, type) {
        this.ctx.fillStyle = this.colors[type];
        this.ctx.fillRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize,
            this.blockSize
        );
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
            x * this.blockSize,
            y * this.blockSize,
            this.blockSize,
            this.blockSize
        );
        
        // 添加内部高光效果
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.fillRect(
            x * this.blockSize + 2,
            y * this.blockSize + 2,
            this.blockSize - 4,
            4
        );
    }
    
    drawNextPiece() {
        this.nextCtx.clearRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (!this.nextPiece) return;
        
        const piece = this.nextPiece.shape;
        const blockSize = 20;
        const offsetX = (this.nextCanvas.width - piece[0].length * blockSize) / 2;
        const offsetY = (this.nextCanvas.height - piece.length * blockSize) / 2;
        
        for (let y = 0; y < piece.length; y++) {
            for (let x = 0; x < piece[y].length; x++) {
                if (piece[y][x]) {
                    this.nextCtx.fillStyle = this.colors[piece[y][x]];
                    this.nextCtx.fillRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                    
                    this.nextCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                    this.nextCtx.lineWidth = 1;
                    this.nextCtx.strokeRect(
                        offsetX + x * blockSize,
                        offsetY + y * blockSize,
                        blockSize,
                        blockSize
                    );
                }
            }
        }
    }
    
    movePiece(dx, dy) {
        if (this.gameOver || this.isPaused) return;
        
        if (!this.checkCollision(this.currentPiece.x + dx, this.currentPiece.y + dy, this.currentPiece.shape)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.draw();
            return true;
        }
        return false;
    }
    
    rotatePiece() {
        if (this.gameOver || this.isPaused) return;
        
        const rotated = this.currentPiece.shape[0].map((_, index) =>
            this.currentPiece.shape.map(row => row[index]).reverse()
        );
        
        if (!this.checkCollision(this.currentPiece.x, this.currentPiece.y, rotated)) {
            this.currentPiece.shape = rotated;
            this.draw();
        }
    }
    
    checkCollision(x, y, shape) {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== 0) {
                    const newX = x + col;
                    const newY = y + row;
                    
                    if (
                        newX < 0 ||
                        newX >= this.boardWidth ||
                        newY >= this.boardHeight ||
                        (newY >= 0 && this.board[newY][newX] !== 0)
                    ) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    lockPiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x] !== 0) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.shape[y][x];
                    }
                }
            }
        }
        
        this.clearLines();
        this.createNewPiece();
    }
    
    clearLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell !== 0)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.boardWidth).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            this.lines += linesCleared;
            this.score += linesCleared * 100 * this.level;
            this.level = Math.floor(this.lines / 10) + 1;
            this.dropSpeed = Math.max(100, 1000 - (this.level - 1) * 100);
            this.updateDisplay();
        }
    }
    
    drop() {
        if (this.gameOver || this.isPaused) return;
        
        if (!this.movePiece(0, 1)) {
            this.lockPiece();
        }
    }
    
    hardDrop() {
        if (this.gameOver || this.isPaused) return;
        
        while (this.movePiece(0, 1)) {
            // 持续下落直到碰撞
        }
        this.lockPiece();
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lines').textContent = this.lines;
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch (e.key) {
                case 'ArrowLeft':
                    this.movePiece(-1, 0);
                    break;
                case 'ArrowRight':
                    this.movePiece(1, 0);
                    break;
                case 'ArrowDown':
                    this.drop();
                    break;
                case 'ArrowUp':
                    this.rotatePiece();
                    break;
                case ' ':
                    this.hardDrop();
                    break;
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
        
        this.setupDebugControls();
        
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pause-btn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetGame();
        });

        document.getElementById('debug-btn').addEventListener('click', () => {
            const debugPanel = document.getElementById('debug-panel');
            const isVisible = debugPanel.style.display !== 'none';
            debugPanel.style.display = isVisible ? 'none' : 'block';
            document.getElementById('debug-toggle').textContent = isVisible ? '显示调试' : '隐藏调试';
        });
        
        // 移动端触摸控制
        this.setupMobileControls();
    }
    
    setupMobileControls() {
        // 检测移动设备，显示调试按钮
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            document.getElementById('debug-btn').style.display = 'inline-block';
        }
        
        // 旋转按钮
        document.getElementById('rotate-btn').addEventListener('click', () => {
            this.rotatePiece();
        });
        
        // 左移按钮
        document.getElementById('left-btn').addEventListener('click', () => {
            this.movePiece(-1, 0);
        });
        
        // 右移按钮
        document.getElementById('right-btn').addEventListener('click', () => {
            this.movePiece(1, 0);
        });
        
        // 下落按钮
        document.getElementById('down-btn').addEventListener('click', () => {
            this.drop();
        });
        
        // 直接落下按钮
        document.getElementById('hard-drop-btn').addEventListener('click', () => {
            this.hardDrop();
        });
        
        // 触摸滑动控制
        this.setupTouchControls();
    }
    
    setupTouchControls() {
        let startX, startY, startTime;
        const minSwipeDistance = 30;
        const maxTapTime = 300; // 毫秒
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
            
            // 添加触摸反馈
            e.target.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            // 防止页面滚动
            if (Math.abs(e.touches[0].clientX - startX) > 10 ||
                Math.abs(e.touches[0].clientY - startY) > 10) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (!startX || !startY || this.gameOver || this.isPaused) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            const timeDiff = endTime - startTime;
            
            // 移除触摸反馈
            e.target.style.transform = '';
            
            // 如果是快速点击（轻触）
            if (timeDiff < maxTapTime && Math.abs(diffX) < 10 && Math.abs(diffY) < 10) {
                // 在游戏区域内的轻触可以触发旋转
                const gameBoard = document.getElementById('tetris');
                const rect = gameBoard.getBoundingClientRect();
                if (startX >= rect.left && startX <= rect.right &&
                    startY >= rect.top && startY <= rect.bottom) {
                    this.rotatePiece();
                }
                return;
            }
            
            // 水平滑动
            if (Math.abs(diffX) > Math.abs(diffY)) {
                if (Math.abs(diffX) > minSwipeDistance) {
                    if (diffX > 0) {
                        this.movePiece(-1, 0); // 向左滑动
                    } else {
                        this.movePiece(1, 0); // 向右滑动
                    }
                }
            }
            // 垂直滑动
            else {
                if (Math.abs(diffY) > minSwipeDistance) {
                    if (diffY > 0) {
                        this.rotatePiece(); // 向上滑动
                    } else {
                        this.hardDrop(); // 向下滑动
                    }
                }
            }
            
            startX = null;
            startY = null;
            startTime = null;
        }, { passive: true });
        
        // 添加长按连续移动功能
        let longPressTimer;
        let lastMoveDirection = null;
        
        document.addEventListener('touchstart', (e) => {
            const target = e.target;
            if (target.classList.contains('control-btn')) {
                longPressTimer = setTimeout(() => {
                    // 长按触发连续移动
                    if (target.id === 'left-btn') {
                        lastMoveDirection = 'left';
                        this.startContinuousMove(-1, 0);
                    } else if (target.id === 'right-btn') {
                        lastMoveDirection = 'right';
                        this.startContinuousMove(1, 0);
                    } else if (target.id === 'down-btn') {
                        lastMoveDirection = 'down';
                        this.startContinuousMove(0, 1);
                    }
                }, 500);
            }
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            clearTimeout(longPressTimer);
            this.stopContinuousMove();
        }, { passive: true });
    }
    
    startContinuousMove(dx, dy) {
        if (this.continuousMoveInterval) {
            clearInterval(this.continuousMoveInterval);
        }
        
        this.continuousMoveInterval = setInterval(() => {
            if (!this.gameOver && !this.isPaused) {
                if (dy === 0) {
                    this.movePiece(dx, 0);
                } else {
                    this.drop();
                }
            }
        }, 100);
    }
    
    stopContinuousMove() {
        if (this.continuousMoveInterval) {
            clearInterval(this.continuousMoveInterval);
            this.continuousMoveInterval = null;
        }
    }
    
    startGame() {
        if (this.gameOver) {
            this.resetGame();
        }
        
        this.gameOver = false;
        this.isPaused = false;
        document.getElementById('pause-btn').textContent = '暂停';
        
        if (!this.gameLoop) {
            this.gameLoop = setInterval(() => {
                if (!this.isPaused && !this.gameOver) {
                    this.drop();
                }
            }, this.dropSpeed);
        }
    }
    
    togglePause() {
        if (this.gameOver) return;
        
        this.isPaused = !this.isPaused;
        document.getElementById('pause-btn').textContent = this.isPaused ? '继续' : '暂停';
    }
    
    resetGame() {
        this.board = this.createBoard();
        this.currentPiece = null;
        this.nextPiece = null;
        this.gameOver = false;
        this.isPaused = false;
        
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.dropSpeed = 1000;
        
        this.createNewPiece();
        this.draw();
        this.updateDisplay();
        
        document.getElementById('pause-btn').textContent = '暂停';
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }
    
    loadLeaderboard() {
        const saved = localStorage.getItem('tetrisLeaderboard');
        if (saved) {
            return JSON.parse(saved);
        }
        return [];
    }
    
    saveLeaderboard() {
        localStorage.setItem('tetrisLeaderboard', JSON.stringify(this.leaderboard));
    }
    
    updateLeaderboard() {
        if (this.score > 0) {
            const playerName = prompt('恭喜你获得高分！请输入你的名字：', '玩家');
            if (playerName) {
                this.leaderboard.push({
                    name: playerName,
                    score: this.score,
                    date: new Date().toLocaleDateString()
                });
                
                // 按分数排序，只保留前10名
                this.leaderboard.sort((a, b) => b.score - a.score);
                this.leaderboard = this.leaderboard.slice(0, 10);
                
                this.saveLeaderboard();
                this.displayLeaderboard();
            }
        }
    }
    
    displayLeaderboard() {
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';
        
        if (this.leaderboard.length === 0) {
            leaderboardList.innerHTML = '<div>暂无记录</div>';
            return;
        }
        
        this.leaderboard.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            entryDiv.innerHTML = `${index + 1}. ${entry.name}: ${entry.score}分 (${entry.date})`;
            leaderboardList.appendChild(entryDiv);
        });
    }
    
    setupDebugPanel() {
        // 创建调试面板
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
            max-width: 300px;
            display: none;
        `;
        
        debugPanel.innerHTML = `
            <div style="margin-bottom: 5px; font-weight: bold;">调试信息</div>
            <div>当前方块: <span id="debug-current-piece">-</span></div>
            <div>位置: (<span id="debug-position">0,0</span>)</div>
            <div>碰撞检测: <span id="debug-collision">无</span></div>
            <div>游戏状态: <span id="debug-game-state">运行中</span></div>
            <div>帧率: <span id="debug-fps">0</span></div>
            <div style="margin-top: 5px;">
                <button id="debug-toggle" style="font-size: 10px; padding: 2px 5px;">隐藏调试</button>
                <button id="debug-step" style="font-size: 10px; padding: 2px 5px;">单步执行</button>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // 调试面板控制
        document.getElementById('debug-toggle').addEventListener('click', () => {
            const isVisible = debugPanel.style.display !== 'none';
            debugPanel.style.display = isVisible ? 'none' : 'block';
            document.getElementById('debug-toggle').textContent = isVisible ? '显示调试' : '隐藏调试';
        });
        
        document.getElementById('debug-step').addEventListener('click', () => {
            if (!this.gameOver && !this.isPaused) {
                this.drop();
            }
        });
        
        // 帧率计算
        let frameCount = 0;
        let lastTime = performance.now();
        
        const updateDebugInfo = () => {
            if (this.currentPiece) {
                document.getElementById('debug-current-piece').textContent =
                    this.getPieceType(this.currentPiece.shape);
                document.getElementById('debug-position').textContent =
                    `${this.currentPiece.x}, ${this.currentPiece.y}`;
                
                // 碰撞检测预览
                const collisionX = this.currentPiece.x;
                const collisionY = this.currentPiece.y + 1;
                const hasCollision = this.checkCollision(collisionX, collisionY, this.currentPiece.shape);
                document.getElementById('debug-collision').textContent =
                    hasCollision ? '即将碰撞' : '无碰撞';
            }
            
            document.getElementById('debug-game-state').textContent =
                this.gameOver ? '游戏结束' : (this.isPaused ? '暂停' : '运行中');
            
            // 帧率计算
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - lastTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                document.getElementById('debug-fps').textContent = fps;
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(updateDebugInfo);
        };
        
        updateDebugInfo();
    }
    
    getPieceType(shape) {
        const types = ['', 'I', 'J', 'L', 'O', 'S', 'T', 'Z'];
        for (let i = 1; i < this.pieces.length; i++) {
            if (JSON.stringify(shape) === JSON.stringify(this.pieces[i])) {
                return types[i];
            }
        }
        return '未知';
    }
    
    // 添加调试快捷键
    setupDebugControls() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'D')) {
                e.preventDefault();
                const debugPanel = document.getElementById('debug-panel');
                const isVisible = debugPanel.style.display !== 'none';
                debugPanel.style.display = isVisible ? 'none' : 'block';
                document.getElementById('debug-toggle').textContent = isVisible ? '显示调试' : '隐藏调试';
            }
        });
    }
}

// 初始化游戏
const tetris = new Tetris();