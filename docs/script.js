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

// SENHA DE ADMIN
const ADMIN_PASSWORD = "ArthurSigmaBoy123"; 

// NOVO MAPA 10x10 (Distanciamento das lojas e vendedor)
// 1:Parede, 2:Entrada Jardim, 3:Vendedor, 4:Loja Semente, 5:Loja Gear, 6:Loja Ovos, 0:Grama
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 0, 0, 0, 5, 0, 0, 6, 1], // Lojas mais distantes
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 3, 0, 0, 0, 1], // Vendedor centralizado na parte inferior
    [1, 2, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// --- NOVOS DADOS PARA ITENS E NPCs ---

// Pets (Mais opções e bônus variados)
const PETS = { 
    none: { name: 'Nenhum', bonus: 1.0 }, 
    bunny: { name: 'Coelho', bonus: 1.1, color: '#f5f5dc' }, 
    fox: { name: 'Raposa', bonus: 1.25, color: '#ff4500' },
    dragon: { name: 'Dragão', bonus: 1.5, color: '#b22222' } 
};

// Eggs (Raridade e mais pets)
const EGGS = { 
    commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', pets: ['bunny'], chance: [1.0] }, 
    rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', pets: ['bunny', 'fox'], chance: [0.7, 0.3] },
    legendaryEgg: { name: 'Ovo Lendário', cost: 25000, color: '#ffd700', pets: ['fox', 'dragon'], chance: [0.5, 0.5] }
};

// Gear (Adicionado o regador - wateringCan)
const GEAR = { 
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto" }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto" },
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas" }
};

// Sementes (Raridades adicionadas)
const SEEDS_DATA = {
    // Comuns
    carrot: { name: 'Cenoura Comum', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, color: '#ff9800', type: 'single', harvestColor: '#ff9800', rarity: 'common' },
    pumpkin: { name: 'Abóbora Comum', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, color: '#ff5722', type: 'single', harvestColor: '#ff5722', rarity: 'common' },
    
    // Raras
    blueBerry: { name: 'Mirtilo Raro', cost: 400, sellValue: 800, growTime: 15, count: 0, maxStock: 4, currentStock: 4, color: '#4169e1', type: 'multi', harvestColor: '#4169e1', rarity: 'rare' },
    moonFlower: { name: 'Flor Lunar Rara', cost: 800, sellValue: 1800, growTime: 25, count: 0, maxStock: 2, currentStock: 2, color: '#e0ffff', type: 'single', harvestColor: '#e0ffff', rarity: 'rare' },
    
    // Épicas
    goldenMelon: { name: 'Melancia Dourada', cost: 2000, sellValue: 5000, growTime: 40, count: 0, maxStock: 1, currentStock: 1, color: '#ffd700', type: 'single', harvestColor: '#ffd700', rarity: 'epic' },
    starFruit: { name: 'Carambola Estelar', cost: 1500, sellValue: 3500, growTime: 35, count: 0, maxStock: 1, currentStock: 1, color: '#fdfd96', type: 'multi', harvestColor: '#fdfd96', rarity: 'epic' }
};

// Dados iniciais
const INITIAL_DATA = {
    money: 100,
    inventory: { basicSprinkler: 0, proSprinkler: 0, wateringCan: 1 }, // Começa com 1 Regador
    harvestInventory: { carrot: 0, pumpkin: 0, blueBerry: 0, moonFlower: 0, goldenMelon: 0, starFruit: 0 }, 
    seeds: JSON.parse(JSON.stringify(SEEDS_DATA)), // Cópia limpa do estado
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
            gridX: x, gridY: y, isPlanted: false, seedType: null, growthStart: 0, growthStage: 0, isMutated: false, isWatered: false
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
            // NOVO: Animação de pernas (frame 0 e 1)
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
        gameData.player.animationFrame = 0; // Pés juntos (parado)
    }
    
    if (gameData.currentScene === 'map') {
        checkMapInteractions();
    }
}

// NOVO: Desenho do jogador com animação de "pernas"
function drawPlayer(x, y, frame) {
    ctx.fillStyle = gameData.player.color;
    
    // Desenho do corpo (cabeça/tronco)
    ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE * 0.7);

    // Desenho das pernas
    ctx.fillStyle = gameData.player.color;
    if (frame === 0) {
        // Posição de descanso (pernas juntas ou em V)
        ctx.fillRect(x + 5, y + PLAYER_SIZE * 0.7, 5, PLAYER_SIZE * 0.3);
        ctx.fillRect(x + PLAYER_SIZE - 10, y + PLAYER_SIZE * 0.7, 5, PLAYER_SIZE * 0.3);
    } else {
        // Posição de movimento (pernas abertas)
        ctx.fillRect(x + 2, y + PLAYER_SIZE * 0.7, 5, PLAYER_SIZE * 0.3); // Perna esquerda mais para fora
        ctx.fillRect(x + PLAYER_SIZE - 7, y + PLAYER_SIZE * 0.7, 5, PLAYER_SIZE * 0.3); // Perna direita mais para fora
    }
    
    // Simulação de olhos
    ctx.fillStyle = 'white';
    ctx.fillRect(x + 5, y + 5, 5, 5);
    ctx.fillRect(x + PLAYER_SIZE - 10, y + 5, 5, 5);
}

// --- 4. LÓGICA DE CENA E DESENHO (Estética Aprimorada) ---

// NOVO: Desenha um NPC de Loja/Vendedor
function drawNPC(x, y, color, label) {
    const npcSize = 20;
    const bodyY = y + TILE_SIZE - npcSize - 5;
    const centerX = x + TILE_SIZE / 2;
    
    // Corpo
    ctx.fillStyle = color;
    ctx.fillRect(centerX - npcSize / 2, bodyY, npcSize, npcSize);
    
    // Cabeça
    ctx.beginPath();
    ctx.arc(centerX, bodyY, npcSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    
    // Placa
    ctx.fillStyle = '#444';
    ctx.fillRect(centerX - 15, y, 30, 15);
    drawText(label, centerX, y + 10, 'white', 8);
}

function drawMap() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    for (let y = 0; y < GAME_MAP.length; y++) {
        for (let x = 0; x < GAME_MAP[y].length; x++) {
            const tile = GAME_MAP[y][x];
            let color = '#4CAF50'; // Grama
            
            // Desenha a cor base do tile
            if (tile === 1) color = '#795548'; // Parede
            if (tile === 2) color = '#c3f5d6'; // Entrada do Jardim (Tom verde claro)
            
            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

            // Adiciona borda escura para dar profundidade (exceto na grama)
            if (tile !== 0) {
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1;
                ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
            
            // NOVO: Desenha NPCs sobre as lojas/vendedor
            if (tile === 3) { // Vendedor
                drawNPC(x * TILE_SIZE, y * TILE_SIZE, '#ff9800', 'VENDER');
            } else if (tile === 4) { // Loja Semente
                drawNPC(x * TILE_SIZE, y * TILE_SIZE, '#8bc34a', 'SEMENTES');
            } else if (tile === 5) { // Loja Gear
                drawNPC(x * TILE_SIZE, y * TILE_SIZE, '#2196f3', 'EQUIP.');
            } else if (tile === 6) { // Loja Ovos
                drawNPC(x * TILE_SIZE, y * TILE_SIZE, '#e91e63', 'OVOS');
            }
        }
    }
    drawText('JARDIM', 1 * TILE_SIZE + TILE_SIZE / 2, 8 * TILE_SIZE + 20, 'black', 12);
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#9c6b4d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    gameData.plots.forEach(plot => {
        const x = plot.gridX * TILE_SIZE;
        const y = plot.gridY * TILE_SIZE;
        
        // Desenha a terra
        ctx.fillStyle = '#805030';
        ctx.fillRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        
        // Desenha a borda do Plot
        ctx.strokeStyle = '#6b432e';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        
        if (plot.isPlanted) {
            const seed = gameData.seeds[plot.seedType];
            
            // Fundo da planta (folhas)
            ctx.fillStyle = '#4CAF50';
            ctx.beginPath();
            ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, TILE_SIZE * 0.25, 0, Math.PI * 2);
            ctx.fill();
            
            // Fruta/Vegetal (Baseado no estágio)
            let size = TILE_SIZE * (plot.growthStage * 0.15 + 0.1); 
            ctx.fillStyle = seed.harvestColor;
            
            if (plot.growthStage === 4) {
                 // Estágio final: Desenho detalhado 
                if (plot.seedType === 'carrot') {
                    // Cenoura
                    ctx.beginPath();
                    ctx.moveTo(x + TILE_SIZE/2, y + TILE_SIZE/4);
                    ctx.lineTo(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.75);
                    ctx.lineTo(x + TILE_SIZE * 0.3, y + TILE_SIZE * 0.75);
                    ctx.closePath();
                    ctx.fill();
                } else {
                    // Outras colheitas (Frutas/Abóboras)
                    ctx.beginPath();
                    ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (plot.growthStage > 0) {
                // Estágios iniciais: Ponto simples
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Indica se foi regado (apenas no jardim)
            if (plot.isWatered) {
                ctx.fillStyle = 'rgba(0, 0, 255, 0.3)';
                ctx.fillRect(x + TILE_SIZE * 0.7, y + TILE_SIZE * 0.7, TILE_SIZE * 0.25, TILE_SIZE * 0.25);
            }
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
    saveGame(); 
    
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
        sceneChanger.textContent = "Falar com o Vendedor"; 
        sceneChanger.onclick = () => openModal("Vendedor de Colheitas", renderSellerModal());
        sceneChanger.style.display = 'block';
    } else if (tile === 4) { 
        sceneChanger.textContent = "Entrar na Loja de Sementes";
        sceneChanger.onclick = () => openModal("Loja de Sementes", renderSeedShop());
        sceneChanger.style.display = 'block';
    } else if (tile === 5) { 
        sceneChanger.textContent = "Entrar na Loja de Equipamentos";
        sceneChanger.onclick = () => openModal("Loja de Equipamentos", renderGearShop());
        sceneChanger.style.display = 'block';
    } else if (tile === 6) { 
        sceneChanger.textContent = "Entrar na Loja de Ovos (Pets)";
        sceneChanger.onclick = () => openModal("Loja de Ovos (Pets)", renderEggShop());
        sceneChanger.style.display = 'block';
    }
}

// --- 5. FUNÇÕES DE SALVAR E CARREGAR ---

function saveGame() {
    try {
        gameData.lastSaveTime = Date.now(); 
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
            
            // Mescla dados salvos com dados iniciais para evitar erros de novas chaves
            const mergedSeeds = { ...INITIAL_DATA.seeds, ...loadedData.seeds };
            const mergedHarvestInventory = { ...INITIAL_DATA.harvestInventory, ...loadedData.harvestInventory };
            
            // Sobrescreve as chaves específicas com os dados carregados
            gameData = { ...gameData, ...loadedData }; 
            gameData.seeds = mergedSeeds;
            gameData.harvestInventory = mergedHarvestInventory;
            
            if (gameData.lastSaveTime) {
                const timeOfflineSeconds = (Date.now() - gameData.lastSaveTime) / 1000;
                simulateOfflineGrowth(timeOfflineSeconds); 
            }
            
            updateStats();
            return true;
        }
    } catch (e) {
        console.error("Erro ao carregar o jogo:", e);
    }
    return false;
}

function simulateOfflineGrowth(timeOfflineSeconds) {
    gameData.plots.forEach(plot => {
        if (plot.isPlanted) {
            // Adiciona o tempo offline ao tempo de crescimento original
            plot.growthStart -= timeOfflineSeconds * 1000; 
            checkGrowth();
        }
    });
}


// --- 6. ADMIN, CRESCIMENTO E COLHEITA ---
function executeAdminCommand(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const command = parts[0].toLowerCase().replace('/', '');
    const arg1 = parts[1] ? parts[1].toLowerCase() : null;
    const arg2 = parts[2] ? parts[2].toLowerCase() : null;
    const value = parseInt(parts[3]) || 0;
    let output = '';

    if (command === 'give' && arg1 === 'money' && value > 0) {
        gameData.money += value;
        output = `Adicionado ${value} Sheckles.`;
    } else if (command === 'max' && arg1 === 'all') {
        gameData.money = 999999;
        output = "Tudo maximizado.";
    } else if (command === 'stock' && ['seed', 'gear', 'egg', 'harvest'].includes(arg1) && arg2 && value >= 0) {
        
        let targetList;
        let itemName;

        if (arg1 === 'seed') {
            targetList = gameData.seeds;
            itemName = Object.keys(targetList).find(key => key.toLowerCase().includes(arg2));
            if (itemName && targetList[itemName].maxStock !== undefined) {
                targetList[itemName].currentStock = value;
                output = `Estoque da semente **${targetList[itemName].name}** definido para **${value}**.`;
            }
        } else if (arg1 === 'gear') {
            targetList = GEAR;
            itemName = Object.keys(targetList).find(key => key.toLowerCase().includes(arg2));
            if (itemName) {
                gameData.inventory[itemName] = value; 
                output = `Você recebeu **${value}** x **${GEAR[itemName].name}** no inventário.`;
            }
        } else if (arg1 === 'harvest') { 
            targetList = gameData.harvestInventory;
            itemName = Object.keys(targetList).find(key => key.toLowerCase().includes(arg2));
            if (itemName) {
                gameData.harvestInventory[itemName] = value;
                output = `Inventário de colheita **${gameData.seeds[itemName].name}** definido para **${value}**.`;
            }
        }
        
        if (!itemName) {
            output = `Erro: Item **${arg2}** não encontrado em ${arg1} shop.`;
        }
    } else {
        output = `Comando Admin inválido. Tente: /give money 1000, /max all, /stock seed carrot 99 ou /stock harvest carrot 10`;
    }
    
    saveGame(); 
    adminOutput.textContent = output;
    updateStats();
}

function updateStats() {
    moneySpan.textContent = gameData.money.toFixed(2);
    // Adicionado o regador ao cálculo do total de gear
    let gearCount = (gameData.inventory.basicSprinkler || 0) + (gameData.inventory.proSprinkler || 0) + (gameData.inventory.wateringCan || 0);
    sprinklerCountSpan.textContent = gearCount; 
    
    petNameSpan.textContent = gameData.pet.name;
    petBonusSpan.textContent = `x${gameData.pet.bonus.toFixed(2)}`;
    
    // Se o modal de venda estiver aberto, atualiza-o
    if (shopInteractionModal.style.display === 'block' && modalTitle.textContent === "Vendedor de Colheitas") {
        modalContent.innerHTML = renderSellerModal();
    }
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
        plot.isWatered = false; // Novo: Plantar remove o estado de regado
        
        saveGame(); 
        updateStats();
        return true;
    }
    alert(`Erro ao plantar: Verifique se você tem dinheiro (${seed.cost}¢) e sementes (${seed.count})!`);
    return false;
}

function checkGrowth() {
    const now = Date.now();
    let wasGrowth = false;
    gameData.plots.forEach(plot => {
        if (plot.isPlanted && plot.growthStage < 4) {
            const seed = gameData.seeds[plot.seedType];
            let growTime = seed.growTime;
            
            // Opcional: Crescimento mais rápido se regado
            if (plot.isWatered) {
                growTime *= 0.8; // Cresce 20% mais rápido se regado
            }
            
            const timeElapsedSeconds = (now - plot.growthStart) / 1000;
            let progress = timeElapsedSeconds / growTime;
            let newStage = Math.min(4, Math.floor(progress * 4));
            
            if (newStage !== plot.growthStage) {
                plot.growthStage = newStage;
                wasGrowth = true;
            }
        }
    });
    if(wasGrowth) {
        saveGame(); 
    }
}

function harvestPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (plot.isPlanted && plot.growthStage >= 4) {
        const seedType = plot.seedType;
        const seed = gameData.seeds[seedType];
        
        gameData.harvestInventory[seedType] = (gameData.harvestInventory[seedType] || 0) + 1;
        
        plot.isPlanted = false;
        plot.seedType = null;
        plot.growthStart = 0;
        plot.growthStage = 0;
        plot.isWatered = false;

        saveGame(); 
        updateStats();
        alert(`Você colheu 1x ${seed.name} e adicionou ao seu inventário!`);
        return true;
    }
    return false;
}

// Novo: Função para regar
function waterPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (plot.isPlanted && !plot.isWatered) {
        plot.isWatered = true;
        saveGame();
        return true;
    }
    return false;
}

waterButton.addEventListener('click', () => {
    if ((gameData.inventory.wateringCan || 0) <= 0) {
        alert("Você precisa de um Regador Básico para fazer isso!");
        return;
    }
    
    // Rega o plot que está mais próximo do jogador (simulação simples)
    const pX = gameData.player.x + PLAYER_SIZE / 2;
    const pY = gameData.player.y + PLAYER_SIZE / 2;
    
    const targetPlot = gameData.plots.find(plot => {
        const plotX = plot.gridX * TILE_SIZE + TILE_SIZE / 2;
        const plotY = plot.gridY * TILE_SIZE + TILE_SIZE / 2;
        const distance = Math.sqrt((pX - plotX)**2 + (pY - plotY)**2);
        
        // Rega apenas o plot mais próximo se estiver a até 60px de distância
        return distance < 60 && plot.isPlanted && !plot.isWatered;
    });

    if (targetPlot) {
        targetPlot.isWatered = true;
        saveGame();
        alert(`Você regou a parcela em (${targetPlot.gridX}, ${targetPlot.gridY})!`);
    } else {
        alert("Nenhuma planta precisa ser regada por perto.");
    }
});


// --- 7. FUNÇÕES DE LOJA E MODAL (ADAPTAÇÃO DE VENDA) ---

function renderSeedShop() {
    let html = '';
    const rarities = { 'common': 'Comum', 'rare': 'Rara', 'epic': 'Épica' };
    
    Object.keys(gameData.seeds).forEach(key => {
        const seed = gameData.seeds[key];
        const disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        html += `<div class="shop-item" style="border: 1px solid #ddd; margin: 5px; padding: 5px;">
            <span><strong>${seed.name}</strong> (${rarities[seed.rarity]}) - **${seed.cost}¢**</span>
            <br><small>Estoque: ${seed.currentStock} | Seu: ${seed.count}</small>
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
        saveGame(); 
    }
    updateStats();
}

function renderGearShop() {
    let html = '';
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const disabled = gameData.money < gearItem.cost;
        html += `<div class="shop-item" style="border: 1px solid #ddd; margin: 5px; padding: 5px;">
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
        saveGame(); 
    }
    updateStats();
}


function renderEggShop() {
    let html = '';
    Object.keys(EGGS).forEach(key => {
        const eggItem = EGGS[key];
        const disabled = gameData.money < eggItem.cost;
        
        // Lista os pets possíveis
        const possiblePets = eggItem.pets.map((p, i) => `${PETS[p].name} (${(eggItem.chance[i]*100).toFixed(0)}%)`).join(', ');

        html += `<div class="shop-item" style="border: 1px solid #ddd; margin: 5px; padding: 5px;">
            <span><strong>${eggItem.name}</strong> (${eggItem.cost}¢)</span>
            <br><small>Pode chocar: ${possiblePets}</small>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyAndHatchEgg('${key}')">Comprar & Chocar</button>
        </div>`;
    });
    return html;
}
function buyAndHatchEgg(eggKey) {
    const egg = EGGS[eggKey];
    if (gameData.money >= egg.cost) {
        gameData.money -= egg.cost;
        
        // Lógica de sorteio para chocar
        const rand = Math.random();
        let cumulativeChance = 0;
        let petKey = egg.pets[0];
        
        for (let i = 0; i < egg.pets.length; i++) {
            cumulativeChance += egg.chance[i];
            if (rand <= cumulativeChance) {
                petKey = egg.pets[i];
                break;
            }
        }
        
        gameData.pet = PETS[petKey]; 
        alert(`Parabéns! Você chocou um(a) ${gameData.pet.name}!`);
        document.getElementById('modalContent').innerHTML = renderEggShop();
        saveGame(); 
    }
    updateStats();
}

function renderSellerModal() {
    const petBonus = gameData.pet.bonus;
    let html = `
        <p>Olá! Eu compro suas colheitas.</p>
        <p>Seu Pet (${gameData.pet.name}) lhe dá um bônus de **x${petBonus.toFixed(2)}** no preço base!</p>
        <hr>
    `;
    let itemsFound = false;

    Object.keys(gameData.harvestInventory).forEach(key => {
        const count = gameData.harvestInventory[key];
        const seed = gameData.seeds[key];
        
        if (count > 0) {
            itemsFound = true;
            const price = (seed.sellValue * petBonus).toFixed(2);
            
            html += `<div class="shop-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 5px;">
                <span>
                    <strong>${seed.name}</strong> (${seed.sellValue}¢ base / **${price}¢ com bônus**)
                    <br>Em Estoque: <span id="count-${key}">**${count}**</span>
                </span>
                <input type="number" id="qty-${key}" value="1" min="1" max="${count}" style="width: 50px; margin-right: 10px;">
                <button class="buy-button" onclick="sellItems('${key}')">Vender</button>
            </div>`;
        }
    });

    if (!itemsFound) {
        html += `<p style="color: gray;">Seu inventário de colheitas está vazio. Vá colher!</p>`;
    }

    return html;
}

function sellItems(itemKey) {
    const inputId = `qty-${itemKey}`;
    const qtyElement = document.getElementById(inputId);
    
    if (!qtyElement) return;

    const qtyToSell = parseInt(qtyElement.value);
    const available = gameData.harvestInventory[itemKey];

    if (qtyToSell <= 0 || qtyToSell > available) {
        alert("Quantidade inválida para venda.");
        return;
    }

    const seed = gameData.seeds[itemKey];
    const petBonus = gameData.pet.bonus;
    const finalPricePerUnit = seed.sellValue * petBonus;
    const totalValue = finalPricePerUnit * qtyToSell;

    gameData.money += totalValue;
    gameData.harvestInventory[itemKey] -= qtyToSell;
    
    alert(`Vendido ${qtyToSell}x ${seed.name} por ${totalValue.toFixed(2)} Sheckles!`);
    document.getElementById('modalContent').innerHTML = renderSellerModal(); 
    
    saveGame(); 
    updateStats();
}


function openModal(title, contentHTML) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalContent').innerHTML = contentHTML;
    document.getElementById('shopInteractionModal').style.display = 'block';
    updateStats(); 
}

// --- 8. LISTENERS ---
closeModalButton.addEventListener('click', () => { 
    shopInteractionModal.style.display = 'none'; 
    saveGame(); 
});

adminButtonMap.addEventListener('click', () => {
    if (adminPanel.style.display === 'block') {
        adminPanel.style.display = 'none'; 
    } else {
        const enteredPassword = prompt("Digite a senha de administrador:");
        if (enteredPassword === ADMIN_PASSWORD) {
            adminPanel.style.display = 'block';
            adminOutput.textContent = "Logado como Admin. Senha: ArthurSigmaBoy123";
        } else {
            alert("Senha incorreta!");
            adminPanel.style.display = 'none';
        }
    }
});

runCommandButton.addEventListener('click', () => {
    executeAdminCommand(adminCommandInput.value);
    adminCommandInput.value = '';
});

harvestAllButton.addEventListener('click', () => {
    let harvestedCount = 0;
    gameData.plots.forEach((_, index) => {
        if (harvestPlot(index)) {
            harvestedCount++;
        }
    });
    if (harvestedCount > 0) {
        alert(`Você colheu ${harvestedCount} plantas e as adicionou ao seu inventário!`);
    } else {
        alert("Nenhuma planta pronta para colheita.");
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
        
        // Colheita (adiciona ao inventário)
        if (plot.isPlanted && plot.growthStage >= 4) {
            harvestPlot(plotIndex);
            return; 
        }
        
        // Plantio
        if (!plot.isPlanted) {
            const seedChoices = Object.keys(gameData.seeds).map((key, index) => `${index + 1} - ${gameData.seeds[key].name} (${gameData.seeds[key].count} no inventário)`).join('\n');
            let choice = prompt(`Plantar (Digite o número):\n${seedChoices}\n`);
            
            const seedKeys = Object.keys(gameData.seeds);
            const index = parseInt(choice) - 1;

            if (index >= 0 && index < seedKeys.length) {
                plantSeed(seedKeys[index], plotIndex);
            } else if (choice !== null && choice !== '') {
                alert("Seleção inválida.");
            }
        }
    }
});

// Salva o jogo a cada 30 segundos
setInterval(saveGame, 30000); 


// --- 9. LOOP PRINCIPAL E INICIALIZAÇÃO ---

function gameLoop() {
    handlePlayerMovement();
    
    checkGrowth(); 

    if (gameData.currentScene === 'map') {
        drawMap();
    } else {
        drawGarden();
    }
    requestAnimationFrame(gameLoop);
}

window.onload = function() {
    if (!loadGame()) {
        gameData = JSON.parse(JSON.stringify(INITIAL_DATA));
    }
    
    setupJoystick();
    changeScene(gameData.currentScene); 
    updateStats();
    gameLoop();
        }
