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

// CHAVE DE SALVAMENTO
const SAVE_KEY = "GrowAGardenSave"; 
const ADMIN_PASSWORD = "ArthurSigmaBoy123"; 
const RESTOCK_INTERVAL = 3 * 60 * 1000; // 3 minutos em milissegundos

let isMoving = false;
let keysPressed = {}; 
let lastRestockTime = Date.now(); 

// MAPA 10x10
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 0, 0, 0, 5, 0, 0, 6, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 2, 0, 0, 0, 3, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// --- PETS ATUALIZADOS COM HABILIDADES ESPECIAIS ---
const PETS = { 
    none: { name: 'Nenhum', bonus: 1.0, ability: 'none', color: '#606060', chance: 0 }, 
    bunny: { name: 'Coelho', bonus: 1.1, ability: 'harvest', color: '#f5f5dc', chance: 0.50 }, 
    fox: { name: 'Raposa', bonus: 1.25, ability: 'harvest', color: '#ff4500', chance: 0.30 },
    dragon: { name: 'Dragão', bonus: 1.5, ability: 'harvest', color: '#b22222', chance: 0.10 },
    goldenLab: { name: 'Lab. Dourado', bonus: 1.0, ability: 'mutation_boost', color: '#ffd700', chance: 0.08 },
    phoenix: { name: 'Fênix', bonus: 1.0, ability: 'water_time', color: '#ff4500', chance: 0.02 }
};

// --- EGGS ATUALIZADOS COM CHANCES DE PETS ---
const EGGS = { 
    commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', maxStock: 5, currentStock: 5, 
        pets: ['bunny', 'fox', 'dragon', 'goldenLab', 'phoenix'], 
        chance: [0.70, 0.20, 0.07, 0.02, 0.01], 
        restockChance: 1.0 
    }, 
    rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', maxStock: 3, currentStock: 3,
        pets: ['fox', 'dragon', 'goldenLab', 'phoenix'], 
        chance: [0.40, 0.30, 0.20, 0.10], 
        restockChance: 0.7 
    },
    legendaryEgg: { name: 'Ovo Lendário', cost: 25000, color: '#ffd700', maxStock: 1, currentStock: 1,
        pets: ['dragon', 'goldenLab', 'phoenix'], 
        chance: [0.35, 0.40, 0.25], 
        restockChance: 0.3 
    }
};

// --- GEAR ATUALIZADOS COM STOCK E CHANCES ---
const GEAR = { 
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto", maxStock: 5, currentStock: 5, restockChance: 1.0 }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto", maxStock: 2, currentStock: 2, restockChance: 0.5 },
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas", maxStock: 10, currentStock: 10, restockChance: 1.0 }
};

// --- SEMENTES ATUALIZADAS (Com STOCK e CHANCES DE RESTOCK) ---
const SEEDS_DATA = {
    // Comuns (Restock Garantido)
    carrot: { name: 'Cenoura Comum', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, color: '#ff9800', type: 'single', harvestColor: '#ff9800', rarity: 'common', restockChance: 1.0 },
    pumpkin: { name: 'Abóbora Comum', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, color: '#ff5722', type: 'single', harvestColor: '#ff5722', rarity: 'common', restockChance: 1.0 },
    
    // Raras (Chance de 80%)
    blueBerry: { name: 'Mirtilo Raro', cost: 400, sellValue: 800, growTime: 15, count: 0, maxStock: 4, currentStock: 4, color: '#4169e1', type: 'multi', harvestColor: '#4169e1', rarity: 'rare', restockChance: 0.8 },
    moonFlower: { name: 'Flor Lunar Rara', cost: 800, sellValue: 1800, growTime: 25, count: 0, maxStock: 2, currentStock: 2, color: '#e0ffff', type: 'single', harvestColor: '#e0ffff', rarity: 'rare', restockChance: 0.8 },
    
    // Épicas (Chance de 50%)
    goldenMelon: { name: 'Melancia Dourada', cost: 2000, sellValue: 5000, growTime: 40, count: 0, maxStock: 1, currentStock: 1, color: '#ffd700', type: 'single', harvestColor: '#ffd700', rarity: 'epic', restockChance: 0.5 },
    starFruit: { name: 'Carambola Estelar', cost: 1500, sellValue: 3500, growTime: 35, count: 0, maxStock: 1, currentStock: 1, color: '#fdfd96', type: 'multi', harvestColor: '#fdfd96', rarity: 'epic', restockChance: 0.5 },

    // Lendárias (Chance de 30%)
    shadowBloom: { name: 'Flor Sombra', cost: 5000, sellValue: 12000, growTime: 60, count: 0, maxStock: 1, currentStock: 1, color: '#301934', type: 'single', harvestColor: '#301934', rarity: 'legendary', restockChance: 0.3 },
    crystalGrape: { name: 'Uva de Cristal', cost: 7500, sellValue: 18000, growTime: 70, count: 0, maxStock: 1, currentStock: 1, color: '#e6e6fa', type: 'multi', harvestColor: '#e6e6fa', rarity: 'legendary', restockChance: 0.3 },

    // Míticas (Chance de 10%)
    solarMango: { name: 'Manga Solar', cost: 15000, sellValue: 35000, growTime: 90, count: 0, maxStock: 1, currentStock: 1, color: '#ff8c00', type: 'single', harvestColor: '#ff8c00', rarity: 'mythic', restockChance: 0.1 },
    voidApple: { name: 'Maçã do Vazio', cost: 20000, sellValue: 50000, growTime: 120, count: 0, maxStock: 1, currentStock: 1, color: '#000000', type: 'single', harvestColor: '#000000', rarity: 'mythic', restockChance: 0.1 },
    
    // Mítica Suprema (Chance de 5%)
    cosmicDust: { name: 'Poeira Cósmica', cost: 50000, sellValue: 150000, growTime: 180, count: 0, maxStock: 1, currentStock: 1, color: '#8a2be2', type: 'multi', harvestColor: '#8a2be2', rarity: 'supreme', restockChance: 0.05 },
};

// Dados iniciais
const INITIAL_DATA = {
    money: 100,
    inventory: { basicSprinkler: 0, proSprinkler: 0, wateringCan: 1 }, 
    harvestInventory: {},
    seeds: JSON.parse(JSON.stringify(SEEDS_DATA)), 
    plots: [],
    pet: PETS.none,
    currentScene: 'map', 
    player: { 
        x: 1 * TILE_SIZE, 
        y: 8 * TILE_SIZE, 
        speed: 4, dx: 0, dy: 0, lastMove: 0, animationFrame: 0, color: '#606060' 
    }
};

// Inicialização dos plots
for (let y = 0; y < GARDEN_HEIGHT; y++) {
    for (let x = 0; x < GARDEN_WIDTH; x++) {
        INITIAL_DATA.plots.push({
            gridX: x, gridY: y, isPlanted: false, seedType: null, growthStart: 0, growthStage: 0, isMutated: false, isWatered: false, waterStages: 1 // Novo campo para controle de rega
        });
    }
}

let gameData = JSON.parse(JSON.stringify(INITIAL_DATA));


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
const closeAdminPanelButton = document.getElementById('closeAdminPanelButton');

const modalTitle = document.getElementById('modalTitle');
const modalScrollContent = document.getElementById('modalScrollContent'); 
const modalContent = document.getElementById('modalContent');
const adminScrollContent = document.getElementById('adminScrollContent');


// --- 3. LÓGICA DE MOVIMENTO E DESENHO ---

function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

function drawMap() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const tileType = GAME_MAP[y][x];
            let color = '#556b2f'; // Grama (0)

            if (tileType === 1) { // Parede
                color = '#8b4513';
            } else if (tileType === 2) { // Entrada do Jardim
                color = '#006400'; 
                drawText('JARDIM', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 3) { // Vendedor de Colheitas
                color = '#ff6347'; 
                drawText('VENDER', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 4) { // Loja de Sementes
                color = '#4682b4';
                drawText('SEMENTES', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 5) { // Loja de Equipamentos
                color = '#ffd700';
                drawText('EQUIP.', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'black', 10);
            } else if (tileType === 6) { // Loja de Pets
                color = '#9370db';
                drawText('PETS', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            }

            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (const plot of gameData.plots) {
        const x = plot.gridX * TILE_SIZE + (CANVAS_WIDTH - GARDEN_WIDTH * TILE_SIZE) / 2;
        const y = plot.gridY * TILE_SIZE + (CANVAS_HEIGHT - GARDEN_HEIGHT * TILE_SIZE) / 2;

        // 1. Desenhar a terra
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

        // 2. Desenhar status (Água)
        // Se a plot.waterStages > 0, significa que está regada.
        if (plot.waterStages > 0) {
            ctx.fillStyle = 'rgba(0, 191, 255, 0.4)';
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
        
        // 3. Desenhar a planta
        if (plot.isPlanted) {
            const seed = SEEDS_DATA[plot.seedType];
            const maxStages = Math.floor(seed.growTime / 5); 
            const stage = Math.min(plot.growthStage, maxStages);
            const size = (stage / maxStages) * (TILE_SIZE / 2);

            ctx.fillStyle = seed.color;
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, size, 0, Math.PI * 2);
            ctx.fill();

            // 4. Desenhar Fruto (Se estiver pronto)
            if (plot.growthStage >= maxStages) {
                // Se a imagem da fruta pronta estiver disponível (URL)
                // Implementação futura:
                // if (seed.imageURL) {
                //     ctx.drawImage(seed.image, x + TILE_SIZE / 4, y + TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
                // } else { 
                    ctx.fillStyle = seed.harvestColor;
                    ctx.beginPath();
                    ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 4, 0, Math.PI * 2);
                    ctx.fill();
                // }
                
                // Mutações (Visual)
                if (plot.isMutated) {
                    drawText('★', x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 15, 'gold', 10);
                }
            }
        }
    }
}

function drawPlayer() {
    // Desenha o mapa ou o jardim primeiro
    if (gameData.currentScene === 'map') {
        drawMap();
    } else {
        drawGarden();
    }

    // Desenha o jogador
    ctx.fillStyle = gameData.player.color;
    ctx.beginPath();
    ctx.arc(gameData.player.x + PLAYER_SIZE / 2, gameData.player.y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Desenha o Pet se houver
    if (gameData.pet.name !== PETS.none.name) {
        ctx.fillStyle = gameData.pet.color;
        ctx.beginPath();
        ctx.arc(gameData.player.x + PLAYER_SIZE / 2 + 15, gameData.player.y + PLAYER_SIZE / 2 - 15, PLAYER_SIZE / 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

function checkCollision(nextX, nextY) {
    if (gameData.currentScene === 'map') {
        const tileX = Math.floor((nextX + PLAYER_SIZE / 2) / TILE_SIZE);
        const tileY = Math.floor((nextY + PLAYER_SIZE / 2) / TILE_SIZE);
        
        if (tileX < 0 || tileX >= 10 || tileY < 0 || tileY >= 10) return true;
        if (GAME_MAP[tileY][tileX] === 1) return true;
    }
    return false;
}

function checkMapInteractions() {
    // Se um modal estiver aberto, não cheque interações.
    if (shopInteractionModal.style.display === 'block' || adminPanel.style.display === 'block') {
        return; 
    }
    
    const tileX = Math.floor((gameData.player.x + PLAYER_SIZE / 2) / TILE_SIZE);
    const tileY = Math.floor((gameData.player.y + PLAYER_SIZE / 2) / TILE_SIZE);
    
    const tileType = GAME_MAP[tileY][tileX];

    if (tileType === 2) { // Entrada do Jardim
        sceneChanger.textContent = 'Entrar no Jardim';
        sceneChanger.onclick = () => { changeScene('garden'); };
        sceneChanger.style.display = 'block';
    } else if (tileType === 3) { // Vendedor de Colheitas
        openModal("Vendedor de Colheitas", renderSellerModal());
    } else if (tileType === 4) { // Loja de Sementes
        openModal("Loja de Sementes", renderSeedShop());
    } else if (tileType === 5) { // Loja de Equipamentos
        openModal("Loja de Equipamentos", renderGearShop());
    } else if (tileType === 6) { // Loja de Pets
        openModal("Loja de Pets", renderEggShop());
    } else {
        sceneChanger.style.display = 'none';
    }
}

function checkGardenInteractions() {
    const canvasOffsetX = (CANVAS_WIDTH - GARDEN_WIDTH * TILE_SIZE) / 2;
    const canvasOffsetY = (CANVAS_HEIGHT - GARDEN_HEIGHT * TILE_SIZE) / 2;

    const px = gameData.player.x + PLAYER_SIZE / 2;
    const py = gameData.player.y + PLAYER_SIZE / 2;

    for (let i = 0; i < gameData.plots.length; i++) {
        const plot = gameData.plots[i];
        const plotX = plot.gridX * TILE_SIZE + canvasOffsetX;
        const plotY = plot.gridY * TILE_SIZE + canvasOffsetY;

        // Verifica se o jogador está sobre o plot
        if (px > plotX && px < plotX + TILE_SIZE && py > plotY && py < plotY + TILE_SIZE) {
            return i; 
        }
    }
    return -1;
}

function handleInput() {
    // 1. Se um modal estiver aberto, não permita movimento.
    if (shopInteractionModal.style.display === 'block' || adminPanel.style.display === 'block') {
        gameData.player.dx = 0;
        gameData.player.dy = 0;
        return;
    }
    
    // 2. Se o joystick estiver sendo arrastado, priorize o movimento do joystick.
    // Se não, use o teclado e pare o movimento se nenhuma tecla estiver pressionada.
    if (!isJoystickDragging) {
        // Reinicia dx/dy para o teclado
        gameData.player.dx = 0;
        gameData.player.dy = 0;

        // Lógica de Teclado
        if (keysPressed['w'] || keysPressed['W'] || keysPressed['ArrowUp']) gameData.player.dy = -gameData.player.speed;
        if (keysPressed['s'] || keysPressed['S'] || keysPressed['ArrowDown']) gameData.player.dy = gameData.player.speed;
        if (keysPressed['a'] || keysPressed['A'] || keysPressed['ArrowLeft']) gameData.player.dx = -gameData.player.speed;
        if (keysPressed['d'] || keysPressed['D'] || keysPressed['ArrowRight']) gameData.player.dx = gameData.player.speed;
    }
    
    // 3. Aplica o movimento e checa colisões
    let nextX = gameData.player.x + gameData.player.dx;
    let nextY = gameData.player.y + gameData.player.dy;

    if (!checkCollision(nextX, gameData.player.y)) {
        gameData.player.x = nextX;
    }
    if (!checkCollision(gameData.player.x, nextY)) {
        gameData.player.y = nextY;
    }

    // Mantém o jogador dentro do canvas
    gameData.player.x = Math.max(0, Math.min(gameData.player.x, CANVAS_WIDTH - PLAYER_SIZE));
    gameData.player.y = Math.max(0, Math.min(gameData.player.y, CANVAS_HEIGHT - PLAYER_SIZE));
    
    // 4. Atualiza o estado de isMoving
    isMoving = gameData.player.dx !== 0 || gameData.player.dy !== 0;
}

// --- Funções de Jogo ---

function waterPlot(index) {
    const plot = gameData.plots[index];
    if (!plot.isPlanted || plot.waterStages > 0) return; 

    // Define quantas etapas de crescimento a rega durará
    if (gameData.pet.ability === 'water_time') {
        plot.waterStages = 2; // Fênix: Dura 2 estágios
    } else {
        plot.waterStages = 1; // Padrão: Dura 1 estágio
    }
    plot.isWatered = true; // Mantido para lógica de crescimento imediato (offline)
    saveGame();
}

function harvestPlot(index) {
    const plot = gameData.plots[index];
    const seed = SEEDS_DATA[plot.seedType];
    
    if (!plot.isPlanted || !seed) return false;

    // Calcula o número máximo de estágios (5 segundos por estágio)
    const maxStages = Math.floor(seed.growTime / 5); 

    if (plot.growthStage >= maxStages) {
        let harvestAmount = seed.type === 'multi' ? 3 : 1; 
        
        // Aplica Bônus de Pet (Apenas pets com habilidade 'harvest' dão bônus)
        if (gameData.pet.ability === 'harvest') {
            harvestAmount = Math.ceil(harvestAmount * gameData.pet.bonus);
        }
        
        // Bônus de Mutação (10% extra)
        if (plot.isMutated) {
            harvestAmount = Math.ceil(harvestAmount * 1.1);
        }
        
        // Adiciona ao inventário de colheita
        gameData.harvestInventory[plot.seedType] = (gameData.harvestInventory[plot.seedType] || 0) + harvestAmount;

        // Reseta o plot (se não for multi-colheita)
        if (seed.type === 'single') {
            plot.isPlanted = false;
            plot.seedType = null;
        }
        plot.growthStart = Date.now();
        plot.growthStage = 0;
        plot.waterStages = 0;
        plot.isWatered = false;
        plot.isMutated = false;

        saveGame();
        return true;
    }
    return false;
}

function plantSeed(index, seedKey) {
    const plot = gameData.plots[index];
    const seed = gameData.seeds[seedKey];

    if (!plot.isPlanted && seed.count > 0) {
        plot.isPlanted = true;
        plot.seedType = seedKey;
        plot.growthStart = Date.now();
        plot.growthStage = 0;
        plot.waterStages = 0;
        plot.isWatered = false;
        
        // Chance de mutação base
        let mutationChance = 0.05; 
        // Bônus de Pet para mutação
        if (gameData.pet.ability === 'mutation_boost') {
            mutationChance += 0.20; // +20% para o Labrador Dourado
        }
        
        plot.isMutated = Math.random() < mutationChance; 
        
        seed.count -= 1;
        saveGame();
        return true;
    }
    return false;
}

function tryPlant() {
    const plotIndex = checkGardenInteractions();
    if (plotIndex !== -1 && !gameData.plots[plotIndex].isPlanted) {
        let html = `<h3>Plantar Semente no Plot (${plotIndex + 1})</h3>`;
        let seedsFound = false;
        
        Object.keys(gameData.seeds).forEach(key => {
            const seed = gameData.seeds[key];
            if (seed.count > 0) {
                seedsFound = true;
                html += `<div class="shop-item">
                    <span>${seed.name} (x${seed.count})</span>
                    <button class="buy-button" onclick="plantSeedAndCloseModal(${plotIndex}, '${key}')">Plantar</button>
                </div>`;
            }
        });
        
        if (!seedsFound) {
            html += '<p>Você não tem sementes para plantar. Visite a loja!</p>';
        }
        
        openModal("Plantio", html);
    }
}

function plantSeedAndCloseModal(plotIndex, seedKey) {
    plantSeed(plotIndex, seedKey);
    if (shopInteractionModal) shopInteractionModal.style.display = 'none';
    stopPlayer(); // Adicionado para garantir que o movimento trave ao fechar
}


// --- 4. FUNÇÕES DE SALVAR E CARREGAR (Mesclagem de Dados) ---

function saveGame() {
    try {
        gameData.lastSaveTime = Date.now(); 
        gameData.lastRestockTime = lastRestockTime; // Salva o tempo da última reposição
        const dataToSave = JSON.stringify(gameData);
        localStorage.setItem(SAVE_KEY, dataToSave);
    } catch (e) {
        console.error("Erro ao salvar o jogo:", e);
    }
}

function loadGame() {
    try {
        const savedData = localStorage.getItem(SAVE_KEY);
        if (savedData) {
            const loadedData = JSON.parse(savedData);
            
            // 1. Mescla Dados Iniciais
            gameData = { ...INITIAL_DATA, ...loadedData }; 
            
            // 2. Mescla Sementes/Gear/Eggs (mantém count/stock se existirem, senão usa padrão)
            const mergeData = (target, sourceData) => {
                const merged = JSON.parse(JSON.stringify(sourceData)); 
                if (target) {
                    for (const key in target) {
                        if (merged[key]) {
                            // Copia count (inventário do jogador) e currentStock (estoque da loja)
                            merged[key].count = target[key].count || 0; 
                            merged[key].currentStock = target[key].currentStock || merged[key].maxStock; 
                        }
                    }
                }
                return merged;
            };

            gameData.seeds = mergeData(loadedData.seeds, SEEDS_DATA);
            gameData.inventory = { ...INITIAL_DATA.inventory, ...loadedData.inventory };
            
            // Tratamento de Eggs (especial, pois não tem count, só stock)
            gameData.eggs = mergeData(loadedData.eggs, EGGS);
            // Corrige o bug de eggs estarem no seeds, se for um save antigo
            if(!gameData.eggs.commonEgg) gameData.eggs = JSON.parse(JSON.stringify(EGGS)); 

            // 3. Mescla Inventário de Colheita
            const mergedHarvestInventory = { ...loadedData.harvestInventory };
            for (const key in SEEDS_DATA) {
                if (mergedHarvestInventory[key] === undefined) {
                    mergedHarvestInventory[key] = 0; 
                }
            }
            gameData.harvestInventory = mergedHarvestInventory;
            
            // 4. Carrega o Pet (usando dados atualizados)
            gameData.pet = PETS[loadedData.pet.name] || PETS.none;
            
            // 5. Carrega o tempo de última reposição
            lastRestockTime = loadedData.lastRestockTime || Date.now();
            
            // 6. Recalcula o tempo offline
            if (gameData.lastSaveTime) {
                const timeOfflineSeconds = (Date.now() - gameData.lastSaveTime) / 1000;
                simulateOfflineGrowth(timeOfflineSeconds); 
                checkRestock(); // Verifica se houve reposição offline
            }
            
            updateStats();
            return true;
        }
    } catch (e) {
        console.error("Erro ao carregar o jogo:", e);
    }
    return false;
}

function simulateOfflineGrowth(seconds) {
    if (seconds <= 0) return;

    const effectiveSeconds = seconds; 
    
    gameData.plots.forEach(plot => {
        if (plot.isPlanted) {
            const seed = SEEDS_DATA[plot.seedType];
            if (!seed) return; 

            const maxStages = Math.floor(seed.growTime / 5); 
            const timePerStage = 5; 

            const timeSinceStart = (Date.now() - plot.growthStart) / 1000;
            const newTimeSinceStart = timeSinceStart + effectiveSeconds;
            
            const stagesPassed = Math.floor(newTimeSinceStart / timePerStage) - plot.growthStage;
            
            if (stagesPassed > 0) {
                // Diminui os waterStages pelo número de estágios passados
                plot.waterStages = Math.max(0, plot.waterStages - stagesPassed);
                plot.isWatered = plot.waterStages > 0; // Atualiza o status de rega
                
                // Atualiza o estágio de crescimento se houver água suficiente
                if (plot.waterStages > 0) {
                    plot.growthStage = Math.min(plot.growthStage + stagesPassed, maxStages);
                } else {
                    // O crescimento para quando a água acaba. 
                    // Se estivermos fora do jogo, assumimos que a água só dura 1 estágio por padrão.
                    // Para simplificar, apenas garantimos que o crescimento não exceda o tempo offline.
                    plot.growthStage = Math.min(Math.floor(newTimeSinceStart / timePerStage), maxStages);
                    plot.waterStages = 0;
                    plot.isWatered = false;
                }
            }
        }
    });

    saveGame();
}

// --- NOVO SISTEMA DE REPOSIÇÃO DE ESTOQUE ---
function checkRestock() {
    const now = Date.now();
    
    if (now - lastRestockTime >= RESTOCK_INTERVAL) {
        restockAllShops();
        lastRestockTime = now;
        saveGame();
    }
}

function restockAllShops() {
    // 1. Reposição de Sementes
    Object.keys(gameData.seeds).forEach(key => {
        const seed = gameData.seeds[key];
        if (seed.currentStock < seed.maxStock) {
            if (Math.random() < seed.restockChance) {
                seed.currentStock = Math.min(seed.currentStock + 1, seed.maxStock);
            }
        }
    });

    // 2. Reposição de Equipamentos
    Object.keys(GEAR).forEach(key => {
        const gear = GEAR[key];
        if (gameData.inventory[key] < gear.maxStock) { // Usamos maxStock para controle de estoque de loja
            if (Math.random() < gear.restockChance) {
                gameData.inventory[key].currentStock = Math.min(gear.currentStock + 1, gear.maxStock);
            }
        }
    });
    
    // 3. Reposição de Ovos
    Object.keys(gameData.eggs).forEach(key => {
        const egg = gameData.eggs[key];
        if (egg.currentStock < egg.maxStock) {
            if (Math.random() < egg.restockChance) {
                egg.currentStock = Math.min(egg.currentStock + 1, egg.maxStock);
            }
        }
    });

    // Força a atualização do modal se estiver aberto
    if (shopInteractionModal.style.display === 'block') {
        const title = modalTitle.textContent;
        if (title.includes("Sementes")) modalContent.innerHTML = renderSeedShop();
        if (title.includes("Equipamentos")) modalContent.innerHTML = renderGearShop();
        if (title.includes("Pets")) modalContent.innerHTML = renderEggShop();
    }
}

function checkGrowth() {
    gameData.plots.forEach(plot => {
        const seed = SEEDS_DATA[plot.seedType];
        if (!plot.isPlanted || !seed) return;

        const maxStages = Math.floor(seed.growTime / 5);
        if (plot.growthStage >= maxStages) return;
        
        const timePerStage = 5; // 5 segundos por estágio

        // Regar automático por sprinkler
        if (plot.waterStages === 0) {
            let waterChance = 0;
            if (gameData.inventory.basicSprinkler > 0) waterChance = 0.3;
            if (gameData.inventory.proSprinkler > 0) waterChance = 0.6; 
            
            if (waterChance > 0 && Math.random() < waterChance) {
                waterPlot(gameData.plots.indexOf(plot)); // Usa a função de rega para aplicar o waterStages
            }
        }

        const timeSinceStart = (Date.now() - plot.growthStart) / 1000;
        const newStage = Math.floor(timeSinceStart / timePerStage);
        const stagesToAdvance = newStage - plot.growthStage;
        
        if (stagesToAdvance > 0) {
            
            let successfulStages = 0;
            // Verifica o crescimento estágio por estágio
            for (let i = 0; i < stagesToAdvance; i++) {
                if (plot.waterStages > 0) {
                    plot.waterStages--;
                    successfulStages++;
                }
            }
            
            plot.growthStage += successfulStages;
            plot.growthStage = Math.min(plot.growthStage, maxStages);
            
            // Atualiza status de rega para o desenho
            plot.isWatered = plot.waterStages > 0;
        }
    });
    saveGame();
}

function updateStats() {
    if (moneySpan) moneySpan.textContent = gameData.money.toFixed(2);
    
    let gearCount = (gameData.inventory.basicSprinkler || 0) + (gameData.inventory.proSprinkler || 0) + (gameData.inventory.wateringCan || 0);
    if (sprinklerCountSpan) sprinklerCountSpan.textContent = gearCount; 
    
    if (petNameSpan) petNameSpan.textContent = gameData.pet.name;
    let bonusText = `x${gameData.pet.bonus.toFixed(2)}`;
    if (gameData.pet.ability === 'mutation_boost') bonusText = '+20% Mutações';
    if (gameData.pet.ability === 'water_time') bonusText = '2x Duração Água';
    if (petBonusSpan) petBonusSpan.textContent = bonusText;
    
    // Recarrega o conteúdo do Vendedor se o modal estiver aberto
    if (shopInteractionModal.style.display === 'block' && modalTitle && modalTitle.textContent === "Vendedor de Colheitas") {
        if (modalContent) modalContent.innerHTML = renderSellerModal();
    }
}


// --- 5. FUNÇÕES DE LOJA E MODAL ---

function renderSeedShop() {
    let html = '';
    const rarities = { 
        'common': 'Comum', 'rare': 'Rara', 'epic': 'Épica', 
        'legendary': 'Lendária', 'mythic': 'Mítica', 'supreme': 'SUPREMA' 
    };
    
    // Ordena as sementes da mais comum para a mais rara
    const sortedSeedKeys = Object.keys(gameData.seeds).sort((a, b) => {
        const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'mythic', 'supreme'];
        return rarityOrder.indexOf(gameData.seeds[a].rarity) - rarityOrder.indexOf(gameData.seeds[b].rarity);
    });
    
    sortedSeedKeys.forEach(key => {
        const seed = gameData.seeds[key];
        const disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        html += `<div class="shop-item">
            <span><strong>${seed.name}</strong> (${rarities[seed.rarity]})</span>
            <small>Custo: **${seed.cost}¢** | Tempo: ${seed.growTime}s | Estoque: ${seed.currentStock} | Seu: ${seed.count}</small>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buySeed('${key}')">Comprar</button>
        </div>`;
    });
    // Adiciona o tempo da próxima reposição
    const nextRestock = new Date(lastRestockTime + RESTOCK_INTERVAL);
    html += `<p style="font-size: 10px; margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
        Próxima Reposição de Estoque: ${nextRestock.toLocaleTimeString()}</p>`;
        
    return html;
}

function buySeed(seedKey) {
    const seed = gameData.seeds[seedKey];
    if (gameData.money >= seed.cost && seed.currentStock > 0) {
        gameData.money -= seed.cost;
        seed.currentStock -= 1;
        seed.count += 1;
        
        if (modalContent) modalContent.innerHTML = renderSeedShop(); 
        saveGame(); 
    }
    updateStats();
}

function renderGearShop() {
    let html = '';
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const disabled = gameData.money < gearItem.cost || gearItem.currentStock <= 0;
        const currentStock = gearItem.currentStock !== undefined ? gearItem.currentStock : 1; // Usar stock da loja
        
        html += `<div class="shop-item">
            <span><strong>${gearItem.name}</strong> (${gearItem.cost}¢) | Seu: ${gameData.inventory[key] || 0}</span>
            <small>${gearItem.description} | Estoque: ${currentStock}</small>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyGear('${key}')">Comprar</button>
        </div>`;
    });
    
    const nextRestock = new Date(lastRestockTime + RESTOCK_INTERVAL);
    html += `<p style="font-size: 10px; margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
        Próxima Reposição de Estoque: ${nextRestock.toLocaleTimeString()}</p>`;
        
    return html;
}

function buyGear(gearKey) {
    const gearItem = GEAR[gearKey];
    if (gameData.money >= gearItem.cost && gearItem.currentStock > 0) {
        gameData.money -= gearItem.cost;
        gearItem.currentStock -= 1; // Diminui o estoque da loja
        gameData.inventory[gearKey] = (gameData.inventory[gearKey] || 0) + 1; // Aumenta o inventário do jogador
        if (modalContent) modalContent.innerHTML = renderGearShop(); 
        saveGame();
    }
    updateStats();
}

function renderEggShop() {
    let html = '';
    Object.keys(gameData.eggs).forEach(key => {
        const eggItem = gameData.eggs[key];
        const disabled = gameData.money < eggItem.cost || eggItem.currentStock <= 0;
        
        // Exibe as chances
        let chanceList = eggItem.pets.map((p, index) => {
            return `${PETS[p].name} (${(eggItem.chance[index] * 100).toFixed(0)}%)`;
        }).join(', ');
        
        html += `<div class="shop-item">
            <span><strong>${eggItem.name}</strong> (${eggItem.cost}¢) | Estoque: ${eggItem.currentStock}</span>
            <small>Choca: ${chanceList}</small>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyAndHatchEgg('${key}')">Comprar & Chocar</button>
        </div>`;
    });

    const nextRestock = new Date(lastRestockTime + RESTOCK_INTERVAL);
    html += `<p style="font-size: 10px; margin-top: 15px; border-top: 1px solid #ccc; padding-top: 10px;">
        Próxima Reposição de Estoque: ${nextRestock.toLocaleTimeString()}</p>`;
        
    return html;
}

function buyAndHatchEgg(eggKey) {
    const egg = gameData.eggs[eggKey];
    if (gameData.money >= egg.cost && egg.currentStock > 0) {
        gameData.money -= egg.cost;
        egg.currentStock -= 1; // Diminui o estoque da loja
        
        let petKey = 'none';
        let cumulativeChance = 0;
        const rand = Math.random();
        
        for (let i = 0; i < egg.chance.length; i++) {
            cumulativeChance += egg.chance[i];
            if (rand <= cumulativeChance) {
                petKey = egg.pets[i];
                break;
            }
        }
        
        const newPet = PETS[petKey];

        gameData.pet = newPet;
        
        alert(`Parabéns! Você chocou um(a) ${newPet.name}! Bônus: ${petBonusSpan.textContent}`);
        
        if (shopInteractionModal) shopInteractionModal.style.display = 'none';
        stopPlayer(); 
        saveGame();
    }
    updateStats();
}

function renderSellerModal() {
    let html = '<h3>Itens para Venda</h3>';
    let totalValue = 0;
    let itemsFound = false;

    Object.keys(gameData.harvestInventory).forEach(key => {
        const count = gameData.harvestInventory[key];
        const seedData = SEEDS_DATA[key];
        if (count > 0 && seedData) {
            itemsFound = true;
            const value = (seedData.sellValue * count).toFixed(2);
            totalValue += parseFloat(value);
            
            html += `<div class="shop-item">
                <span>**${seedData.name}** (x${count})</span>
                <small>Valor Total: ${value}¢</small>
            </div>`;
        }
    });

    if (!itemsFound) {
        html += '<p>Você não tem colheitas para vender.</p>';
        html += `<button class="buy-button" disabled>Vender Tudo</button>`;
    } else {
        html += `<p style="margin-top: 15px;">**Valor Total da Venda:** **${totalValue.toFixed(2)}¢**</p>`;
        html += `<button class="buy-button" onclick="sellItems()">Vender Tudo (${totalValue.toFixed(2)}¢)</button>`;
    }
    
    return html;
}

function sellItems() {
    let totalValue = 0;
    
    Object.keys(gameData.harvestInventory).forEach(key => {
        const count = gameData.harvestInventory[key];
        const seedData = SEEDS_DATA[key];
        if (count > 0 && seedData) {
            totalValue += seedData.sellValue * count;
            gameData.harvestInventory[key] = 0; // Zera o estoque
        }
    });

    gameData.money += totalValue;
    
    if (modalContent) modalContent.innerHTML = renderSellerModal();
    saveGame();
    updateStats();
}

// Função que abre o modal (CRÍTICO: Injeta no modalContent)
function openModal(title, contentHTML) {
    // CRÍTICO: Parar o jogador ao abrir o modal
    stopPlayer(); 
    
    if (modalTitle) modalTitle.textContent = title;
    
    if (modalContent) modalContent.innerHTML = contentHTML; 
    
    if (shopInteractionModal) shopInteractionModal.style.display = 'block';
    updateStats(); 
}

function changeScene(scene) {
    saveGame(); 
    
    gameData.currentScene = scene;
    
    if (sceneChanger) sceneChanger.style.display = 'none';
    if (harvestAllButton) harvestAllButton.style.display = 'none';
    if (waterButton) waterButton.style.display = 'none';
    if (adminButtonMap) adminButtonMap.style.display = 'none';
    
    if (scene === 'map') {
        if (adminButtonMap) adminButtonMap.style.display = 'inline-block';
        gameData.player.x = 1 * TILE_SIZE; 
        gameData.player.y = 8 * TILE_SIZE; 
    } else { 
        if (sceneChanger) {
            sceneChanger.textContent = 'Sair do Jardim';
            sceneChanger.onclick = () => { changeScene('map'); };
            sceneChanger.style.display = 'block'; 
        }
        if (harvestAllButton) harvestAllButton.style.display = 'inline-block';
        if (waterButton) waterButton.style.display = 'inline-block';

        gameData.player.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
        gameData.player.y = CANVAS_HEIGHT / 2 - PLAYER_SIZE / 2;
    }
}


// --- 6. ADMIN PANEL ---

function executeAdminCommand(command) {
    const parts = command.trim().toLowerCase().split(/\s+/);
    const cmd = parts[0];
    const target = parts[1];
    const value = parts[2];

    const output = document.getElementById('adminOutput');
    let log = '';

    if (cmd === '/give') {
        const numValue = parseInt(value);
        if (isNaN(numValue) || numValue < 0) {
            log = "Valor inválido. Use: /give [money/seed/gear/egg] [item] [quantidade]";
        } else if (target === 'money') {
            gameData.money += numValue;
            log = `Adicionado ${numValue}¢. Dinheiro atual: ${gameData.money.toFixed(2)}¢.`;
        } else if (target === 'seed' && gameData.seeds[value]) {
            gameData.seeds[value].count += numValue;
            log = `Adicionado ${numValue}x ${gameData.seeds[value].name} ao seu inventário.`;
        } else if (target === 'gear' && GEAR[value]) {
             gameData.inventory[value] = (gameData.inventory[value] || 0) + numValue;
             log = `Adicionado ${numValue}x ${GEAR[value].name} ao seu inventário.`;
        } else if (target === 'egg' && gameData.eggs[value]) {
             gameData.eggs[value].currentStock = (gameData.eggs[value].currentStock || 0) + numValue;
             log = `Adicionado ${numValue}x ${gameData.eggs[value].name} ao estoque da loja.`;
        } else {
            log = `Comando /give inválido ou item não encontrado: ${value}.`;
        }
    } else if (cmd === '/stock') {
        const numValue = parseInt(value);
        if (target === 'seed' && gameData.seeds[value]) {
             gameData.seeds[value].currentStock = numValue;
             log = `Estoque de ${gameData.seeds[value].name} ajustado para: ${numValue}.`;
        } else if (target === 'egg' && gameData.eggs[value]) {
             gameData.eggs[value].currentStock = numValue;
             log = `Estoque de ${gameData.eggs[value].name} ajustado para: ${numValue}.`;
        } else {
            log = `Comando /stock inválido ou item não encontrado.`;
        }
    } else {
        log = "Comando não reconhecido. Tente: /give money 1000, /give seed carrot 5, /stock seed carrot 10";
    }

    if (output) output.textContent = log;
    saveGame();
    updateStats();
}


// --- 7. LISTENERS (CORRIGIDOS) ---

// Fechar Modal Geral
if (closeModalButton) {
    closeModalButton.addEventListener('click', () => {
        if (shopInteractionModal) shopInteractionModal.style.display = 'none';
        stopPlayer(); // CRÍTICO: Garante que o movimento possa ser retomado.
    });
}

// Fechar Admin Panel
if (closeAdminPanelButton) {
    closeAdminPanelButton.addEventListener('click', () => {
        if (adminPanel) adminPanel.style.display = 'none';
        stopPlayer(); // CRÍTICO: Garante que o movimento possa ser retomado.
    });
}

// Botão Regar
if (waterButton) {
    waterButton.addEventListener('click', () => {
        const plotIndex = checkGardenInteractions();
        if (plotIndex !== -1) {
            waterPlot(plotIndex);
        } else {
            alert('Aproxime-se de um plot para regar, ou clique nele.');
        }
    });
}

// Colher Tudo
if (harvestAllButton) {
    harvestAllButton.addEventListener('click', () => {
        let harvestedCount = 0;
        gameData.plots.forEach((plot, index) => {
            if (harvestPlot(index)) {
                harvestedCount++;
            }
        });
        alert(`Colheita concluída! ${harvestedCount} plots colhidos.`);
    });
}

// Interação no Jardim (Plantar/Colher/Regar por Clique)
canvas.addEventListener('click', (e) => {
    if (gameData.currentScene === 'garden') {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const canvasOffsetX = (CANVAS_WIDTH - GARDEN_WIDTH * TILE_SIZE) / 2;
        const canvasOffsetY = (CANVAS_HEIGHT - GARDEN_HEIGHT * TILE_SIZE) / 2;

        const gridX = Math.floor((mouseX - canvasOffsetX) / TILE_SIZE);
        const gridY = Math.floor((mouseY - canvasOffsetY) / TILE_SIZE);

        const plotIndex = gridY * GARDEN_WIDTH + gridX;

        if (plotIndex >= 0 && plotIndex < gameData.plots.length) {
            const plot = gameData.plots[plotIndex];
            const seed = plot.seedType ? SEEDS_DATA[plot.seedType] : null;

            if (plot.isPlanted && seed && plot.growthStage >= Math.floor(seed.growTime / 5)) {
                // Tenta colher
                harvestPlot(plotIndex);
            } else if (!plot.isPlanted) {
                // Tenta plantar (abre modal de plantio)
                tryPlant();
            } else if (plot.isPlanted && plot.waterStages === 0) {
                // Tenta regar
                waterPlot(plotIndex);
            }
        }
    }
});


// Admin Panel Listener
if (adminButtonMap) {
    adminButtonMap.addEventListener('click', () => {
        if (adminPanel) {
            if (adminPanel.style.display === 'block') {
                 adminPanel.style.display = 'none'; 
                 stopPlayer(); // Garante que o movimento pare se for fechado por esse botão
            } else {
                const enteredPassword = prompt("Digite a senha de administrador:");
                if (enteredPassword === ADMIN_PASSWORD) {
                    adminPanel.style.display = 'block';
                    stopPlayer(); // Para o jogador ao abrir
                    
                    if (adminScrollContent) {
                        adminScrollContent.innerHTML = `
                            <p id="adminOutput" style="margin-bottom: 10px;">Logado como Admin. Senha: ${ADMIN_PASSWORD}</p>
                            <input type="text" id="adminCommandInput" placeholder="/give money 1000" style="width: 95%; padding: 8px; margin-bottom: 10px;">
                            <button id="runCommandButton" class="buy-button">Executar</button>
                            <p style="font-size: 12px; margin-top: 10px;">Comandos: <br>
                                /give money [valor] <br>
                                /give seed [tipo] [qtd] (ex: /give seed cosmicDust 1)<br>
                                /give egg [tipo] [qtd] (ex: /give egg legendaryEgg 1)<br>
                                /stock seed/egg [tipo] [novo_estoque]
                            </p>
                        `;
                        // Reatribui o listener do botão Run Command
                        document.getElementById('runCommandButton')?.addEventListener('click', () => {
                             const input = document.getElementById('adminCommandInput');
                             if (input) executeAdminCommand(input.value);
                        });
                    }
                } else {
                    alert("Senha incorreta!");
                    adminPanel.style.display = 'none';
                }
            }
        }
    });
}


// --- 8. LÓGICA DE MOVIMENTO (JOYSTICK) ---

let isJoystickDragging = false;
let startX, startY;

function stopPlayer() {
    // CRÍTICO: Zera o movimento do jogador quando o joystick é solto
    gameData.player.dx = 0;
    gameData.player.dy = 0;
    isMoving = false;
}

function handleStart(e) {
    e.preventDefault();
    if (shopInteractionModal.style.display === 'block' || adminPanel.style.display === 'block') return;

    isJoystickDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    joystick.style.transform = 'translate(0px, 0px)';
}

function handleMove(e) {
    if (!isJoystickDragging) return;
    e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;

    const distance = Math.min(50, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const cappedX = distance * Math.cos(angle);
    const cappedY = distance * Math.sin(angle);

    joystick.style.transform = `translate(${cappedX}px, ${cappedY}px)`;
    
    // Controlar o movimento do jogador
    gameData.player.dx = Math.round(cappedX / 50 * gameData.player.speed);
    gameData.player.dy = Math.round(cappedY / 50 * gameData.player.speed);
    isMoving = true; // Força o estado de movimento enquanto arrasta
}

function handleEnd() {
    isJoystickDragging = false;
    joystick.style.transform = 'translate(0px, 0px)';
    stopPlayer(); // CRÍTICO: Pára o movimento aqui
}

function setupJoystick() {
    if (!joystick) return;
    
    // Mouse Events
    joystick.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd); 

    // Touch Events
    joystick.addEventListener('touchstart', handleStart);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleEnd); 
    document.addEventListener('touchcancel', handleEnd); 
}

// Teclado (Fallback)
document.addEventListener('keydown', (e) => {
    if (shopInteractionModal.style.display === 'block' || adminPanel.style.display === 'block') return;
    keysPressed[e.key] = true;
    isMoving = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
    // O movimento real é determinado no handleInput
});


// --- 9. LOOP PRINCIPAL E INICIALIZAÇÃO ---

function gameLoop() {
    // 1. Lidar com a entrada e movimento
    handleInput(); 

    // 2. Lógica de Jogo
    if (gameData.currentScene === 'map') {
        checkMapInteractions();
        checkRestock(); // Verifica o estoque a cada frame no mapa
    } else {
        checkGrowth(); 
    }

    // 3. Desenhar
    drawPlayer();

    // 4. Salvar (a cada 5 segundos)
    if (Date.now() - gameData.player.lastMove > 5000) {
        saveGame();
        gameData.player.lastMove = Date.now();
    }
    
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    loadGame();
    setupJoystick();
    changeScene(gameData.currentScene); 
    updateStats();
    gameLoop();
        }
