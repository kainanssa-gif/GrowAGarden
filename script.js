// --- CONFIGURAÇÕES BÁSICAS E DADOS ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 40;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ADMIN_CODE = "admin123";
const PLAYER_SIZE = 25;
const GARDEN_WIDTH = 4;
const GARDEN_HEIGHT = 4;

// Mapa 10x10 (0:Grama, 1:Parede, 2:Entrada Jardim, 3:Vendedor, 4:Loja Semente, 5:Loja Gear, 6:Loja Ovos)
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 5, 6, 1, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 3, 0, 0, 0, 0, 0, 1], 
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const PETS = { none: { name: 'Nenhum', bonus: 1.0 }, bunny: { name: 'Coelho', bonus: 1.1, color: 'white' }, fox: { name: 'Raposa', bonus: 1.25, color: 'orange' }, dragon: { name: 'Dragão', bonus: 1.5, color: 'purple' } };
const EGGS = { commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', pets: ['bunny'], chance: [1.0] }, rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', pets: ['bunny', 'fox'], chance: [0.7, 0.3] } };
const GEAR = { basicSprinkler: { name: 'Sprinkler Básico', cost: 500, chance: 0.3, description: "30% chance de mutação" }, proSprinkler: { name: 'Sprinkler Pro', cost: 2000, chance: 0.6, description: "60% chance de mutação" } };

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
    // MUDANÇA AQUI: Inicia no jardim
    currentScene: 'garden', 
    player: { 
        // MUDANÇA AQUI: Posição inicial no centro do jardim (400px/2 = 200px)
        x: CANVAS_WIDTH / 2 - PLAYER_SIZE / 2, 
        y: CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2, 
        speed: 4, dx: 0, dy: 0, lastMove: 0, animationFrame: 0 
    }
};

for (let y = 0; y < GARDEN_HEIGHT; y++) {
    for (let x = 0; x < GARDEN_WIDTH; x++) {
        gameData.plots.push({
            gridX: x, 
            gridY: y,
            isPlanted: false,
            seedType: null,
            growthStart: 0,
            growthStage: 0,
            isMutated: false
        });
    }
}

// --- REFERÊNCIAS AO DOM ---
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
const adminPanel = document.getElementById('adminPanel');
const adminCommandInput = document.getElementById('adminCommandInput');
const runCommandButton = document.getElementById('runCommandButton');
const adminOutput = document.getElementById('adminOutput');

// --- JOYSTICK E MOVIMENTO ---
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
    // MUDANÇA AQUI: Joystick ativo em qualquer cena de movimento
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
        // Colisão com as bordas do canvas (400x400)
        return x < 0 || y < 0 || x + PLAYER_SIZE > CANVAS_WIDTH || y + PLAYER_SIZE > CANVAS_HEIGHT;
    }
    
    // Lógica de Colisão do Mapa
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
    // MUDANÇA AQUI: Permite movimento no mapa E no jardim
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
        
        // Lógica de colisão unificada
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
    
    ctx.fillStyle = frame === 0 ? '#404040' : '#808080';
    ctx.fillRect(x, y + PLAYER_SIZE - 5, PLAYER_SIZE, 5); 
}

// --- DESENHO DE CENA ---

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
    drawText('EQUIP.', 2 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black', 10);
    drawText('OVOS', 3 * TILE_SIZE + TILE_SIZE / 2, 1 * TILE_SIZE + 20, 'black', 10);
    drawText('VENDEDOR', 3 * TILE_SIZE + TILE_SIZE / 2, 7 * TILE_SIZE + 20, 'red', 10);

    // O jogador só é desenhado no mapa se a cena for 'map'
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#9c6b4d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    const PLOT_SIZE = TILE_SIZE * 0.9;
    
    gameData.plots.forEach(plot => {
        const x = plot.gridX * TILE_SIZE + (TILE_SIZE - PLOT_SIZE) / 2;
        const y = plot.gridY * TILE_SIZE + (TILE_SIZE - PLOT_SIZE) / 2;
        const cx = x + PLOT_SIZE / 2;
        const cy = y + PLOT_SIZE / 2;
        
        ctx.fillStyle = '#805030';
        ctx.fillRect(x, y, PLOT_SIZE, PLOT_SIZE);

        if (plot.isPlanted) {
            const seed = gameData.seeds[plot.seedType];
            let color = seed.color;
            let size = PLOT_SIZE * (plot.growthStage * 0.15 + 0.1); 
            
            if (plot.isMutated) {
                color = '#00ff00';
            }

            ctx.fillStyle = color;
            ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
            
            if (plot.growthStage === 3) {
                 ctx.fillStyle = plot.isMutated ? 'yellow' : 'lime';
                 drawText(plot.isMutated ? 'M' : 'P', cx, cy + 10, ctx.fillStyle, 16);
            }
        }
    });

    // MUDANÇA AQUI: Desenha o player no jardim
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// --- LÓGICA DE JOGO (Mantida igual) ---
function updateStats() {
    moneySpan.textContent = gameData.money.toFixed(2);
    const totalSprinklers = gameData.inventory.basicSprinkler + gameData.inventory.proSprinkler;
    sprinklerCountSpan.textContent = totalSprinklers;
    petNameSpan.textContent = gameData.pet.name;
    petBonusSpan.textContent = `x${gameData.pet.bonus.toFixed(2)}`;

    const canHarvest = gameData.plots.some(p => p.isPlanted && p.growthStage === 3);
    harvestAllButton.disabled = !canHarvest;
    
    const canWater = totalSprinklers > 0 && gameData.plots.some(p => p.isPlanted && p.growthStage > 0 && p.growthStage < 3 && !p.isMutated);
    waterButton.disabled = !canWater;
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
    return false;
}

function harvestPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (plot.isPlanted && plot.growthStage === 3) {
        const seed = gameData.seeds[plot.seedType];
        let value = seed.sellValue * (plot.isMutated ? 2 : 1) * gameData.pet.bonus;
        gameData.money += value;
        
        if (seed.type === 'single') {
            plot.isPlanted = false;
            plot.seedType = null;
        } else {
            plot.growthStart = Date.now();
            plot.growthStage = 0;
            plot.isMutated = false;
        }
        
        updateStats();
        return true;
    }
    return false;
}

function runIdleLogic() {
    gameData.plots.forEach(plot => {
        if (plot.isPlanted && plot.growthStage < 3) {
            const seed = gameData.seeds[plot.seedType];
            const totalTime = seed.growTime * 1000;
            const elapsedTime = Date.now() - plot.growthStart;
            
            const stageTime = totalTime / 3;
            let newStage = Math.floor(elapsedTime / stageTime);

            if (newStage > plot.growthStage) {
                plot.growthStage = Math.min(3, newStage);
            }
        }
    });
}

// --- LÓGICA DE CENA E INTERAÇÃO ---

function changeScene(scene) {
    gameData.currentScene = scene;
    if (scene === 'map') {
        sceneChanger.style.display = 'none';
        joystickContainer.style.display = 'flex';
        harvestAllButton.style.display = 'none';
        waterButton.style.display = 'none';
        adminButtonMap.style.display = 'inline-block';
        if (adminPanel.style.display === 'block') adminPanel.style.display = 'none';

        // MUDANÇA AQUI: Seta a posição do player para a entrada do mapa (para começar a andar)
        gameData.player.x = 1 * TILE_SIZE; 
        gameData.player.y = 8 * TILE_SIZE; 

    } else { // Jardim
        // MUDANÇA AQUI: Garante que o botão de saída apareça corretamente
        sceneChanger.textContent = 'Sair do Jardim';
        sceneChanger.onclick = () => {
            changeScene('map');
        };
        sceneChanger.style.display = 'block';
        joystickContainer.style.display = 'flex'; // Mantém o joystick ativo no jardim
        harvestAllButton.style.display = 'inline-block';
        waterButton.style.display = 'inline-block';
        adminButtonMap.style.display = 'none';
        
        // Reposiciona o player no centro do jardim ao entrar
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

// --- MODAL E FUNÇÕES DE LOJA (Mantidas iguais) ---
function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalContent.innerHTML = contentHTML;
    shopInteractionModal.style.display = 'block';
    updateStats(); 
}

function openSellerModal() {
    const canSell = gameData.plots.some(p => p.isPlanted && p.growthStage === 3);
    
    let html = canSell 
        ? `<p>Você pode colher todas as plantas prontas imediatamente.</p>
           <button class="buy-button" style="background-color: #f44336 !important;" onclick="harvestAllButton.click(); closeModalButton.click();">Colher e Vender Tudo</button>`
        : '<p>Você não tem plantas prontas para colheita/venda.</p>';
        
    openModal("Vendedor de Colheitas", html);
}

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

function openSeedShopModal() { openModal("Loja de Sementes", renderSeedShop()); }
function buySeed(seedKey) {
    const seed = gameData.seeds[seedKey];
    if (gameData.money >= seed.cost && seed.currentStock > 0) {
        gameData.money -= seed.cost;
        seed.currentStock -= 1;
        seed.count += 1;
        modalContent.innerHTML = renderSeedShop(); 
    }
    updateStats();
}

function renderGearShop() {
    let html = '';
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const disabled = gameData.money < gearItem.cost;
        html += `<div class="shop-item">
            <span><strong>${gearItem.name}</strong> (${gearItem.cost}¢) | Seu: ${gameData.inventory[key]}<br><small>${gearItem.description}</small></span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyGear('${key}')">Comprar</button>
        </div>`;
    });
    return html;
}
function openGearShopModal() { openModal("Loja de Equipamentos", renderGearShop()); }
function buyGear(gearKey) {
    const gearItem = GEAR[gearKey];
    if (gameData.money >= gearItem.cost) {
        gameData.money -= gearItem.cost;
        gameData.inventory[gearKey] += 1;
        modalContent.innerHTML = renderGearShop();
    }
    updateStats();
}

function hatchEgg(eggKey) {
    const egg = EGGS[eggKey];
    const rand = Math.random();
    let cumulativeChance = 0;
    
    for (let i = 0; i < egg.pets.length; i++) {
        cumulativeChance += egg.chance[i];
        if (rand <= cumulativeChance) {
            const petKey = egg.pets[i];
            const newPet = PETS[petKey];
            gameData.pet = newPet;
            alert(`Parabéns! Você chocou um(a) ${newPet.name}!\nBônus de Venda: x${newPet.bonus.toFixed(2)}`);
            return;
        }
    }
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
function openEggShopModal() { openModal("Loja de Ovos (Pets)", renderEggShop()); }
function buyAndHatchEgg(eggKey) {
    const egg = EGGS[eggKey];
    if (gameData.money >= egg.cost) {
        gameData.money -= egg.cost;
        hatchEgg(eggKey); 
        modalContent.innerHTML = renderEggShop();
    }
    updateStats();
}

// --- ADMIN E LISTENERS ---

function executeAdminCommand(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const command = parts[0].toLowerCase().replace('/', '');
    const value1 = parts[1];
    const value2 = parts.length > 2 ? parts.slice(2).join(' ') : null;
    let output = '';

    // CORREÇÃO AQUI: Lógica do Admin
    if (command === 'give' && value1 === 'money' && !isNaN(parseInt(value2))) {
        gameData.money += parseInt(value2);
        output = `Adicionado ${parseInt(value2)} Sheckles.`;
    } else if (command === 'set' && value1 === 'seed' && gameData.seeds[value2]) {
        gameData.seeds[value2].count += 10;
        output = `Adicionado 10x ${gameData.seeds[value2].name}.`;
    } else if (command === 'max' && value1 === 'all') {
        gameData.money = 999999;
        output = "Tudo maximizado.";
    } else {
        output = `Comando Admin desconhecido ou inválido. Tente: /give money 1000`;
    }
    adminOutput.textContent = output;
    updateStats();
}


closeModalButton.addEventListener('click', () => { shopInteractionModal.style.display = 'none'; });

waterButton.addEventListener('click', () => { /* ... (Lógica de Sprinkler) ... */ });

harvestAllButton.addEventListener('click', () => {
    let harvestedCount = 0;
    gameData.plots.forEach((plot, index) => {
        if (harvestPlot(index)) {
            harvestedCount++;
        }
    });
    if (harvestedCount > 0) {
        alert(`Você colheu ${harvestedCount} plantas!`);
    }
});

canvas.addEventListener('click', (e) => {
    if (gameData.currentScene !== 'garden') return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const gridX = Math.floor(x / TILE_SIZE);
    const gridY = Math.floor(y / TILE_SIZE);

    const plotIndex = gameData.plots.findIndex(p => p.gridX === gridX && p.gridY === gridY);
    
    if (plotIndex !== -1) {
        const plot = gameData.plots[plotIndex];
        
        if (plot.isPlanted && plot.growthStage === 3) {
            harvestPlot(plotIndex);
        } else if (!plot.isPlanted) {
            let message = "Plantar (1 - Cenoura, 2 - Abóbora, 3 - Morango):\n";
            const choice = prompt(message);
            
            if (choice === '1') plantSeed('carrot', plotIndex);
            else if (choice === '2') plantSeed('pumpkin', plotIndex);
            else if (choice === '3') plantSeed('strawberry', plotIndex);
            else alert("Seleção inválida.");
        } else {
            alert(`Planta em crescimento! Estágio: ${plot.growthStage}/3.`);
        }
    }
});

adminButtonMap.addEventListener('click', () => {
    adminPanel.style.display = (adminPanel.style.display === 'none') ? 'block' : 'none';
});

runCommandButton.addEventListener('click', () => {
    executeAdminCommand(adminCommandInput.value);
    adminCommandInput.value = '';
});

// --- LOOP PRINCIPAL ---

function gameLoop() {
    if (gameData.currentScene === 'map') {
        handlePlayerMovement();
        drawMap();
    } else {
        handlePlayerMovement(); // Permite mover no jardim
        runIdleLogic();
        drawGarden();
    }
    requestAnimationFrame(gameLoop);
}

// INICIALIZAÇÃO: Começa no jardim.
window.onload = function() {
    // Não precisa chamar changeScene('map') - o gameData já começa em 'garden'
    changeScene('garden'); 
    setupJoystick();
    updateStats();
    gameLoop();
                }
