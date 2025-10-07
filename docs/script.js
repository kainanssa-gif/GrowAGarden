// --- 1. CONFIGURAÇÕES E DADOS GLOBAIS ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 40;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const PLAYER_SIZE = 25;
const INITIAL_GARDEN_WIDTH = 4;
const INITIAL_GARDEN_HEIGHT = 4;

// CHAVE DE SALVAMENTO
const SAVE_KEY = "GrowAGardenSave"; 
const ADMIN_PASSWORD = "ArthurSigmaBoy123"; 
const RESTOCK_INTERVAL = 3 * 60 * 1000; // 3 minutos em milissegundos
const EXPANSION_COST = 2000;
const MAX_EXPANSION = 3; // Máximo de 3 expansões em cada eixo (X e Y)

let isMoving = false;
let keysPressed = {}; 
let lastRestockTime = Date.now(); 

// Variáveis para carregar as imagens
const SEED_IMAGES = {}; 
const OTHER_IMAGES = {}; // Para imagens como a Placa de Expansão
let imagesLoaded = 0;
let totalImages = 0;

// Variáveis do Joystick (Toque)
const MAX_DISTANCE = 50; 
let activeTouchId = null; 
let joystickStartX = 0;
let joystickStartY = 0;

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

// --- PETS ---
const PETS = { 
    none: { name: 'Nenhum', bonus: 1.0, ability: 'none', color: '#606060', chance: 0 }, 
    bunny: { name: 'Coelho', bonus: 1.1, ability: 'harvest', color: '#f5f5dc', chance: 0.50 }, 
    fox: { name: 'Raposa', bonus: 1.25, ability: 'harvest', color: '#ff4500', chance: 0.30 },
    dragon: { name: 'Dragão', bonus: 1.5, ability: 'harvest', color: '#b22222', chance: 0.10 },
    goldenLab: { name: 'Lab. Dourado', bonus: 1.0, ability: 'mutation_boost', color: '#ffd700', chance: 0.08 },
    phoenix: { name: 'Fênix', bonus: 1.0, ability: 'water_time', color: '#ff4500', chance: 0.02 }
};

// --- EGGS ---
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

// --- GEAR (Com Reclaimer) ---
const GEAR = { 
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto", maxStock: 5, currentStock: 5, restockChance: 1.0 }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto", maxStock: 2, currentStock: 2, restockChance: 0.5 },
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas", maxStock: 10, currentStock: 10, restockChance: 1.0, isTool: true },
    reclaimer: { name: 'Reclaimer', cost: 500, description: "Remove a semente do jardim, retornando-a.", maxStock: 5, currentStock: 5, restockChance: 0.8, isTool: true } 
};

// URL para a Placa de Expansão
const EXPANSION_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/expansao_garden.png';

// --- SEMENTES (Com slots de plantio e IMAGENS) ---
const SEEDS_DATA = {
    // Comuns (1x1)
    carrot: { 
        name: 'Cenoura Comum', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, 
        color: '#ff9800', type: 'single', harvestColor: '#ff9800', rarity: 'common', restockChance: 1.0, slots: 1,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot.png' 
    },
    pumpkin: { 
        name: 'Abóbora Comum', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, 
        color: '#ff5722', type: 'single', harvestColor: '#ff5722', rarity: 'common', restockChance: 1.0, slots: 1,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkim.png' 
    },
    
    // Raras (1x1)
    blueBerry: { 
        name: 'Mirtilo Raro', cost: 400, sellValue: 800, growTime: 15, count: 0, maxStock: 4, currentStock: 4, 
        color: '#4169e1', type: 'multi', harvestColor: '#4169e1', rarity: 'rare', restockChance: 0.8, slots: 1, 
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Blueberry.png' 
    },
    moonFlower: { 
        name: 'Flor Lunar Rara', cost: 800, sellValue: 1800, growTime: 25, count: 0, maxStock: 2, currentStock: 2, 
        color: '#e0ffff', type: 'single', harvestColor: '#e0ffff', rarity: 'rare', restockChance: 0.8, slots: 1,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Lunar_bloom.png' 
    },
    
    // Épicas (1x1 e 2x2)
    goldenMelon: { 
        name: 'Melancia Dourada', cost: 2000, sellValue: 5000, growTime: 40, count: 0, maxStock: 1, currentStock: 1, 
        color: '#ffd700', type: 'single', harvestColor: '#ffd700', rarity: 'epic', restockChance: 0.5, slots: 1,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Golden_melon.png' 
    },
    starFruit: { 
        name: 'Carambola Estelar', cost: 1500, sellValue: 3500, growTime: 35, count: 0, maxStock: 1, currentStock: 1, 
        color: '#fdfd96', type: 'multi', harvestColor: '#fdfd96', rarity: 'epic', restockChance: 0.5, slots: 4, // 4 SLOTS (2x2)
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Star_fruit.png' 
    },

    // Lendárias (1x1 e 2x2)
    shadowBloom: { 
        name: 'Flor Sombra', cost: 5000, sellValue: 12000, growTime: 60, count: 0, maxStock: 1, currentStock: 1, 
        color: '#301934', type: 'single', harvestColor: '#301934', rarity: 'legendary', restockChance: 0.3, slots: 1,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Shadow_bloom.png' 
    },
    crystalGrape: { 
        name: 'Uva de Cristal', cost: 7500, sellValue: 18000, growTime: 70, count: 0, maxStock: 1, currentStock: 1, 
        color: '#e6e6fa', type: 'multi', harvestColor: '#e6e6fa', rarity: 'legendary', restockChance: 0.3, slots: 4, // 4 SLOTS (2x2)
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Crystal_grape.png' 
    },

    // Míticas (2x2) - Nomes e URLs atualizados
    solarMango: { 
        name: 'Solar Fruit', cost: 15000, sellValue: 35000, growTime: 90, count: 0, maxStock: 1, currentStock: 1, 
        color: '#ff8c00', type: 'multi', harvestColor: '#ff8c00', rarity: 'mythic', restockChance: 0.1, slots: 4, // 4 SLOTS (2x2)
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Solar_fruit.png' 
    },
    voidApple: { 
        name: 'Maçã de Tinta', cost: 20000, sellValue: 50000, growTime: 120, count: 0, maxStock: 1, currentStock: 1, 
        color: '#000000', type: 'multi', harvestColor: '#000000', rarity: 'mythic', restockChance: 0.1, slots: 4, // 4 SLOTS (2x2)
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Painty_apple.png' 
    },
    
    // Mítica Suprema (2x2)
    cosmicDust: { 
        name: 'Poeira Cósmica', cost: 50000, sellValue: 150000, growTime: 180, count: 0, maxStock: 1, currentStock: 1, 
        color: '#8a2be2', type: 'multi', harvestColor: '#8a2be2', rarity: 'supreme', restockChance: 0.05, slots: 4, // 4 SLOTS (2x2)
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_dust.png' 
    },
};

// Função de pré-carregamento de imagens
function loadImages() {
    // Carrega Sementes
    totalImages = Object.keys(SEEDS_DATA).length + 1; // +1 para a placa de expansão
    for (const key in SEEDS_DATA) {
        const url = SEEDS_DATA[key].imageURL;
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
        };
        img.onerror = () => {
             console.error(`Falha ao carregar a imagem para ${key}: ${url}. Usando fallback de cor.`);
            imagesLoaded++; 
        };
        img.src = url;
        SEED_IMAGES[key] = img;
    }
    
    // Carrega Placa de Expansão
    const expansionImg = new Image();
    expansionImg.onload = () => {
        imagesLoaded++;
    };
    expansionImg.onerror = () => {
        console.error(`Falha ao carregar a Placa de Expansão: ${EXPANSION_IMAGE_URL}. Usando fallback de cor.`);
        imagesLoaded++;
    };
    expansionImg.src = EXPANSION_IMAGE_URL;
    OTHER_IMAGES.expansionPlate = expansionImg;
}

// Inicializa o carregamento das imagens
loadImages();

// Dados iniciais
const INITIAL_DATA = {
    money: 100,
    inventory: { basicSprinkler: 0, proSprinkler: 0, wateringCan: 1, reclaimer: 0 }, // Reclaimer no inventário inicial
    harvestInventory: {},
    seeds: JSON.parse(JSON.stringify(SEEDS_DATA)), // CÓPIA PROFUNDA
    plots: [],
    pet: PETS.none,
    currentScene: 'map', 
    selectedItem: 'none', // Item selecionado: 'wateringCan', 'reclaimer', 'none'
    gardenExpansion: { x: 0, y: 0 }, 
    player: { 
        x: 1 * TILE_SIZE, 
        y: 8 * TILE_SIZE, 
        speed: 4, dx: 0, dy: 0, lastMove: 0, animationFrame: 0, color: '#606060' 
    },
    masterPlots: {} 
};

// Função para criar o array inicial de plots
function initializePlots(gardenWidth, gardenHeight) {
    const plots = [];
    for (let y = 0; y < gardenHeight; y++) {
        for (let x = 0; x < gardenWidth; x++) {
            plots.push({
                gridX: x, 
                gridY: y, 
                isPlanted: false, 
                seedType: null, 
                growthStart: 0, 
                growthStage: 0, 
                isMutated: false, 
                isWatered: false, 
                waterStages: 1,
                isMaster: false, 
                masterPlotIndex: -1 
            });
        }
    }
    return plots;
}

let gameData = JSON.parse(JSON.stringify(INITIAL_DATA));

// Recria os plots na inicialização
gameData.plots = initializePlots(INITIAL_GARDEN_WIDTH, INITIAL_GARDEN_HEIGHT);

// --- 2. REFERÊNCIAS DO DOM ---
const moneySpan = document.getElementById('money');
const sprinklerCountSpan = document.getElementById('sprinklerCount');
const petNameSpan = document.getElementById('petName');
const petBonusSpan = document.getElementById('petBonus');

const inventoryTools = document.getElementById('inventoryTools'); // Novo container para ferramentas

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

// Elementos do Joystick
const joystickContainer = document.getElementById('joystick-container');
const joystick = document.getElementById('joystick');


// --- 3. LÓGICA DE MOVIMENTO E DESENHO ---

function getCurrentGardenDimensions() {
    return {
        width: INITIAL_GARDEN_WIDTH + gameData.gardenExpansion.x,
        height: INITIAL_GARDEN_HEIGHT + gameData.gardenExpansion.y
    };
}

function getGardenOffset() {
    const { width, height } = getCurrentGardenDimensions();
    return {
        offsetX: (CANVAS_WIDTH - width * TILE_SIZE) / 2,
        offsetY: (CANVAS_HEIGHT - height * TILE_SIZE) / 2
    };
}

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
            let color = '#556b2f'; 

            if (tileType === 1) { 
                color = '#8b4513';
            } else if (tileType === 2) { 
                color = '#006400'; 
                drawText('JARDIM', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 3) { 
                color = '#ff6347'; 
                drawText('VENDER', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 4) { 
                color = '#4682b4';
                drawText('SEMENTES', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            } else if (tileType === 5) { 
                color = '#ffd700';
                drawText('EQUIP.', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'black', 10);
            } else if (tileType === 6) { 
                color = '#ba55d3';
                drawText('OVO/PET', x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE + TILE_SIZE / 2 + 5, 'white', 10);
            }

            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.color);
}

function drawPlayer(x, y, color) {
    const p = gameData.player;
    const bodySize = 15; 
    const legWidth = 4;
    const legHeight = 8;
    const eyeSize = 2;
    const frame = p.animationFrame % 2; 
    
    // Cor do corpo
    ctx.fillStyle = color;
    
    // Corpo (Quadrado)
    ctx.fillRect(x + (PLAYER_SIZE - bodySize) / 2, y + 2, bodySize, bodySize);

    // Olhos (2px)
    ctx.fillStyle = 'white';
    ctx.fillRect(x + PLAYER_SIZE / 2 - 4, y + 5, eyeSize, eyeSize); // Olho Esquerdo
    ctx.fillRect(x + PLAYER_SIZE / 2 + 2, y + 5, eyeSize, eyeSize); // Olho Direito
    
    // Desenho das pernas (animação)
    ctx.fillStyle = '#444'; 
    const legY = y + 2 + bodySize;

    if (isMoving) {
        if (frame === 0) { 
            ctx.fillRect(x + PLAYER_SIZE / 2 - legWidth - 1, legY + 2, legWidth, legHeight); 
            ctx.fillRect(x + PLAYER_SIZE / 2 + 1, legY, legWidth, legHeight);          
        } else { 
            ctx.fillRect(x + PLAYER_SIZE / 2 - legWidth - 1, legY, legWidth, legHeight);        
            ctx.fillRect(x + PLAYER_SIZE / 2 + 1, legY + 2, legWidth, legHeight); 
        }
    } else {
        // Posição de repouso
        ctx.fillRect(x + PLAYER_SIZE / 2 - legWidth - 1, legY + 1, legWidth, legHeight);
        ctx.fillRect(x + PLAYER_SIZE / 2 + 1, legY + 1, legWidth, legHeight);
    }

    // Avança o frame da animação (a cada 50ms)
    if (isMoving && Date.now() - p.lastMove > 50) { 
        p.animationFrame++;
        p.lastMove = Date.now();
    }
    
    // Desenha o item selecionado (Simples)
    if (gameData.selectedItem !== 'none') {
        ctx.fillStyle = gameData.selectedItem === 'wateringCan' ? '#4682b4' : '#696969'; // Azul ou Cinza
        // Desenha um pequeno quadrado na mão do player
        ctx.fillRect(x + bodySize, y + bodySize / 2, 5, 5);
    }
}


function drawPlot(plot, offsetX, offsetY, plotIndex) {
    const x = plot.gridX * TILE_SIZE + offsetX;
    const y = plot.gridY * TILE_SIZE + offsetY;
    const isMaster = plot.isMaster;
    const seed = plot.seedType ? SEEDS_DATA[plot.seedType] : null;
    const maxGrowth = 100;
    const growthPercent = plot.growthStage / maxGrowth;

    if (seed && seed.slots === 4 && plot.masterPlotIndex !== plotIndex) {
        return; 
    }

    // 1. Desenha o terreno
    let soilColor = plot.isWatered ? '#8b4513' : '#a0522d'; 
    ctx.fillStyle = soilColor;
    
    if (seed && seed.slots === 4 && isMaster) {
         ctx.fillRect(x, y, TILE_SIZE * 2, TILE_SIZE * 2); 
    } else {
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    }
    

    // 2. Desenha a plantação
    if (plot.isPlanted && seed) {
        const drawX = x;
        const drawY = y;
        const drawSize = seed.slots === 4 ? TILE_SIZE * 2 : TILE_SIZE;

        // Crescimento
        if (plot.growthStage < maxGrowth) {
            // Desenho do estágio de crescimento (cruz ou ponto + barra de progresso)
            ctx.fillStyle = 'green';
            if (seed.slots === 4) {
                // Pontos 2x2
                ctx.fillRect(drawX + TILE_SIZE * 0.5, drawY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, TILE_SIZE * 0.1); 
                ctx.fillRect(drawX + TILE_SIZE * 1.4, drawY + TILE_SIZE * 0.5, TILE_SIZE * 0.1, TILE_SIZE * 0.1); 
                ctx.fillRect(drawX + TILE_SIZE * 0.5, drawY + TILE_SIZE * 1.4, TILE_SIZE * 0.1, TILE_SIZE * 0.1); 
                ctx.fillRect(drawX + TILE_SIZE * 1.4, drawY + TILE_SIZE * 1.4, TILE_SIZE * 0.1, TILE_SIZE * 0.1); 
            } else {
                // Ponto 1x1
                ctx.beginPath();
                ctx.arc(drawX + TILE_SIZE / 2, drawY + TILE_SIZE / 2, TILE_SIZE / 10, 0, Math.PI * 2);
                ctx.fill();
            }

            // Barra de progresso 
            ctx.fillStyle = '#f0f0f0'; 
            ctx.fillRect(drawX + 2, drawY + drawSize - 8, drawSize - 4, 6);
            ctx.fillStyle = 'green'; 
            ctx.fillRect(drawX + 2, drawY + drawSize - 8, (drawSize - 4) * growthPercent, 6);
            
        } 
        // Pronto para colher (Desenha Imagem)
        else {
            const img = SEED_IMAGES[plot.seedType];
             if (img && img.complete) {
                ctx.drawImage(img, drawX, drawY, drawSize, drawSize);
            } else {
                // Fallback (círculo grande)
                ctx.fillStyle = seed.harvestColor;
                ctx.beginPath();
                ctx.arc(drawX + drawSize / 2, drawY + drawSize / 2, drawSize / 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
}


function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const { width, height } = getCurrentGardenDimensions();
    const { offsetX, offsetY } = getGardenOffset();
    
    // 1. Desenha o fundo da área do jardim
    ctx.fillStyle = '#8fbc8f'; 
    ctx.fillRect(offsetX - TILE_SIZE, offsetY - TILE_SIZE, (width + 2) * TILE_SIZE, (height + 2) * TILE_SIZE);
    
    // 2. Desenha os plots
    for (let i = 0; i < gameData.plots.length; i++) {
        drawPlot(gameData.plots[i], offsetX, offsetY, i);
    }
    
    // 3. Desenha as Placas de Expansão (COM A IMAGEM)
    drawExpansionPlates(offsetX, offsetY, width, height);

    // 4. Desenha o player
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.color);

    if (imagesLoaded < totalImages) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        drawText('Carregando Artes...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, 'white', 16);
    }
}

function drawExpansionPlates(offsetX, offsetY, width, height) {
    const expansionImg = OTHER_IMAGES.expansionPlate;
    const drawImg = (x, y) => {
        if (expansionImg && expansionImg.complete) {
            ctx.drawImage(expansionImg, x, y, TILE_SIZE, TILE_SIZE);
        } else {
            // Fallback: Placa marrom com texto
            ctx.fillStyle = '#d2b48c'; 
            ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        }
        drawText(`$${EXPANSION_COST}`, x + TILE_SIZE / 2, y + TILE_SIZE / 2 + 5, 'black', 10);
    };

    // Placa da direita (Expansão X)
    if (gameData.gardenExpansion.x < MAX_EXPANSION) {
        const x = offsetX + width * TILE_SIZE;
        const y = offsetY + height * TILE_SIZE / 2 - TILE_SIZE / 2;
        drawImg(x, y);
    }
    
    // Placa de baixo (Expansão Y)
    if (gameData.gardenExpansion.y < MAX_EXPANSION) {
        const x = offsetX + width * TILE_SIZE / 2 - TILE_SIZE / 2;
        const y = offsetY + height * TILE_SIZE;
        drawImg(x, y);
    }
}


function gameLoop() {
    updateGame();
    if (gameData.currentScene === 'map') {
        drawMap();
    } else if (gameData.currentScene === 'garden') {
        drawGarden();
    }
    requestAnimationFrame(gameLoop);
}

// --- 4. LÓGICA DO JOGO ---

function updateGame() {
    updatePlayerMovement();
    updatePlots();
    checkRestock();
    updateUI();
}

function updatePlayerMovement() {
    const player = gameData.player;
    
    // Reseta o isMoving se o movimento não estiver vindo do teclado ou toque
    if (player.dx === 0 && player.dy === 0) {
        isMoving = false;
    } else {
         isMoving = true;
    }

    let newX = player.x + player.dx;
    let newY = player.y + player.dy;

    // Colisão no modo Mapa
    if (gameData.currentScene === 'map' && checkCollision(newX, newY, 1)) {
        player.dx = 0;
        player.dy = 0;
        isMoving = false;
    } 
    // Colisão no modo Jardim (sempre centraliza no canvas, sem colisão com tiles, mas com borda)
    else if (gameData.currentScene === 'garden') {
        const { width: gardenW, height: gardenH } = getCurrentGardenDimensions();
        const { offsetX, offsetY } = getGardenOffset();

        const minX = offsetX - TILE_SIZE + PLAYER_SIZE / 2;
        const maxX = offsetX + gardenW * TILE_SIZE + TILE_SIZE - PLAYER_SIZE * 1.5;
        const minY = offsetY - TILE_SIZE + PLAYER_SIZE / 2;
        const maxY = offsetY + gardenH * TILE_SIZE + TILE_SIZE - PLAYER_SIZE * 1.5;

        newX = Math.max(minX, Math.min(maxX, newX));
        newY = Math.max(minY, Math.min(maxY, newY));
    }
    
    player.x = newX;
    player.y = newY;
}

function checkCollision(x, y, tileType) {
    const corners = [
        [x, y],
        [x + PLAYER_SIZE - 1, y],
        [x, y + PLAYER_SIZE - 1],
        [x + PLAYER_SIZE - 1, y + PLAYER_SIZE - 1]
    ];

    for (const [cx, cy] of corners) {
        const gridX = Math.floor(cx / TILE_SIZE);
        const gridY = Math.floor(cy / TILE_SIZE);

        if (gridX >= 0 && gridX < 10 && gridY >= 0 && gridY < 10) {
            if (GAME_MAP[gridY][gridX] === tileType) {
                return true;
            }
        }
    }
    return false;
}

function updatePlots() {
    const now = Date.now();
    const maxGrowth = 100;

    for (let plot of gameData.plots) {
        if (plot.isPlanted && plot.growthStage < maxGrowth) {
            const seed = SEEDS_DATA[plot.seedType];
            
            const growthRatePerMs = maxGrowth / (seed.growTime * 1000); 

            let rate = growthRatePerMs;
            if (plot.isWatered) {
                rate *= 1.5; 
            }
            
            plot.growthStage = Math.min(maxGrowth, plot.growthStage + rate * (now - plot.growthStart));
            plot.growthStart = now; 

            if (plot.isWatered) {
                // A cada 10 segundos, verifica a duração da rega (água evapora)
                if (now % 10000 < 50) { 
                    const waterDuration = (gameData.pet.ability === 'water_time') ? 2 : 1;
                    if (plot.waterStages > waterDuration) {
                        plot.isWatered = false;
                        plot.waterStages = 1;
                    } else {
                        plot.waterStages++;
                    }
                }
            }
        }
    }
}

// 5. Funções de Expansão 
function buyExpansion(axis) {
    if (gameData.money < EXPANSION_COST) {
        alert("Você não tem dinheiro suficiente!");
        return;
    }
    
    if (gameData.gardenExpansion[axis] >= MAX_EXPANSION) {
        alert("Expansão máxima já atingida neste eixo.");
        return;
    }
    
    gameData.money -= EXPANSION_COST;
    
    const { width: oldW, height: oldH } = getCurrentGardenDimensions();
    
    gameData.gardenExpansion[axis] += 1;
    
    const { width: newW, height: newH } = getCurrentGardenDimensions();
    
    const newPlots = initializePlots(newW, newH);
    
    const oldPlots = gameData.plots;
    gameData.plots = newPlots;
    
    for (let oldPlot of oldPlots) {
        const index = oldPlot.gridY * newW + oldPlot.gridX;
        if (index < gameData.plots.length) {
            gameData.plots[index] = oldPlot; 
        }
    }
    
    alert(`Expansão de Jardim ${axis.toUpperCase()} comprada com sucesso! Seu jardim agora é ${newW}x${newH}.`);
    saveGame();
}


// --- 6. FUNÇÕES DE INTERAÇÃO (Jardim) ---

function getPlotIndex(gridX, gridY, width) {
    return gridY * width + gridX;
}

function checkPlantingSpace(x, y, slotsNeeded) {
    if (slotsNeeded === 1) return true; 
    
    const { width, height } = getCurrentGardenDimensions();
    
    if (x + 1 >= width || y + 1 >= height) {
        return false; 
    }
    
    const indices = [
        getPlotIndex(x, y, width),
        getPlotIndex(x + 1, y, width),
        getPlotIndex(x, y + 1, width),
        getPlotIndex(x + 1, y + 1, width)
    ];

    for (const index of indices) {
        const plot = gameData.plots[index];
        if (plot.isPlanted || plot.masterPlotIndex !== -1) {
            return false; 
        }
    }
    
    return true;
}

function plantSeed(plotIndex, seedKey) {
    const plot = gameData.plots[plotIndex];
    const seed = SEEDS_DATA[seedKey];

    if (plot.isPlanted || plot.masterPlotIndex !== -1) {
        alert("Este espaço já está ocupado por outra plantação!");
        return;
    }
    if (gameData.seeds[seedKey].count <= 0) {
        alert("Você não tem mais sementes deste tipo!");
        return;
    }
    
    if (seed.slots === 4) {
        const { width } = getCurrentGardenDimensions();
        const x = plot.gridX;
        const y = plot.gridY;
        
        if (!checkPlantingSpace(x, y, 4)) {
            alert("Sementes grandes (2x2) precisam de 4 espaços vazios em um quadrado!");
            return;
        }
        
        const indices = [
            plotIndex, 
            getPlotIndex(x + 1, y, width),
            getPlotIndex(x, y + 1, width),
            getPlotIndex(x + 1, y + 1, width)
        ];
        
        for (let i = 0; i < indices.length; i++) {
            const currentPlot = gameData.plots[indices[i]];
            currentPlot.isPlanted = true;
            currentPlot.seedType = seedKey;
            currentPlot.growthStart = Date.now();
            currentPlot.growthStage = 0;
            currentPlot.isWatered = false; 
            currentPlot.waterStages = 1;
            currentPlot.isMutated = (gameData.pet.ability === 'mutation_boost' && Math.random() < 0.20);
            
            if (i === 0) {
                currentPlot.isMaster = true; 
                currentPlot.masterPlotIndex = plotIndex;
            } else {
                currentPlot.isMaster = false;
                currentPlot.masterPlotIndex = plotIndex; 
            }
        }
    } 
    else {
        plot.isPlanted = true;
        plot.seedType = seedKey;
        plot.growthStart = Date.now();
        plot.growthStage = 0;
        plot.isWatered = false; 
        plot.waterStages = 1;
        plot.isMaster = true; 
        plot.masterPlotIndex = plotIndex;
        plot.isMutated = (gameData.pet.ability === 'mutation_boost' && Math.random() < 0.20);
    }

    gameData.seeds[seedKey].count--;
    closeModal();
    saveGame();
}

function harvestPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (!plot.isPlanted || plot.growthStage < 100) return;

    const seedKey = plot.seedType;
    const seed = SEEDS_DATA[seedKey];
    
    let baseValue = seed.sellValue;
    let finalValue = baseValue * gameData.pet.bonus;
    
    let harvestCount = (seed.type === 'multi') ? 2 : 1; 

    if (plot.isMutated) {
        finalValue *= 1.5;
    }

    gameData.money += Math.round(finalValue);
    
    gameData.harvestInventory[seedKey] = (gameData.harvestInventory[seedKey] || 0) + harvestCount;

    if (seed.slots === 4) {
        const { width } = getCurrentGardenDimensions();
        const indicesToClear = [
            plotIndex, 
            getPlotIndex(plot.gridX + 1, plot.gridY, width),
            getPlotIndex(plot.gridX, plot.gridY + 1, width),
            getPlotIndex(plot.gridX + 1, plot.gridY + 1, width)
        ];

        for (const index of indicesToClear) {
            clearPlot(index);
        }
    } else {
        clearPlot(plotIndex);
    }
    
    saveGame();
}

function reclaimPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (!plot.isPlanted) {
        alert("Não há semente plantada aqui.");
        return;
    }
    if (plot.growthStage >= 100) {
        alert("Planta madura demais para ser reivindicada! Colha primeiro.");
        return;
    }
    
    const seedKey = plot.seedType;
    const seed = SEEDS_DATA[seedKey];
    
    // Devolve a semente ao inventário
    gameData.seeds[seedKey].count++;
    
    // Limpa os plots (lida com 2x2)
    if (seed.slots === 4) {
        const { width } = getCurrentGardenDimensions();
        const masterPlot = plot.isMaster ? plot : gameData.plots[plot.masterPlotIndex];
        
        const indicesToClear = [
            getPlotIndex(masterPlot.gridX, masterPlot.gridY, width), 
            getPlotIndex(masterPlot.gridX + 1, masterPlot.gridY, width),
            getPlotIndex(masterPlot.gridX, masterPlot.gridY + 1, width),
            getPlotIndex(masterPlot.gridX + 1, masterPlot.gridY + 1, width)
        ];

        for (const index of indicesToClear) {
            clearPlot(index);
        }
    } else {
        clearPlot(plotIndex);
    }
    
    alert(`Semente de ${seed.name} devolvida ao inventário!`);
    saveGame();
}


function clearPlot(index) {
    const plot = gameData.plots[index];
    plot.isPlanted = false;
    plot.seedType = null;
    plot.growthStart = 0;
    plot.growthStage = 0;
    plot.isMutated = false;
    plot.isWatered = false;
    plot.waterStages = 1;
    plot.isMaster = false;
    plot.masterPlotIndex = -1;
}

function waterPlot(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (!plot.isPlanted || plot.isWatered) return;

    let masterPlotIndex = plot.masterPlotIndex !== -1 ? plot.masterPlotIndex : plotIndex;
    const masterPlot = gameData.plots[masterPlotIndex];
    const seed = masterPlot.seedType ? SEEDS_DATA[masterPlot.seedType] : null;

    if (!masterPlot.isPlanted) return;
    
    const waterStages = (gameData.pet.ability === 'water_time') ? 2 : 1;
    
    if (seed.slots === 4) {
        const { width } = getCurrentGardenDimensions();
        const indicesToWater = [
            masterPlotIndex, 
            getPlotIndex(masterPlot.gridX + 1, masterPlot.gridY, width),
            getPlotIndex(masterPlot.gridX, masterPlot.gridY + 1, width),
            getPlotIndex(masterPlot.gridX + 1, masterPlot.gridY + 1, width)
        ];

        for (const index of indicesToWater) {
            gameData.plots[index].isWatered = true;
            gameData.plots[index].waterStages = waterStages;
        }
    } else {
        masterPlot.isWatered = true;
        masterPlot.waterStages = waterStages;
    }
    
    saveGame();
}

function sprinklerTick() {
    if (gameData.currentScene !== 'garden') return;

    const { width, height } = getCurrentGardenDimensions();

    const applySprinkler = (chance) => {
        if (gameData.plots.length === 0) return;
        const randomIndex = Math.floor(Math.random() * gameData.plots.length);
        const plot = gameData.plots[randomIndex];
        if (plot.isPlanted && !plot.isWatered) {
             // Só rega se for master plot ou se for 1x1
            if (plot.isMaster || plot.masterPlotIndex === -1) {
                waterPlot(randomIndex);
            }
        }
    };

    if (gameData.inventory.basicSprinkler > 0) {
        for (let i = 0; i < gameData.inventory.basicSprinkler; i++) {
            if (Math.random() < 0.30) { 
                applySprinkler(0.30);
            }
        }
    }
    if (gameData.inventory.proSprinkler > 0) {
        for (let i = 0; i < gameData.inventory.proSprinkler; i++) {
            if (Math.random() < 0.60) { 
                applySprinkler(0.60);
            }
        }
    }
}


function checkRestock() {
    const now = Date.now();
    if (now - lastRestockTime >= RESTOCK_INTERVAL) {
        lastRestockTime = now;
        
        // Reestoque de Sementes
        for (const key in SEEDS_DATA) {
            const seed = SEEDS_DATA[key];
            if (Math.random() < seed.restockChance) {
                seed.currentStock = seed.maxStock;
            } else {
                 seed.currentStock = Math.min(seed.maxStock, seed.currentStock + 1);
            }
        }
        
        // Reestoque de Equipamentos
        for (const key in GEAR) {
            const gear = GEAR[key];
             if (Math.random() < gear.restockChance) {
                gear.currentStock = gear.maxStock;
            } else {
                 gear.currentStock = Math.min(gear.maxStock, gear.currentStock + 1);
            }
        }
        
        // Reestoque de Ovos
        for (const key in EGGS) {
            const egg = EGGS[key];
             if (Math.random() < egg.restockChance) {
                egg.currentStock = egg.maxStock;
            } else {
                 egg.currentStock = Math.min(egg.maxStock, egg.currentStock + 1);
            }
        }
        
        saveGame();
        console.log("Loja reabastecida!");
    }
}

function closeModal() {
    shopInteractionModal.style.display = 'none';
}

// --- 7. FUNÇÕES DE UI E COMPRA ---

function loadGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    if (savedData) {
        const loadedData = JSON.parse(savedData);
        
        // Correção de Bug: Garante que os objetos internos sejam reatribuídos para evitar referências
        gameData = { 
            ...INITIAL_DATA, 
            ...loadedData,
            seeds: { ...INITIAL_DATA.seeds, ...loadedData.seeds },
            inventory: { ...INITIAL_DATA.inventory, ...loadedData.inventory },
            pet: loadedData.pet || PETS.none, // Garante que o pet seja carregado
        };
        
        // Recria a estrutura de plots com a expansão correta
        const { width, height } = getCurrentGardenDimensions();
        const newPlots = initializePlots(width, height);
        
        for (let i = 0; i < loadedData.plots.length; i++) {
            const oldPlot = loadedData.plots[i];
            const index = oldPlot.gridY * width + oldPlot.gridX;
            if (index < newPlots.length) {
                newPlots[index] = oldPlot;
            }
        }
        gameData.plots = newPlots;
        
        // Corrige a cor do player se ele tiver um pet Dragão (bug de pet)
        if (gameData.pet.name === 'Dragão') {
             gameData.player.color = PETS.dragon.color;
        } else {
             gameData.player.color = PETS.none.color;
        }

    }
    updateUI();
}

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    updateUI();
}

function updateUI() {
    moneySpan.textContent = gameData.money.toFixed(2);
    sprinklerCountSpan.textContent = gameData.inventory.basicSprinkler + gameData.inventory.proSprinkler;
    petNameSpan.textContent = gameData.pet.name;
    petBonusSpan.textContent = gameData.pet.bonus > 1 ? `${(gameData.pet.bonus * 100 - 100).toFixed(0)}%` : 
                               gameData.pet.ability === 'mutation_boost' ? '+20% Muta' : 
                               gameData.pet.ability === 'water_time' ? 'Rega 2x' : 'N/A';
                               
    // Atualiza Botões de Ferramentas
    inventoryTools.innerHTML = '';
    for (const key in GEAR) {
        const item = GEAR[key];
        if (item.isTool && gameData.inventory[key] > 0) {
            const button = document.createElement('button');
            button.className = `tool-button ${gameData.selectedItem === key ? 'selected' : ''}`;
            button.textContent = `${item.name} (${gameData.inventory[key]})`;
            button.onclick = () => selectTool(key);
            inventoryTools.appendChild(button);
        }
    }
}

function selectTool(toolKey) {
    if (gameData.selectedItem === toolKey) {
        gameData.selectedItem = 'none'; // Deselecionar
    } else {
        gameData.selectedItem = toolKey; // Selecionar
    }
    updateUI();
}


function openShopModal(type, title, itemsData) {
    modalTitle.textContent = title;
    modalScrollContent.innerHTML = '';
    
    for (const key in itemsData) {
        const item = itemsData[key];
        const stock = item.currentStock !== undefined ? `Estoque: ${item.currentStock}` : '';
        const inventory = type === 'seeds' ? gameData.seeds[key].count : gameData.inventory[key];
        const invDisplay = ` (Você tem: ${inventory || 0})`;
        const costDisplay = item.cost ? `Custo: ${item.cost}¢` : '';
        const sellDisplay = item.sellValue ? `Vende por: ${item.sellValue}¢` : '';

        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>${costDisplay} ${sellDisplay} ${item.description || ''}</p>
            <p>${stock} ${invDisplay}</p>
            <button onclick="buyItem('${type}', '${key}')">Comprar</button>
        `;
        modalScrollContent.appendChild(itemElement);
    }
    
    shopInteractionModal.style.display = 'block';
}

function buyItem(type, key) {
    const itemData = type === 'seeds' ? SEEDS_DATA[key] : (type === 'gear' ? GEAR[key] : EGGS[key]);
    
    if (itemData.currentStock <= 0) {
        alert("Item esgotado! Tente novamente após o reestoque.");
        return;
    }
    if (gameData.money < itemData.cost) {
        alert("Você não tem dinheiro suficiente!");
        return;
    }

    gameData.money -= itemData.cost;
    itemData.currentStock--; 
    
    // CORREÇÃO DE BUG: Usa gameData.seeds/gameData.inventory para atualizar a contagem do jogador
    if (type === 'seeds') {
        gameData.seeds[key].count++;
    } else if (type === 'gear') {
        gameData.inventory[key] = (gameData.inventory[key] || 0) + 1;
    } else if (type === 'eggs') {
        buyEgg(key, itemData);
    }

    alert(`${itemData.name} comprado(a) com sucesso!`);
    openShopModal(type, modalTitle.textContent, type === 'seeds' ? gameData.seeds : (type === 'gear' ? GEAR : EGGS));
    saveGame();
}

function buyEgg(eggKey, eggData) {
    const rand = Math.random();
    let cumulativeChance = 0;
    let chosenPetKey = 'none';

    for (let i = 0; i < eggData.pets.length; i++) {
        cumulativeChance += eggData.chance[i];
        if (rand < cumulativeChance) {
            chosenPetKey = eggData.pets[i];
            break;
        }
    }
    
    // CORREÇÃO DE BUG: Garante que o pet é equipado corretamente
    gameData.pet = PETS[chosenPetKey]; 

    if (chosenPetKey === 'dragon') {
        gameData.player.color = PETS.dragon.color;
    } else {
        gameData.player.color = PETS.none.color; 
    }
    
    alert(`Seu ${eggData.name} chocou um(a) ${gameData.pet.name}!`);
    saveGame();
}


// --- 8. EVENT LISTENERS DE TECLADO ---

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
    updatePlayerDirectionFromKeys();
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
    updatePlayerDirectionFromKeys();
});

function updatePlayerDirectionFromKeys() {
    const player = gameData.player;
    player.dx = 0;
    player.dy = 0;

    if (keysPressed['w'] || keysPressed['W']) { player.dy = -player.speed; }
    if (keysPressed['s'] || keysPressed['S']) { player.dy = player.speed; }
    if (keysPressed['a'] || keysPressed['A']) { player.dx = -player.speed; }
    if (keysPressed['d'] || keysPressed['D']) { player.dx = player.speed; }
    
    if (player.dx !== 0 && player.dy !== 0) {
        player.dx /= Math.sqrt(2);
        player.dy /= Math.sqrt(2);
    }
    
    isMoving = (player.dx !== 0 || player.dy !== 0);
}

// --- 9. EVENT LISTENERS DE TOQUE (JOYSTICK) ---

joystickContainer.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
document.addEventListener('touchend', handleTouchEnd, false);

function getTouchPos(e) {
    const rect = joystickContainer.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function handleTouchStart(e) {
    if (activeTouchId !== null) return;
    
    const touch = e.changedTouches[0];
    const pos = getTouchPos(touch);
    
    // Verifica se o toque está dentro da área do joystick
    // O container do joystick tem 150x150
    if (pos.x >= 0 && pos.x <= 150 && pos.y >= 0 && pos.y <= 150) {
        activeTouchId = touch.identifier;
        // O ponto de início do toque é usado como centro de referência
        joystickStartX = 75; 
        joystickStartY = 75;
        
        // Move o joystick para o centro para começar o arrasto
        joystick.style.left = '50%';
        joystick.style.top = '50%';
        joystick.style.transform = 'translate(-50%, -50%)';
        
        e.preventDefault(); 
    }
}

function handleTouchMove(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId) {
            const containerRect = joystickContainer.getBoundingClientRect();
            // Calcula a posição do toque relativa ao centro do container (75, 75)
            const touchX = touch.clientX - containerRect.left;
            const touchY = touch.clientY - containerRect.top;

            let deltaX = touchX - joystickStartX;
            let deltaY = touchY - joystickStartY;
            
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            if (distance > MAX_DISTANCE) {
                const ratio = MAX_DISTANCE / distance;
                deltaX *= ratio;
                deltaY *= ratio;
            }
            
            // Move o elemento visual do joystick
            // O centro do container é 75. 
            // O joystick.style.left/top é relativo ao container.
            joystick.style.left = `${75 + deltaX}px`;
            joystick.style.top = `${75 + deltaY}px`;
            joystick.style.transform = 'translate(-50%, -50%)'; // Mantém o centro do joystick no ponto de arrasto
            
            // Atualiza o movimento do player
            const speedFactor = gameData.player.speed / MAX_DISTANCE;
            gameData.player.dx = deltaX * speedFactor;
            gameData.player.dy = deltaY * speedFactor;
            
            isMoving = true;
            break;
        }
    }
}

function handleTouchEnd(e) {
    for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === activeTouchId) {
            activeTouchId = null;
            
            // Centraliza o joystick visualmente
            joystick.style.left = '50%';
            joystick.style.top = '50%';
            joystick.style.transform = 'translate(-50%, -50%)';
            
            // Para o player
            gameData.player.dx = 0;
            gameData.player.dy = 0;
            isMoving = false;
            break;
        }
    }
}


// --- 10. EVENT LISTENERS DIVERSOS (CORRIGIDOS) ---

// --- FUNÇÕES DE INTERAÇÃO DO MAPA ---
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    if (gameData.currentScene === 'map') {
        const gridX = Math.floor(clickX / TILE_SIZE);
        const gridY = Math.floor(clickY / TILE_SIZE);
        
        let shouldTeleport = false;

        // Verifica a colisão do Player com o Tile Clicado (para evitar abrir longe)
        const playerGridX = Math.floor((gameData.player.x + PLAYER_SIZE/2) / TILE_SIZE);
        const playerGridY = Math.floor((gameData.player.y + PLAYER_SIZE/2) / TILE_SIZE);
        
        // Se o player estiver no tile ou adjacente ao tile, permite a interação
        const isNear = Math.abs(gridX - playerGridX) <= 1 && Math.abs(gridY - playerGridY) <= 1;

        if (!isNear) return; // Não interage se estiver longe

        const tileType = GAME_MAP[gridY][gridX];

        if (tileType === 2) { // Jardim (Teleporta)
            gameData.currentScene = 'garden';
            // Reposiciona o player no centro superior do jardim
            gameData.player.x = CANVAS_WIDTH / 2 - PLAYER_SIZE / 2;
            gameData.player.y = TILE_SIZE;
            shouldTeleport = true;
        } else if (tileType === 3) { // Vender
            openSellModal();
        } else if (tileType === 4) { // Sementes
            openShopModal('seeds', 'Loja de Sementes', SEEDS_DATA);
        } else if (tileType === 5) { // Equipamentos/Gear
            openShopModal('gear', 'Loja de Equipamentos', GEAR);
        } else if (tileType === 6) { // Ovos/Pet
            openShopModal('eggs', 'Loja de Ovos/Pets', EGGS);
        }
        
        if (shouldTeleport) {
            saveGame();
            return;
        }
    } 
    // Interação com o Jardim (Expansão e Plots)
    else if (gameData.currentScene === 'garden') {
        const { offsetX, offsetY } = getGardenOffset();
        const { width, height } = getCurrentGardenDimensions();
        
        const gridX = Math.floor((clickX - offsetX) / TILE_SIZE);
        const gridY = Math.floor((clickY - offsetY) / TILE_SIZE);
        
        // 1. Interação com as Placas de Expansão
        
        // Placa da direita (X)
        const plateX = offsetX + width * TILE_SIZE;
        const plateY = offsetY + height * TILE_SIZE / 2 - TILE_SIZE / 2;
        if (gameData.gardenExpansion.x < MAX_EXPANSION && 
            clickX >= plateX && clickX < plateX + TILE_SIZE && 
            clickY >= plateY && clickY < plateY + TILE_SIZE) 
        {
            buyExpansion('x');
            return;
        }

        // Placa de baixo (Y)
        const plateY_Y = offsetY + height * TILE_SIZE;
        const plateX_Y = offsetX + width * TILE_SIZE / 2 - TILE_SIZE / 2;
        if (gameData.gardenExpansion.y < MAX_EXPANSION &&
            clickX >= plateX_Y && clickX < plateX_Y + TILE_SIZE &&
            clickY >= plateY_Y && clickY < plateY_Y + TILE_SIZE) 
        {
            buyExpansion('y');
            return;
        }
        
        // 2. Interação com os Plots
        if (gridX >= 0 && gridX < width && gridY >= 0 && gridY < height) {
            
            const plotIndex = getPlotIndex(gridX, gridY, width);
            const plot = gameData.plots[plotIndex];
            
            let targetPlotIndex = plotIndex;

            if (plot.masterPlotIndex !== -1 && !plot.isMaster) {
                targetPlotIndex = plot.masterPlotIndex;
            }
            
            const targetPlot = gameData.plots[targetPlotIndex];

            if (targetPlot.isPlanted) {
                if (gameData.selectedItem === 'wateringCan') {
                    waterPlot(targetPlotIndex);
                } else if (gameData.selectedItem === 'reclaimer') {
                    reclaimPlot(targetPlotIndex);
                } else if (targetPlot.growthStage >= 100) {
                    harvestPlot(targetPlotIndex);
                } else {
                    // Clicou, mas não está pronto e não tem item: usa wateringCan se tiver
                    if (gameData.inventory.wateringCan > 0) {
                        waterPlot(targetPlotIndex);
                    }
                }
            } else {
                // Plantar (se nenhum item estiver selecionado)
                if (gameData.selectedItem === 'none') {
                    openPlantingModal(targetPlotIndex);
                } else {
                    alert("Você não pode plantar enquanto segura uma ferramenta! Deselecione o item.");
                }
            }
        }
    }
});


function openPlantingModal(plotIndex) {
    modalTitle.textContent = 'Plantando Sementes';
    modalScrollContent.innerHTML = '';

    for (const key in gameData.seeds) {
        const seed = gameData.seeds[key];
        
        let canPlant = true;
        if (seed.slots === 4) {
            canPlant = checkPlantingSpace(gameData.plots[plotIndex].gridX, gameData.plots[plotIndex].gridY, 4);
        }

        const itemElement = document.createElement('div');
        itemElement.className = 'shop-item';
        itemElement.innerHTML = `
            <h4>${seed.name} (${seed.slots} Slot${seed.slots > 1 ? 's' : ''})</h4>
            <p>Você tem: ${seed.count}</p>
            <p>Crescimento: ${seed.growTime}s</p>
            ${canPlant && seed.count > 0 ? 
                `<button onclick="plantSeed(${plotIndex}, '${key}')">Plantar</button>` : 
                `<button disabled>${canPlant ? 'Sem Sementes' : 'Sem Espaço (2x2)'}</button>`
            }
        `;
        modalScrollContent.appendChild(itemElement);
    }

    shopInteractionModal.style.display = 'block';
}

function openSellModal() {
    modalTitle.textContent = 'Vender Colheitas';
    modalScrollContent.innerHTML = '';
    modalContent.innerHTML = '';
    let hasItemsToSell = false;

    for (const key in gameData.harvestInventory) {
        const count = gameData.harvestInventory[key];
        if (count > 0) {
            hasItemsToSell = true;
            const seed = SEEDS_DATA[key];
            const sellValue = seed.sellValue * gameData.pet.bonus;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'shop-item';
            itemElement.innerHTML = `
                <h4>${seed.name}</h4>
                <p>Você tem: ${count} | Vende por: ${sellValue.toFixed(2)}¢ (por unidade)</p>
                <button onclick="sellItem('${key}', 1)">Vender 1</button>
                <button onclick="sellItem('${key}', ${count})">Vender Todos</button>
            `;
            modalScrollContent.appendChild(itemElement);
        }
    }
    
    if (!hasItemsToSell) {
        modalScrollContent.innerHTML = '<p>Você não tem colheitas para vender.</p>';
    }

    modalContent.innerHTML += `
        <button id="sellAllButton" onclick="sellAll()">Vender TUDO (Total)</button>
    `;

    shopInteractionModal.style.display = 'block';
}

function sellItem(key, count) {
    const seed = SEEDS_DATA[key];
    const sellValue = seed.sellValue * gameData.pet.bonus;
    
    const amountToSell = Math.min(count, gameData.harvestInventory[key] || 0);
    const totalEarnings = Math.round(amountToSell * sellValue);

    if (amountToSell > 0) {
        gameData.money += totalEarnings;
        gameData.harvestInventory[key] -= amountToSell;
        
        if (gameData.harvestInventory[key] <= 0) {
            delete gameData.harvestInventory[key];
        }
        
        alert(`Você vendeu ${amountToSell} ${seed.name} por ${totalEarnings.toFixed(2)}¢!`);
    }

    saveGame();
    openSellModal(); 
}

function sellAll() {
    let totalEarnings = 0;
    for (const key in gameData.harvestInventory) {
        const count = gameData.harvestInventory[key] || 0;
        if (count > 0) {
            const seed = SEEDS_DATA[key];
            const sellValue = seed.sellValue * gameData.pet.bonus;
            totalEarnings += Math.round(count * sellValue);
        }
    }
    
    gameData.money += totalEarnings;
    gameData.harvestInventory = {}; // Limpa todo o inventário de colheitas
    
    alert(`Você vendeu TUDO e ganhou ${totalEarnings.toFixed(2)}¢!`);

    saveGame();
    closeModal();
}

function openAdminPanel() {
    adminPanel.style.display = 'block';
    adminScrollContent.innerHTML = `
        <p>Dinheiro: <input type="number" id="adminMoney" value="${gameData.money.toFixed(2)}"></p>
        <button onclick="adminSetMoney()">Setar Dinheiro</button>
        <hr>
        <h4>Sementes</h4>
        ${Object.keys(SEEDS_DATA).map(key => `
            <p>${SEEDS_DATA[key].name}: <input type="number" id="adminSeed_${key}" value="${gameData.seeds[key].count}">
            <button onclick="adminSetCount('seeds', '${key}')">Setar</button></p>
        `).join('')}
        <hr>
        <h4>Equipamentos</h4>
        ${Object.keys(GEAR).map(key => `
            <p>${GEAR[key].name}: <input type="number" id="adminGear_${key}" value="${gameData.inventory[key] || 0}">
            <button onclick="adminSetCount('gear', '${key}')">Setar</button></p>
        `).join('')}
        <hr>
        <button onclick="resetGame()">RESETAR JOGO (CUIDADO!)</button>
    `;
}

closeAdminPanelButton.addEventListener('click', () => {
    adminPanel.style.display = 'none';
});

function adminSetMoney() {
    const newMoney = parseFloat(document.getElementById('adminMoney').value);
    if (!isNaN(newMoney)) {
        gameData.money = newMoney;
        saveGame();
        alert(`Dinheiro definido para ${newMoney.toFixed(2)}¢`);
        updateUI();
    }
}

function adminSetCount(type, key) {
    const input = document.getElementById(`admin${type === 'seeds' ? 'Seed' : 'Gear'}_${key}`);
    const newCount = parseInt(input.value);
    
    if (!isNaN(newCount)) {
        if (type === 'seeds') {
            gameData.seeds[key].count = newCount;
        } else if (type === 'gear') {
            gameData.inventory[key] = newCount;
        }
        saveGame();
        alert(`${GEAR[key]?.name || SEEDS_DATA[key]?.name} definido para ${newCount}`);
        updateUI();
        openAdminPanel(); // Atualiza o painel
    }
}

function resetGame() {
    if (confirm("TEM CERTEZA? Todo o progresso será perdido!")) {
        localStorage.removeItem(SAVE_KEY);
        window.location.reload();
    }
}


// --- LISTENERS DE BOTÕES FORA DO CANVAS ---

sceneChanger.addEventListener('click', () => {
    if (gameData.currentScene === 'garden') {
        gameData.currentScene = 'map';
        // Reposiciona o player no mapa (Tile 1, 8)
        gameData.player.x = 1 * TILE_SIZE; 
        gameData.player.y = 8 * TILE_SIZE;
        gameData.selectedItem = 'none'; // Deseleciona a ferramenta ao sair do jardim
        saveGame();
    } else if (gameData.currentScene === 'map') {
        alert("Aproxime-se do tile 'JARDIM' no mapa (o tile verde-escuro) e clique nele para entrar.");
    }
});

adminButtonMap.addEventListener('click', () => {
    const password = prompt("Digite a senha de administrador:");
    if (password === ADMIN_PASSWORD) {
        openAdminPanel();
    } else {
        alert("Senha incorreta.");
    }
});

closeModalButton.addEventListener('click', closeModal);

// Botões Globais do Garden (Water/Harvest All)
harvestAllButton.addEventListener('click', () => {
    if (gameData.currentScene !== 'garden') {
        alert("Você precisa estar no jardim para colher tudo!");
        return;
    }
    let harvested = 0;
    for (let i = 0; i < gameData.plots.length; i++) {
        if (gameData.plots[i].isPlanted && gameData.plots[i].growthStage >= 100 && gameData.plots[i].isMaster) {
            harvestPlot(i);
            harvested++;
        }
    }
    if (harvested > 0) {
        alert(`${harvested} plantação(ões) colhida(s)!`);
    } else {
        alert("Nenhuma plantação pronta para colher.");
    }
});

waterButton.addEventListener('click', () => {
    if (gameData.currentScene !== 'garden') {
        alert("Você precisa estar no jardim para regar!");
        return;
    }
    let watered = 0;
    for (let i = 0; i < gameData.plots.length; i++) {
        const plot = gameData.plots[i];
        if (plot.isPlanted && !plot.isWatered && plot.isMaster) {
            waterPlot(i);
            watered++;
        }
    }
    if (watered > 0) {
        alert(`${watered} plantação(ões) regada(s)!`);
    } else {
        alert("Nenhuma plantação precisava ser regada.");
    }
});


// Inicialização
loadGame();
gameLoop();

// Intervalo para sprinklers (a cada 3 segundos)
setInterval(sprinklerTick, 3000);
