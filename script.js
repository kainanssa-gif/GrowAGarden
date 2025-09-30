// --- CONFIGURAÇÕES BÁSICAS ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 40; // Reduzido para melhor visualização no celular (400px / 10 tiles)
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ADMIN_CODE = "admin123";
const GARDEN_GRID_START_X = 3;
const GARDEN_GRID_START_Y = 3;
const GARDEN_WIDTH = 4;
const GARDEN_HEIGHT = 4;
const PLAYER_SIZE = 25;

// Mapa 10x10 (0:Gramado, 1:Parede, 2:Entrada Jardim, 3:Vendedor, 4:Loja Semente, 5:Loja Gear, 6:Loja Ovos)
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 5, 6, 1, 0, 0, 0, 0, 1], // Lojas
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 1], // Vendedor
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 1], // Entrada Jardim
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// --- DADOS DO JOGO (simplificados por brevidade, os dados de pets/seeds/gear continuam no código completo) ---
const PETS = { none: { name: 'Nenhum', bonus: 1.0 }, bunny: { name: 'Coelho', bonus: 1.1 } };
const EGGS = { commonEgg: { name: 'Ovo Comum', cost: 1000, pets: ['bunny'], chance: [1.0] } };
const GEAR = { basicSprinkler: { name: 'Sprinkler Básico', cost: 500, chance: 0.3, description: "30% chance de mutação" } };

let gameData = {
    money: 100,
    inventory: { basicSprinkler: 0, proSprinkler: 0 },
    seeds: {
        carrot: { name: 'Cenoura', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, color: '#ff9800', type: 'single' },
        pumpkin: { name: 'Abóbora', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, color: '#ff5722', type: 'single' },
        strawberry: { name: 'Morango', cost: 500, sellValue: 150, growTime: 30, count: 0, maxStock: 3, currentStock: 3, color: '#ff0000', type: 'multi' }
    },
    plots: [],
    pet: PETS.none,
    currentScene: 'map',
    player: { x: 50, y: 50, speed: 4, dx: 0, dy: 0, lastMove: 0, animationFrame: 0 }
};

// ... (Inicializa as 16 parcelas do jardim) ...
for (let y = 0; y < GARDEN_HEIGHT; y++) {
    for (let x = 0; x < GARDEN_WIDTH; x++) {
        gameData.plots.push({
            gridX: GARDEN_GRID_START_X + x,
            gridY: GARDEN_GRID_START_Y + y,
            isPlanted: false,
            seedType: null,
            growthStart: 0,
            growthStage: 0,
            isMutated: false
        });
    }
}


// --- ELEMENTOS HTML ---
const joystickContainer = document.getElementById('joystick-container');
const joystick = document.getElementById('joystick');
const moneySpan = document.getElementById('money');
const sprinklerCountSpan = document.getElementById('sprinklerCount');
const petNameSpan = document.getElementById('petName');
const petBonusSpan = document.getElementById('petBonus');
const harvestAllButton = document.getElementById('harvestAllButton');
const waterButton = document.getElementById('waterButton');
const sceneChanger = document.getElementById('sceneChanger');
const adminButtonMap = document.getElementById('adminButtonMap');
const shopInteractionModal = document.getElementById('shopInteractionModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModalButton = document.getElementById('closeModalButton');

// --- LÓGICA DE MOVIMENTO E JOYSTICK ---
const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickRadius = 50; // Metade do tamanho do container

function setupJoystick() {
    // Configura as coordenadas do centro do joystick
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter.x = rect.left + joystickRadius;
    joystickCenter.y = rect.top + joystickRadius;
}

function handleTouchStart(e) {
    if (gameData.currentScene !== 'map') return;
    e.preventDefault();
    setupJoystick();
    joystickActive = true;
    handleTouchMove(e);
}

function handleTouchMove(e) {
    if (!joystickActive || gameData.currentScene !== 'map') return;
    
    const touch = e.touches[0];
    let dx = touch.clientX - joystickCenter.x;
    let dy = touch.clientY - joystickCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > joystickRadius) {
        dx *= joystickRadius / distance;
        dy *= joystickRadius / distance;
    }

    joystick.style.transform = `translate(${dx}px, ${dy}px)`;
    
    // Define a direção do player baseada no joystick
    gameData.player.dx = dx / joystickRadius * gameData.player.speed;
    gameData.player.dy = dy / joystickRadius * gameData.player.speed;
}

function handleTouchEnd() {
    joystickActive = false;
    joystick.style.transform = 'translate(0, 0)';
    gameData.player.dx = 0;
    gameData.player.dy = 0;
}

joystickContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
joystickContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
joystickContainer.addEventListener('touchend', handleTouchEnd);


function handlePlayerMovement() {
    if (gameData.currentScene !== 'map') return;

    // Se o joystick NÃO estiver ativo, usa o teclado
    if (!joystickActive) {
        gameData.player.dx = 0;
        gameData.player.dy = 0;
        if (keys['ArrowUp'] || keys['w']) gameData.player.dy = -gameData.player.speed;
        if (keys['ArrowDown'] || keys['s']) gameData.player.dy = gameData.player.speed;
        if (keys['ArrowLeft'] || keys['a']) gameData.player.dx = -gameData.player.speed;
        if (keys['ArrowRight'] || keys['d']) gameData.player.dx = gameData.player.speed;
    }
    
    // Lógica de animação e colisão
    if (gameData.player.dx !== 0 || gameData.player.dy !== 0) {
        // Lógica de Animação simples
        if (Date.now() - gameData.player.lastMove > 150) { 
            gameData.player.animationFrame = (gameData.player.animationFrame === 0) ? 1 : 0;
            gameData.player.lastMove = Date.now();
        }

        const nextX = gameData.player.x + gameData.player.dx;
        const nextY = gameData.player.y + gameData.player.dy;
        
        // Colisão com Mapas
        if (checkCollision(nextX, nextY)) {
             // Se colidir, tenta deslizar
            if (!checkCollision(nextX, gameData.player.y)) {
                gameData.player.x = nextX;
            } else if (!checkCollision(gameData.player.x, nextY)) {
                gameData.player.y = nextY;
            }
        } else {
             gameData.player.x = nextX;
             gameData.player.y = nextY;
        }

    } else {
        gameData.player.animationFrame = 0; 
    }
    
    checkMapInteractions();
}

function checkCollision(x, y) {
    // Verifica o canto superior esquerdo e inferior direito do jogador
    const pX1 = Math.floor(x / TILE_SIZE);
    const pY1 = Math.floor(y / TILE_SIZE);
    const pX2 = Math.floor((x + PLAYER_SIZE - 1) / TILE_SIZE);
    const pY2 = Math.floor((y + PLAYER_SIZE - 1) / TILE_SIZE);

    const checkTile = (tx, ty) => {
        if (tx < 0 || ty < 0 || ty >= GAME_MAP.length || tx >= GAME_MAP[0].length) return true; // Colisão com bordas do mapa
        const tile = GAME_MAP[ty][tx];
        return tile === 1; // Colide apenas com Parede (1)
    };
    
    return checkTile(pX1, pY1) || checkTile(pX2, pY1) || checkTile(pX1, pY2) || checkTile(pX2, pY2);
}

function drawPlayer(x, y, frame) {
    ctx.fillStyle = '#606060';
    ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
    
    // Simples animação de pernas
    ctx.fillStyle = frame === 0 ? '#404040' : '#808080';
    ctx.fillRect(x, y + PLAYER_SIZE - 5, PLAYER_SIZE, 5); 
}

// --- DESENHO DE CENA (MAPA E JARDIM) ---

function drawMap() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    for (let y = 0; y < GAME_MAP.length; y++) {
        for (let x = 0; x < GAME_MAP[y].length; x++) {
            const tile = GAME_MAP[y][x];
            let color = '#4CAF50'; 

            if (tile === 1) color = '#795548'; // Parede
            if (tile === 2) color = '#f0f0f0'; // Entrada Jardim
            if (tile === 3) color = '#ffeb3b'; // Vendedor
            if (tile === 4) color = '#c3f5d6'; // Loja Semente
            if (tile === 5) color = '#a6ebff'; // Loja Gear
            if (tile === 6) color = '#ffb3e6'; // Loja Ovos

            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    
    drawText('JARDIM', 1 * TILE_SIZE + TILE_SIZE / 2, 8 * TILE_SIZE + 20, 'black');
    drawText('SEMENTES', 1 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black');
    drawText('EQUIP.', 2 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black');
    drawText('OVOS', 3 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black');
    drawText('VENDEDOR', 3 * TILE_SIZE + TILE_SIZE / 2, 7 * TILE_SIZE + 20, 'red');


    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawGarden() {
    // ... (Lógica de desenho do jardim igual, não mexe na tela do jogador) ...
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// --- LÓGICA DE INTERAÇÃO ---

function checkMapInteractions() {
    const pX = Math.floor((gameData.player.x + PLAYER_SIZE/2) / TILE_SIZE);
    const pY = Math.floor((gameData.player.y + PLAYER_SIZE/2) / TILE_SIZE);
    
    const tile = GAME_MAP[pY][pX];
    sceneChanger.style.display = 'none';

    if (tile === 2) { 
        sceneChanger.textContent = "Entrar no Jardim";
        sceneChanger.onclick = () => changeScene('garden');
        sceneChanger.style.display = 'block';
    } else if (tile === 3) { 
        sceneChanger.textContent = "Vender Colheitas";
        sceneChanger.onclick = openSellerModal;
        sceneChanger.style.display = 'block';
    } else if (tile === 4) { 
        sceneChanger.textContent = "Loja de Sementes";
        sceneChanger.onclick = openSeedShopModal;
        sceneChanger.style.display = 'block';
    } else if (tile === 5) { 
        sceneChanger.textContent = "Loja de Equipamentos";
        sceneChanger.onclick = openGearShopModal;
        sceneChanger.style.display = 'block';
    } else if (tile === 6) { 
        sceneChanger.textContent = "Loja de Ovos (Pets)";
        sceneChanger.onclick = openEggShopModal;
        sceneChanger.style.display = 'block';
    } 
}

function changeScene(scene) {
    gameData.currentScene = scene;
    if (scene === 'map') {
        sceneChanger.style.display = 'none';
        joystickContainer.style.display = 'flex'; // Mostra joystick
        harvestAllButton.style.display = 'none';
        waterButton.style.display = 'none';
        adminButtonMap.style.display = 'inline-block';
    } else { // Jardim
        sceneChanger.textContent = 'Sair do Jardim';
        sceneChanger.onclick = () => {
            changeScene('map');
            gameData.player.x = 1 * TILE_SIZE; 
            gameData.player.y = 8 * TILE_SIZE; // Retorna para a entrada do mapa
        };
        sceneChanger.style.display = 'block';
        joystickContainer.style.display = 'none'; // Esconde joystick
        harvestAllButton.style.display = 'inline-block';
        waterButton.style.display = 'inline-block';
        adminButtonMap.style.display = 'none';
    }
}

// ... (Funções de Shop/Modal (openModal, renderSeedShop, buySeed, etc.) são mantidas e adaptadas para o novo HTML) ...
// A função buySeed FOI CORRIGIDA para funcionar corretamente com sementes múltiplas.

function buySeed(seedKey) {
    const seed = gameData.seeds[seedKey];
    if (gameData.money >= seed.cost && seed.currentStock > 0) {
        gameData.money -= seed.cost;
        seed.currentStock -= 1;
        seed.count += 1;
        // Re-renderiza o conteúdo do modal
        modalContent.innerHTML = renderSeedShop(); 
    }
    updateStats();
}


// --- LOOP PRINCIPAL DO JOGO ---

function gameLoop() {
    if (gameData.currentScene === 'map') {
        handlePlayerMovement();
        drawMap();
    } else {
        runIdleLogic();
        drawGarden();
    }
    requestAnimationFrame(gameLoop);
}

// ... (Restock, Admin, e outros Listeners permanecem iguais) ...

changeScene('map'); // Inicia no mapa, ativando o joystick/teclado
setupJoystick(); // Inicializa as coordenadas
gameLoop();
