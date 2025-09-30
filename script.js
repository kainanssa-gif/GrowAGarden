// --- 1. CONFIGURAÇÕES E DADOS GLOBAIS ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 40;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const PLAYER_SIZE = 25;
const GARDEN_WIDTH = 4;
const GARDEN_HEIGHT = 4;

// Mapa 10x10 (1:Parede, 2:Entrada Jardim, 3:Vendedor, 4:Loja Semente, 5:Loja Gear, 6:Loja Ovos, 0:Grama)
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 5, 6, 0, 0, 0, 0, 0, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 1], 
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const PETS = { none: { name: 'Nenhum', bonus: 1.0 }, bunny: { name: 'Coelho', bonus: 1.1 }, fox: { name: 'Raposa', bonus: 1.25 } };
const EGGS = { commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', pets: ['bunny'], chance: [1.0] }, rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', pets: ['bunny', 'fox'], chance: [0.7, 0.3] } };
const GEAR = { basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto" }, proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto" } };


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
    currentScene: 'garden', 
    player: { 
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, 
        y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2, 
        speed: 4, dx: 0, dy: 0, lastMove: 0, animationFrame: 0 
    }
};

for (let y = 0; y < GARDEN_HEIGHT; y++) {
    for (let x = 0; x < GARDEN_WIDTH; x++) {
        gameData.plots.push({
            gridX: x, gridY: y, isPlanted: false, seedType: null, growthStart: 0, growthStage: 0, isMutated: false
        });
    }
}

// --- 2. REFERÊNCIAS DO DOM ---
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
const closeModalButton = document.getElementById('closeModalButton');
const adminPanel = document.getElementById('adminPanel');
const adminCommandInput = document.getElementById('adminCommandInput');
const runCommandButton = document.getElementById('runCommandButton');
const adminOutput = document.getElementById('adminOutput');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');


// --- 3. LÓGICA DE MOVIMENTO E JOYSTICK ---
const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

let joystickActive = false;
let joystickCenter = { x: 0, y: 0 };
let joystickRadius = 50; 

function setupJoystick() {
    const rect = joystickContainer.getBoundingClientRect();
    joystickCenter.x = rect.left + joystickRadius;
    joystickCenter.y = rect.top + joystickRadius;
}

function handleTouchStart(e) {
    if (gameData.currentScene !== 'map' && gameData.currentScene !== 'garden') return;
    e.preventDefault();
    setupJoystick();
    joystickActive = true;
    handleTouchMove(e);
}

function handleTouchMove(e) {
    if (!joystickActive) return;
    
    const touch = e.touches[0];
    let dx = touch.clientX - joystickCenter.x;
    let dy = touch.clientY - joystickCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > joystickRadius) {
        dx *= joystickRadius / distance;
        dy *= joystickRadius / distance;
    }

    joystick.style.transform = `translate(${dx}px, ${dy}px)`;
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


function checkCollision(x, y) {
    if (gameData.currentScene === 'garden') {
        return x < 0 || y < 0 || x + PLAYER_SIZE > CANVAS_WIDTH || y + PLAYER_SIZE > CANVAS_HEIGHT;
    }
    
    const pX1 = Math.floor(x / TILE_SIZE);
    const pY1 = Math.floor(y / TILE_SIZE);
    const pX2 = Math.floor((x + PLAYER_SIZE - 1) / TILE_SIZE);
    const pY2 = Math.floor((y + PLAYER_SIZE - 1) / TILE_SIZE);

    const checkTile = (tx, ty) => {
        if (tx < 0 || ty < 0 || ty >= GAME_MAP.length || tx >= GAME_MAP[0].length) return true;
        return GAME_MAP[ty][tx] === 1; 
    };
    
    return checkTile(pX1, pY1) || checkTile(pX2, pY1) || checkTile(pX1, pY2) || checkTile(pX2, pY2);
}

function handlePlayerMovement() {
    if (gameData.currentScene !== 'map' && gameData.currentScene !== 'garden') return;

    if (!joystickActive) {
        gameData.player.dx = 0;
        gameData.player.dy = 0;
        if (keys['ArrowUp'] || keys['w']) gameData.player.dy = -gameData.player.speed;
        if (keys['ArrowDown'] || keys['s']) gameData.player.dy = gameData.player.speed;
        if (keys['ArrowLeft'] || keys['a']) gameData.player.dx = -gameData.player.speed;
        if (keys['ArrowRight'] || keys['d']) gameData.player.dx = gameData.player.speed;
    }
    
    if (gameData.player.dx !== 0 || gameData.player.dy !== 0) {
        if (Date.now() - gameData.player.lastMove > 150) { 
            gameData.player.animationFrame = (gameData.player.animationFrame === 0) ? 1 : 0;
            gameData.player.lastMove = Date.now();
        }

        const nextX = gameData.player.x + gameData.player.dx;
        const nextY = gameData.player.y + gameData.player.dy;
        
        if (!checkCollision(nextX, gameData.player.y)) {
            gameData.player.x = nextX;
        }
        if (!checkCollision(gameData.player.x, nextY)) {
            gameData.player.y = nextY;
        }

    } else {
        gameData.player.animationFrame = 0; 
    }
    
    if (gameData.currentScene === 'map') {
        checkMapInteractions();
    }
}

function drawPlayer(x, y, frame) {
    ctx.fillStyle = '#606060'; 
    ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
}

// --- 4. LÓGICA DE CENA E DESENHO ---

function drawMap() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let y = 0; y < GAME_MAP.length; y++) {
        for (let x = 0; x < GAME_MAP[y].length; x++) {
            const tile = GAME_MAP[y][x];
            let color = '#4CAF50'; 
            if (tile === 1) color = '#795548'; 
            if (tile === 2) color = '#f0f0f0'; 
            if (tile === 3) color = '#ffeb3b'; 
            if (tile === 4) color = '#c3f5d6'; 
            if (tile === 5) color = '#a6ebff'; 
            if (tile === 6) color = '#ffb3e6'; 
            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    drawText('JARDIM', 1 * TILE_SIZE + TILE_SIZE / 2, 8 * TILE_SIZE + 20, 'black', 12);
    drawText('SEMENTES', 1 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black', 10);
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#9c6b4d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    gameData.plots.forEach(plot => {
        const x = plot.gridX * TILE_SIZE;
        const y = plot.gridY * TILE_SIZE;
        ctx.fillStyle = '#805030';
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        
        if (plot.isPlanted) {
            ctx.fillStyle = gameData.seeds[plot.seedType].color;
            let size = TILE_SIZE * (plot.growthStage * 0.2 + 0.1); 
            ctx.fillRect(x + TILE_SIZE/2 - size/2, y + TILE_SIZE/2 - size/2, size, size);
        }
    });

    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function changeScene(scene) {
    gameData.currentScene = scene;
    if (scene === 'map') {
        sceneChanger.style.display = 'none';
        harvestAllButton.style.display = 'none';
        waterButton.style.display = 'none';
        adminButtonMap.style.display = 'inline-block';
        
        gameData.player.x = 1 * TILE_SIZE; 
        gameData.player.y = 8 * TILE_SIZE; 

    } else { 
        sceneChanger.textContent = 'Sair do Jardim';
        sceneChanger.onclick = () => {
            changeScene('map');
        };
        sceneChanger.style.display = 'block'; 
        harvestAllButton.style.display = 'inline-block';
        waterButton.style.display = 'inline-block';
        adminButtonMap.style.display = 'none';

        gameData.player.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
        gameData.player.y = CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2;
    }
}

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
        sceneChanger.onclick = () => openModal("Loja de Sementes", renderSeedShop());
        sceneChanger.style.display = 'block';
    } else if (tile === 5) { 
        sceneChanger.textContent = "Loja de Equipamentos";
        sceneChanger.onclick = () => openModal("Loja de Equipamentos", renderGearShop());
        sceneChanger.style.display = 'block';
    } else if (tile === 6) { 
        sceneChanger.textContent = "Loja de Ovos (Pets)";
        sceneChanger.onclick = () => openModal("Loja de Ovos (Pets)", renderEggShop());
        sceneChanger.style.display = 'block';
    }
}


// --- 5. ADMIN E FUNCIONALIDADES ---
function executeAdminCommand(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const command = parts[0].toLowerCase().replace('/', '');
    const value = parseInt(parts[2]) || 0;
    let output = '';

    if (command === 'give' && parts[1] === 'money' && value > 0) {
        gameData.money += value;
        output = `Adicionado ${value} Sheckles.`;
    } else if (command === 'max' && parts[1] === 'all') {
        gameData.money = 999999;
        output = "Tudo maximizado.";
    } else {
        output = `Comando Admin inválido. Tente: /give money 1000`;
    }
    adminOutput.textContent = output;
    updateStats();
}

function updateStats() {
    moneySpan.textContent = gameData.money.toFixed(2);
    sprinklerCountSpan.textContent = gameData.inventory.basicSprinkler + gameData.inventory.proSprinkler;
    petNameSpan.textContent = gameData.pet.name;
    petBonusSpan.textContent = `x${gameData.pet.bonus.toFixed(2)}`;
}

function plantSeed(seedType, plotIndex) {
    const seed = gameData.seeds[seedType];
    const plot = gameData.plots[plotIndex];

    if (gameData.money >= seed.cost && seed.count > 0 && !plot.isPlanted) {
        gameData.money -= seed.cost;
        seed.count -= 1; 
        
        plot.isPlanted = true;
        plot.seedType = seedType;
        plot.growthStart = Date.now();
        plot.growthStage = 0;
        plot.isMutated = false;
        
        updateStats();
        return true;
    }
    alert(`Erro ao plantar: Verifique se você tem dinheiro (${seed.cost}¢) e sementes (${seed.count})!`);
    return false;
}

// --- FUNÇÕES DE LOJA (COMPLETAS) ---

function renderSeedShop() {
    let html = '';
    Object.keys(gameData.seeds).forEach(key => {
        const seed = gameData.seeds[key];
        const disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        html += `<div class="shop-item">
            <span><strong>${seed.name}</strong> (${seed.cost}¢) | Estoque: ${seed.currentStock} | Seu: ${seed.count}</span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buySeed('${key}')">Comprar</button>
        </div>`;
    });
    return html;
}
function buySeed(seedKey) {
    const seed = gameData.seeds[seedKey];
    if (gameData.money >= seed.cost && seed.currentStock > 0) {
        gameData.money -= seed.cost;
        seed.currentStock -= 1;
        seed.count += 1;
        document.getElementById('modalContent').innerHTML = renderSeedShop(); 
    }
    updateStats();
}

function renderGearShop() {
    let html = '';
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const disabled = gameData.money < gearItem.cost;
        html += `<div class="shop-item">
            <span><strong>${gearItem.name}</strong> (${gearItem.cost}¢) | Seu: ${gameData.inventory[key] || 0}<br><small>${gearItem.description}</small></span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyGear('${key}')">Comprar</button>
        </div>`;
    });
    return html;
}
function buyGear(gearKey) {
    const gearItem = GEAR[gearKey];
    if (gameData.money >= gearItem.cost) {
        gameData.money -= gearItem.cost;
        gameData.inventory[gearKey] = (gameData.inventory[gearKey] || 0) + 1;
        document.getElementById('modalContent').innerHTML = renderGearShop();
    }
    updateStats();
}


function renderEggShop() {
    let html = '';
    Object.keys(EGGS).forEach(key => {
        const eggItem = EGGS[key];
        const disabled = gameData.money < eggItem.cost;
        html += `<div class="shop-item">
            <span><strong>${eggItem.name}</strong> (${eggItem.cost}¢)</span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyAndHatchEgg('${key}')">Comprar & Chocar</button>
        </div>`;
    });
    return html;
}
function buyAndHatchEgg(eggKey) {
    const egg = EGGS[eggKey];
    if (gameData.money >= egg.cost) {
        gameData.money -= egg.cost;
        gameData.pet = PETS[egg.pets[0]]; 
        alert(`Parabéns! Você chocou um(a) ${gameData.pet.name}!`);
        document.getElementById('modalContent').innerHTML = renderEggShop();
    }
    updateStats();
}

function openSellerModal() {
    let html = '<p>Vendedor de Colheitas. Implemente a lógica de venda aqui!</p>';
    openModal("Vendedor de Colheitas", html);
}
function openModal(title, contentHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = contentHTML;
    document.getElementById('shopInteractionModal').style.display = 'block';
    updateStats(); 
}

// --- 6. LISTENERS ---
closeModalButton.addEventListener('click', () => { shopInteractionModal.style.display = 'none'; });
adminButtonMap.addEventListener('click', () => { adminPanel.style.display = (adminPanel.style.display === 'none') ? 'block' : 'none'; });
runCommandButton.addEventListener('click', () => {
    executeAdminCommand(adminCommandInput.value);
    adminCommandInput.value = '';
});

canvas.addEventListener('click', (e) => {
    if (gameData.currentScene !== 'garden') return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.floor(x / TILE_SIZE);
    const gridY = Math.floor(y / TILE_SIZE);

    const plotIndex = gameData.plots.findIndex(p => p.gridX === gridX && p.gridY === gridY);
    
    if (plotIndex !== -1 && !gameData.plots[plotIndex].isPlanted) {
        let choice = prompt("Plantar (1 - Cenoura, 2 - Abóbora, 3 - Morango):\n");
        
        if (choice === '1') plantSeed('carrot', plotIndex);
        else if (choice === '2') plantSeed('pumpkin', plotIndex);
        else if (choice === '3') plantSeed('strawberry', plotIndex);
        else alert("Seleção inválida.");
    }
});

// --- 7. LOOP PRINCIPAL ---

function gameLoop() {
    handlePlayerMovement();
    if (gameData.currentScene === 'map') {
        drawMap();
    } else {
        drawGarden();
    }
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    setupJoystick();
    changeScene('garden'); 
    updateStats();
    gameLoop();
             }
