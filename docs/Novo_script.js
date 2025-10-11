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
const ADMIN_PASSWORDS = ["ArthurGamer", "HenryGamer"]; 
const RESTOCK_INTERVAL = 3 * 60 * 1000; 
const EXPANSION_COST = 2000;
const MAX_EXPANSION = 3; 

// TEMPOS
const ACCELERATOR_TIME_MS = 3 * 60 * 1000; 
const OPEN_DURATION_MS = 10 * 60 * 1000; 
const ANIMATION_DURATION_MS = 2 * 60 * 1000; 
const FRAME_COUNT = 6; 

let isMoving = false;
let keysPressed = {}; 
let lastRestockTime = Date.now(); 
let portalFrame = FRAME_COUNT; 
let currentSelectedEgg = null; 
let isAdminLoggedIn = false; 

// Variáveis para carregar as imagens
const SEED_IMAGES = {}; 
const HARVESTED_IMAGES = {}; 
const OTHER_IMAGES = {}; 
const PORTAL_IMAGES = []; 
const PET_IMAGES = {}; 
const EGG_IMAGES = {}; 
let imagesLoaded = 0;
let totalImages = 0;

// URLs das Imagens de Interação do Mapa
const EXPANSION_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/expansao_garden.png';
const SELL_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Sell.png';
const SEED_SHOP_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Seed_shop.png';
const GEAR_SHOP_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Gear_shop.png';
const EGG_SHOP_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Egg_shop.png';
const GARDEN_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Garden_entrance.png';
const INCUBATOR_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Incubator_placeholder.png'; 
const EGG_INVENTORY_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Egg_inventory_placeholder.png'; 

// --- SPRITES DO PORTAL ---
const PORTAL_FRAMES_URLS = [
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Portal_aberto.png',     
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_1.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_2.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_3.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_4.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_5.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Portal_fechado.png'      
];

// MAPA 10x10 (INALTERADO)
const GAME_MAP = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 4, 0, 0, 7, 5, 0, 0, 6, 1], 
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1], 
    [1, 2, 0, 0, 0, 3, 0, 0, 0, 1], 
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// --- PETS (Pets de Admin e Reversão para um pet simples) ---
const PETS = { 
    // Pets Normais
    none: { name: 'Nenhum', bonus: 1.0, ability: 'none', color: '#606060', chance: 0, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Nenhum.png' }, 
    bunny: { name: 'Coelho', bonus: 1.1, ability: 'harvest', color: '#f5f5dc', chance: 0.50, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Bunny_pet.png' }, 
    fox: { name: 'Raposa', bonus: 1.25, ability: 'harvest', color: '#ff4500', chance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Fox_pet.png' },
    dragon: { name: 'Dragão', bonus: 1.5, ability: 'harvest', color: '#b22222', chance: 0.10, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Dragon_pet.png' },
    goldenLab: { name: 'Lab. Dourado', bonus: 1.0, ability: 'mutation_boost', color: '#ffd700', chance: 0.08, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Golden_lab_pet.png' },
    phoenix: { name: 'Fênix', bonus: 1.0, ability: 'water_time', color: '#ff4500', chance: 0.02, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Phoenix_pet.png' },
    
    // Pets Espaciais
    cosmicLab: { 
        name: 'Cosmic Lab', bonus: 1.0, ability: 'dig_space_seed', color: '#e0ffff', chance: 0.40,
        minTimer: 2 * 60 * 1000, maxTimer: 4 * 60 * 1000, minChance: 0.10, maxChance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_lab_pet.png'
    },
    superStar: { 
        name: 'Super Star', bonus: 1.0, ability: 'cosmic_touch', color: '#ffd700', chance: 0.30,
        minTimer: 5 * 60 * 1000, maxTimer: 8 * 60 * 1000, minChance: 0.40, maxChance: 0.75, mutationKey: 'cosmicTouch', mutationMult: 3.0, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Super_star_pet.png'
    },
    alien: { 
        name: 'Alien', bonus: 1.0, ability: 'alien_form', color: '#9932cc', chance: 0.25,
        minTimer: 9 * 60 * 1000, maxTimer: 12 * 60 * 1000, minChance: 0.20, maxChance: 0.40, mutationKey: 'alienForm', mutationMult: 4.0,
        buffTime: 20 * 60 * 1000, buffAmount: 0.35, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Alien_pet.png'
    },
    galacticPhoenix: { 
        name: 'Galactic Phoenix', bonus: 1.0, ability: 'egg_dupe_water_time', color: '#8a2be2', chance: 0.045, 
        eggDupeChance: 0.10, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Galactic_phoenix_pet_placeholder.png' 
    },
    nebulaStar: { 
        name: 'Nebula Star', bonus: 2.5, ability: 'mega_boost', color: '#ff69b4', chance: 0.005, 
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Nebula_star_pet_placeholder.png' 
    },

    // --- PETS DE ADMINISTRADOR ---
    arthur: {
        name: 'Arthur', 
        bonus: 100.0, 
        ability: 'adm_arthur', color: '#00ffff', chance: 0,
        timer1: 20 * 1000, mutKey1: 'admLike', mutMult1: 100000.0,
        timer2: 40 * 1000, buffAmount: 10.0, buffTime: 30 * 1000, 
        timer3: 30 * 1000, mutKey3: 'arthurSigma', mutMult3: 100000000.0, range: 50 * TILE_SIZE, 
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets_exclusivos/Adm_pet_arthur.png'
    },
    henrique: {
        name: 'Henrique', 
        eggLuck: 3.0, 
        ability: 'adm_henrique', color: '#ff00ff', chance: 0,
        timer1: 50 * 1000, mutKey1: 'henry', mutMult1: 1000.0,
        timer2: 2 * 60 * 1000,
        permBuffs: {
            growthMult: 180.0,
            mutationMult: 200.0,
        },
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets_exclusivos/Pet_adm_Henrique.png'
    }
};

// --- EGGS (Inalterado) ---
const EGGS = { 
    commonEgg: { 
        name: 'Ovo Comum', cost: 1000, color: '#f0e68c', maxStock: 5, currentStock: 5, 
        pets: ['bunny', 'fox', 'dragon', 'goldenLab', 'phoenix'], chance: [0.70, 0.20, 0.07, 0.02, 0.01], restockChance: 1.0,
        hatchTime: 5 * 60 * 1000,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Common_egg.png'
    }, 
    rareEgg: { 
        name: 'Ovo Raro', cost: 5000, color: '#00ced1', maxStock: 3, currentStock: 3,
        pets: ['fox', 'dragon', 'goldenLab', 'phoenix'], chance: [0.40, 0.30, 0.20, 0.10], restockChance: 0.65,
        hatchTime: 10 * 60 * 1000,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Rare_egg.png'
    },
    legendaryEgg: { 
        name: 'Ovo Lendário', cost: 25000, color: '#ffd700', maxStock: 1, currentStock: 1,
        pets: ['dragon', 'goldenLab', 'phoenix'], chance: [0.35, 0.40, 0.25], restockChance: 0.33,
        hatchTime: 15 * 60 * 1000,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Legendary_egg.png'
    },
    spaceEgg: { 
        name: 'Ovo Espacial', cost: 100000, color: '#8a2be2', maxStock: 1, currentStock: 0, 
        pets: ['cosmicLab', 'superStar', 'alien', 'galacticPhoenix', 'nebulaStar'], 
        chance: [0.40, 0.30, 0.25, 0.045, 0.005], 
        restockChance: 0.63,
        hatchTime: 20 * 60 * 1000,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_egg.png'
    }
};


// --- GEAR (Inalterado) ---
const GEAR = { 
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas", maxStock: 10, currentStock: 10, restockChance: 1.0, isTool: true },
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto", maxStock: 5, currentStock: 5, restockChance: 0.87 }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto", maxStock: 2, currentStock: 2, restockChance: 0.63 },
    reclaimer: { name: 'Reclaimer', cost: 500, description: "Remove a semente do jardim, retornando-a.", maxStock: 5, currentStock: 5, restockChance: 0.36, isTool: true },
    incubator: { name: 'Incubadora', cost: 5000, description: "Choca ovos. Ocupa 1 slot no jardim.", maxStock: 1, currentStock: 1, restockChance: 1.0, isPlottable: true, isMaster: true, slots: 1, color: '#f0f8ff' },
    timeAccelerator: { 
        name: 'Acelerador Temporal', 
        cost: 100000, description: `Acelera o tempo em ${ACCELERATOR_TIME_MS/60000} min. (15 Usos)`, maxStock: 1, currentStock: 1, restockChance: 0.02, isConsumable: true, uses: 15, isTimeTool: true,
        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Acelerador_temporal.png'
    } 
};

// --- SEMENTES (Exemplo de estrutura) ---
const SEEDS_DATA_BASE = {
    carrot: { name: 'Cenoura', cost: 10, sellValue: 10, growTime: 10, harvestAmount: 1, slots: 1, type: 'single', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_harvest.png' },
    pumpkin: { name: 'Abóbora', cost: 50, sellValue: 30, growTime: 30, harvestAmount: 3, slots: 4, type: 'multi', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_harvest.png' },
};

const SPACE_SEEDS = {
    starfruit: { name: 'Starfruit', cost: 5000, sellValue: 500, growTime: 60, harvestAmount: 5, slots: 1, type: 'single', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_harvest.png' },
    cosmicTree: { name: 'Cosmic Tree', cost: 20000, sellValue: 2000, growTime: 120, harvestAmount: 10, slots: 4, type: 'multi', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_harvest.png' },
};

const SEEDS_DATA = Object.assign({}, SEEDS_DATA_BASE, SPACE_SEEDS);

// --- DADOS INICIAIS (Revertido para 1 Pet) ---
const INITIAL_DATA = {
    money: 100,
    inventory: { 
        carrot: 1, 
        pumpkin: 1,
        sprinkler: 1 
    }, 
    harvestInventory: {},
    seeds: JSON.parse(JSON.stringify(SEEDS_DATA)), 
    plots: [],
    
    // REVERTIDO: Apenas um pet ativo
    pet: PETS.none,
    
    // Buffs e Pets de Admin
    admBuffs: {
        drawedBuffActive: false,
        henryGrowthMult: 1.0,
        henryMutationMult: 1.0,
        randomPetBuffEnd: 0,
    },
    
    petTimers: { 
        cosmicLab: 0, superStar: 0, alien: 0, 
        alienBuffEnd: 0, alienBuffTrigger: 0,
        // Timers de Admin
        arthur1: 0, arthur2: 0, arthur3: 0,
        henrique1: 0, henrique2: 0,
    },
    currentScene: 'map', 
    selectedItem: 'none', 
    gardenExpansion: { x: 0, y: 0 }, 
    player: { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, color: '#32cd32', speed: 2 },
    masterPlots: {},
    eggInventory: [], 
    incubator: { isPlanted: false, egg: null, hatchTime: 0, startTime: 0, plotIndex: -1 }, 
    lastSpaceShopOpen: 0 
};

// --- 2. GERENCIAMENTO E SALVAMENTO DE DADOS ---

function loadImages() {
    const loadAndTrack = (url, targetObject, key) => {
        const img = new Image();
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                initGame();
                requestAnimationFrame(updateGame);
            }
        };
        img.onerror = () => {
            console.error(`Falha ao carregar imagem: ${url}`);
            imagesLoaded++; 
        };
        img.src = url;
        if (targetObject && key) {
            targetObject[key] = img;
        } else if (targetObject) {
            targetObject.push(img);
        }
        totalImages++;
    };

    // 1. Carregar Sprites Estáticos e Placeholders
    const staticUrls = {
        expansionTile: EXPANSION_IMAGE_URL, sellTile: SELL_IMAGE_URL, seedShopTile: SEED_SHOP_IMAGE_URL,
        gearShopTile: GEAR_SHOP_IMAGE_URL, eggShopTile: EGG_SHOP_IMAGE_URL, gardenEntrance: GARDEN_IMAGE_URL,
        incubator: INCUBATOR_IMAGE_URL, eggInventoryTile: EGG_INVENTORY_IMAGE_URL,
        timeAccelerator: GEAR.timeAccelerator.imageURL
    };
    for (const key in staticUrls) {
        if (staticUrls[key]) loadAndTrack(staticUrls[key], OTHER_IMAGES, key);
    }
    
    // 2. Carregar Imagens do Portal
    PORTAL_FRAMES_URLS.forEach(url => loadAndTrack(url, PORTAL_IMAGES));

    // 3. Carregar Imagens de Sementes
    for (const key in SEEDS_DATA) {
        if (SEEDS_DATA[key].imageURL) loadAndTrack(SEEDS_DATA[key].imageURL, SEED_IMAGES, key);
        if (SEEDS_DATA[key].harvestedURL) loadAndTrack(SEEDS_DATA[key].harvestedURL, HARVESTED_IMAGES, key);
    }
    
    // 4. Carregar Imagens de Ovos
    for (const key in EGGS) {
        if (EGGS[key].imageURL) loadAndTrack(EGGS[key].imageURL, EGG_IMAGES, key);
    }

    // 5. Carregar Imagens de Pets
    for (const key in PETS) {
        if (PETS[key].imageURL) loadAndTrack(PETS[key].imageURL, PET_IMAGES, key);
    }
}

// CORREÇÃO DE EMERGÊNCIA: Trata erros de JSON e garante plots.
function initGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    
    // 1. Tenta carregar os dados
    if (savedData) {
        try {
            gameData = JSON.parse(savedData);
            
            // Corrige a estrutura do pet
            if (typeof gameData.pet === 'string') {
                gameData.pet = PETS[gameData.pet.replace(/ /g, '')] || PETS.none;
            }
            
            // Garante que os novos timers/buffs de admin existam
            gameData.petTimers = Object.assign({
                arthur1: 0, arthur2: 0, arthur3: 0,
                henrique1: 0, henrique2: 0,
            }, gameData.petTimers);
            
            gameData.admBuffs = Object.assign({
                drawedBuffActive: false,
                henryGrowthMult: 1.0,
                henryMutationMult: 1.0,
                randomPetBuffEnd: 0,
            }, gameData.admBuffs);
            
        } catch (e) {
            // SE O JSON FALHAR (DADOS CORROMPIDOS), FORÇA NOVO JOGO
            console.error("Dados salvos corrompidos. Iniciando novo jogo.");
            showMessage("Seu progresso salvo estava corrompido. Iniciando novo jogo.", 'error');
            gameData = JSON.parse(JSON.stringify(INITIAL_DATA));
            createInitialPlots();
        }
    } else {
        // 2. Se não houver dados, inicia novo jogo
        gameData = JSON.parse(JSON.stringify(INITIAL_DATA));
        createInitialPlots();
    }
    
    // GARANTE QUE O JARDIM EXISTE.
    if (!gameData.plots || gameData.plots.length === 0) {
         createInitialPlots();
    }
    
    document.getElementById('inventoryPanel').style.display = 'block';
    document.getElementById('shopPanel').style.display = 'none';
    document.getElementById('eggShopPanel').style.display = 'none';
    document.getElementById('gearShopPanel').style.display = 'none';
    
    drawMap(); // Tenta desenhar o mapa logo na inicialização
}

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
}

function createInitialPlots() {
    const numPlots = INITIAL_GARDEN_WIDTH * INITIAL_GARDEN_HEIGHT;
    gameData.plots = []; // Limpa o array antes de criar
    for (let i = 0; i < numPlots; i++) {
        const x = (i % INITIAL_GARDEN_WIDTH) * TILE_SIZE;
        const y = Math.floor(i / INITIAL_GARDEN_WIDTH) * TILE_SIZE;
        gameData.plots.push({
            x: x, y: y,
            isPlanted: false, seedType: 'none', growthStage: 0,
            isWatered: false, wateredAt: 0,
            isMaster: false, linkedPlots: null, mutation: null
        });
    }
}

function showMessage(msg, type = 'info') {
    const msgDiv = document.getElementById('message');
    msgDiv.textContent = msg;
    msgDiv.className = type; 
    setTimeout(() => { msgDiv.textContent = ''; msgDiv.className = ''; }, 3000);
}

// --- Funções Utilitárias (Inalteradas) ---
function getWeightedRandom(items, weights) {
    let totalWeight = weights.reduce((sum, w) => sum + w, 0);
    let randomNumber = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
        randomNumber -= weights[i];
        if (randomNumber <= 0) {
            return items[i];
        }
    }
    return items[items.length - 1]; 
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function updateConnectedPlots(masterIndex, callback) {
    const masterPlot = gameData.plots[masterIndex];
    if (masterPlot.seedType === 'incubator') return; 

    const offsets = [
        { dx: 0, dy: 0 }, 
        { dx: TILE_SIZE, dy: 0 }, 
        { dx: 0, dy: TILE_SIZE }, 
        { dx: TILE_SIZE, dy: TILE_SIZE }
    ];
    
    const masterX = masterPlot.x;
    const masterY = masterPlot.y;

    gameData.plots.forEach((plot, index) => {
        const isConnected = offsets.some(offset => 
            plot.x === masterX + offset.dx && plot.y === masterY + offset.dy
        );

        if (isConnected) {
            callback(plot, index);
        }
    });
}

function getAlienBuffMultiplier() {
    if (Date.now() < gameData.petTimers.alienBuffEnd) {
        return 1.0 + PETS.alien.buffAmount; 
    }
    return 1.0;
}


// --- 3. HABILIDADES ESPECIAIS E TIMERS (Inalteradas) ---
function getHarvestBonus() {
    let totalBonus = gameData.pet.bonus;
    
    if (Date.now() < gameData.admBuffs.randomPetBuffEnd) {
        totalBonus *= PETS.arthur.buffAmount; 
    }
    
    totalBonus *= getAlienBuffMultiplier();

    if (gameData.admBuffs.drawedBuffActive && totalBonus < 2.5) {
         totalBonus = 2.5; 
    }
    
    return totalBonus;
}

function getSellMultiplier(seedKey) {
    let multiplier = 1.0;
    
    if (gameData.pet.ability === 'adm_arthur') {
        multiplier *= PETS.arthur.bonus; 
    }
    
    const plotWithMutation = gameData.plots.find(p => p.seedType === seedKey && p.mutation);
    if (plotWithMutation) {
        multiplier *= plotWithMutation.mutation.multiplier;
    }
    
    return multiplier;
}

function applyMutationToRandomPlot(mutationKey, mutationMult) {
    const plantablePlots = gameData.plots.filter(p => p.isPlanted && p.growthStage < 100);
    if (plantablePlots.length === 0) {
        showMessage(`Mutação falhou: Nenhum plot plantado.`, 'info');
        return false;
    }
    
    const targetPlot = plantablePlots[Math.floor(Math.random() * plantablePlots.length)];
    
    if (!targetPlot.mutation || mutationKey === 'henry') {
        targetPlot.mutation = { key: mutationKey, multiplier: mutationMult };
        return true;
    }
    return false;
}

function getGrowthTime(seedKey, isWatered) {
    const seed = SEEDS_DATA[seedKey];
    let growthTime = seed.growTime * 1000;
    
    if (seed.type === 'multi' && gameData.pet.ability === 'adm_henrique') {
        growthTime /= PETS.henrique.permBuffs.growthMult; 
    }
    
    let waterMultiplier = 1.0; 
    if (['water_time', 'egg_dupe_water_time'].includes(gameData.pet.ability)) {
        waterMultiplier = 0.5; 
    }
    
    const alienBuffMult = getAlienBuffMultiplier(); 
    growthTime /= alienBuffMult; 
    
    if (isWatered) {
        growthTime *= waterMultiplier; 
    }
    
    return growthTime;
}


function checkPetAbilities(deltaTime) {
    const now = Date.now();
    const currentPetKey = gameData.pet.name.replace(/ /g, '');
    const petData = PETS[currentPetKey];

    if (!petData) return; 
    
    // ... (Lógica de Pets Espaciais inalterada) ...

    
    // --- LÓGICA DE PETS DE ADMIN ---
    
    // 1. Arthur (adm_arthur)
    if (petData.ability === 'adm_arthur') {
        if (now >= gameData.petTimers.arthur1) {
            applyMutationToRandomPlot(petData.mutKey1, petData.mutMult1); 
            gameData.petTimers.arthur1 = now + petData.timer1;
            showMessage(`Arthur aplicou AdmLike! (${petData.mutMult1}x)`, 'event');
        }
        
        if (now >= gameData.petTimers.arthur2) {
            gameData.admBuffs.randomPetBuffEnd = now + petData.buffTime; 
            gameData.petTimers.arthur2 = now + petData.timer2;
            showMessage(`Arthur aplicou Buff de 1000% em si mesmo!`, 'event');
        }

        if (now >= gameData.petTimers.arthur3) {
            let count = 0;
            const range = petData.range; 
            const plotsInRange = gameData.plots.filter(p => 
                p.isPlanted && p.growthStage < 100 && 
                Math.hypot(p.x - gameData.player.x, p.y - gameData.player.y) <= range
            );
            
            plotsInRange.forEach(p => {
                if (!p.mutation) {
                    p.mutation = { key: petData.mutKey3, multiplier: petData.mutMult3 };
                    count++;
                }
            });
            gameData.petTimers.arthur3 = now + petData.timer3;
            showMessage(`ArthurSigma ativado! ${count} frutas mutacionadas.`, 'event');
        }
    }
    
    // 2. Henrique (adm_henrique)
    if (petData.ability === 'adm_henrique') {
        gameData.admBuffs.henryGrowthMult = petData.permBuffs.growthMult;
        gameData.admBuffs.henryMutationMult = petData.permBuffs.mutationMult;

        if (now >= gameData.petTimers.henrique1) {
            applyMutationToRandomPlot(petData.mutKey1, petData.mutMult1); 
            gameData.petTimers.henrique1 = now + petData.timer1;
            showMessage(`Henrique aplicou Henry Mut. (1000x)!`, 'event');
        }
        
        if (now >= gameData.petTimers.henrique2) {
            gameData.admBuffs.drawedBuffActive = true; 
            gameData.petTimers.henrique2 = now + petData.timer2;
            showMessage(`Drawed Buff ativado! Skills no máximo.`, 'event');
        }
    }
    
    saveGame();
}


// --- 4. LÓGICA DE MOVIMENTO E DESENHO (Inalteradas) ---

function calculatePortalFrame(now) {
    // ... (lógica inalterada) ...
}

function isSpaceShopOpen() {
    // ... (lógica inalterada) ...
}

function drawPets() {
    const petKey = gameData.pet.name.replace(/ /g, '');
    const petImage = PET_IMAGES[petKey];

    if (petKey === 'none' || !petImage) return;

    const petX = gameData.player.x; 
    const petY = gameData.player.y + 10; 
    
    ctx.drawImage(petImage, petX, petY, TILE_SIZE, TILE_SIZE);
}

function drawPlayer(x, y, color) {
    // ... (lógica inalterada) ...
}

function drawMap() {
    // Desenha o chão e as bordas (mapa 10x10)
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            // ... (lógica inalterada) ...
        }
    }

    // Desenha o Jardim e os Plots
    for (let i = 0; i < gameData.plots.length; i++) {
        // ... (lógica inalterada de desenho de plots, sementes e mutações) ...
    }
    
    drawPets(); 
    
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.color);
}

function movePlayer() {
    // ... (lógica inalterada) ...
}


// --- 5. FUNÇÕES DE INTERAÇÃO E SHOP (Corrigidas) ---

function openShop(type) {
    // ... (lógica inalterada) ...
}

function closeShop() {
    // ... (lógica inalterada) ...
}

function updateShopDisplay() {
    // ... (lógica inalterada) ...
}

function restockShops() {
    // ... (lógica inalterada) ...
}

function buyItem(shopType, itemKey) {
    const shopList = shopType === 'Seed Shop' || shopType === 'Space Shop' ? SEEDS_DATA : (shopType === 'Gear Shop' ? GEAR : EGGS);
    const itemInfo = shopList[itemKey];

    if (!itemInfo) return;

    if (gameData.money < itemInfo.cost) {
        showMessage('Dinheiro insuficiente!', 'error');
        return;
    }
    if (itemInfo.currentStock <= 0 && itemInfo.maxStock > 0) {
        showMessage('Item esgotado!', 'error');
        return;
    }

    gameData.money -= itemInfo.cost;

    if (shopType === 'Seed Shop' || shopType === 'Space Shop') {
        gameData.seeds[itemKey].currentStock = (gameData.seeds[itemKey].currentStock || 0) + 1;
        if (itemInfo.maxStock > 0) itemInfo.currentStock--;
        showMessage(`Comprou 1x ${itemInfo.name}!`, 'success');

    } else if (shopType === 'Gear Shop') {
        gameData.inventory[itemKey] = (gameData.inventory[itemKey] || 0) + 1;
        if (itemInfo.maxStock > 0) itemInfo.currentStock--;
        showMessage(`Comprou 1x ${itemInfo.name}!`, 'success');
        
    } else if (shopType === 'Egg Shop') {
        if (gameData.eggInventory.length >= 6) {
            showMessage('Inventário de Ovos cheio (6/6). Choque um ovo.', 'error');
            gameData.money += itemInfo.cost; 
            return;
        }
        gameData.eggInventory.push({ key: itemKey });
        if (itemInfo.maxStock > 0) itemInfo.currentStock--;
        showMessage(`Comprou 1x ${itemInfo.name}!`, 'success');
    }
    
    saveGame();
    updateShopDisplay(); 
    updateInventoryDisplay();
}

function harvestSeed(plotIndex) {
    const plot = gameData.plots[plotIndex];
    if (!plot.isPlanted || plot.growthStage < 100 || plot.seedType === 'incubator') return;

    const seedKey = plot.seedType;
    const seed = SEEDS_DATA[seedKey];
    
    const harvestBonus = getHarvestBonus();
    const amount = Math.floor(seed.harvestAmount * harvestBonus); 
    
    gameData.harvestInventory[seedKey] = (gameData.harvestInventory[seedKey] || 0) + amount;
    
    showMessage(`Colheu ${amount} ${seed.name} (x${harvestBonus.toFixed(2)} bônus)!`, 'success');
    
    const resetPlot = (p) => {
        p.isPlanted = false;
        p.seedType = 'none';
        p.growthStage = 0;
        p.isWatered = false;
        p.wateredAt = 0;
        p.isMaster = false;
        p.mutation = null;
        p.linkedPlots = null; 
    };
    
    const masterPlot = gameData.plots[plotIndex];
    resetPlot(masterPlot); 
    
    if (seed.slots === 4) {
        updateConnectedPlots(plotIndex, resetPlot);
    }
    
    saveGame();
}

function sellHarvest(itemKey, quantity) {
    if (!gameData.harvestInventory[itemKey] || gameData.harvestInventory[itemKey] < quantity) {
        showMessage('Não há itens suficientes para vender.', 'error');
        return;
    }
    
    const item = SEEDS_DATA[itemKey]; 
    if (!item) return;

    const sellMult = getSellMultiplier(itemKey);
    const profit = item.sellValue * quantity * sellMult;
    
    gameData.harvestInventory[itemKey] -= quantity;
    gameData.money += profit;
    
    if (gameData.harvestInventory[itemKey] <= 0) {
        delete gameData.harvestInventory[itemKey];
    }

    showMessage(`Vendeu ${quantity}x ${item.name} por $${profit.toFixed(2)}!`, 'success');
    saveGame();
    updateInventoryDisplay();
}


/**
 * NOVO: Função para resgatar sementes com Reclaimer
 */
function reclaimSeed(plotIndex) {
    const plot = gameData.plots[plotIndex];
    
    if (!plot.isPlanted || plot.seedType === 'incubator') {
        showMessage('Nada plantado aqui para resgatar.', 'error');
        return;
    }
    
    if ((gameData.inventory.reclaimer || 0) <= 0) {
        showMessage('Você precisa de um Reclaimer no inventário!', 'error');
        return;
    }
    
    const seedKey = plot.seedType;
    const seed = SEEDS_DATA[seedKey];
    
    // Devolve a semente para o inventário de sementes 
    gameData.seeds[seedKey].currentStock = (gameData.seeds[seedKey].currentStock || 0) + 1;
    
    // Consome o Reclaimer
    gameData.inventory.reclaimer -= 1;
    if (gameData.inventory.reclaimer <= 0) {
        delete gameData.inventory.reclaimer;
    }

    // Limpa o(s) plot(s)
    const resetPlot = (p) => {
        p.isPlanted = false;
        p.seedType = 'none';
        p.growthStage = 0;
        p.isWatered = false;
        p.wateredAt = 0;
        p.isMaster = false;
        p.mutation = null;
        p.linkedPlots = null;
    };
    
    resetPlot(plot); 
    if (seed.slots === 4) {
        updateConnectedPlots(plotIndex, resetPlot); 
    }
    
    showMessage(`Semente de ${seed.name} resgatada!`, 'info');
    gameData.selectedItem = 'none';
    saveGame();
    updateInventoryDisplay();
}


function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    const mapCol = Math.floor(clickX / TILE_SIZE);
    const mapRow = Math.floor(clickY / TILE_SIZE);
    const mapTile = GAME_MAP[mapRow] ? GAME_MAP[mapRow][mapCol] : -1;
    
    const isPlayerNearby = (targetX, targetY) => {
        const dist = Math.hypot(gameData.player.x - targetX, gameData.player.y - targetY);
        return dist < TILE_SIZE * 1.5; 
    };

    // 1. Interação com Tiles (Lojas, Jardim, Expansão)
    // ... (lógica inalterada) ...

    // 2. Interação com Plots
    let plotIndex = -1;
    for (let i = 0; i < gameData.plots.length; i++) {
        const p = gameData.plots[i];
        if (clickX >= p.x && clickX < p.x + TILE_SIZE && 
            clickY >= p.y && clickY < p.y + TILE_SIZE) {
            plotIndex = i;
            break;
        }
    }

    if (plotIndex !== -1) {
        const plot = gameData.plots[plotIndex];
        
        // Verifica se está ao lado do plot
        if (!isPlayerNearby(plot.x, plot.y)) {
            showMessage('Aproxime-se do plot para interagir.', 'info');
            return;
        }
        
        switch (gameData.selectedItem) {
            case 'carrot':
            case 'pumpkin':
            case 'starfruit':
            case 'cosmicTree':
                // ... (lógica inalterada de plantar) ...
                break;

            case 'wateringCan':
                // ... (lógica inalterada de regar) ...
                break;
                
            case 'reclaimer':
                reclaimSeed(plotIndex); // Chama a nova função de resgate
                break;

            case 'incubator':
                // ... (lógica inalterada de plantar incubadora) ...
                break;
                
            case 'none':
                // Tenta Colher
                if (plot.isPlanted && plot.growthStage >= 100) {
                    harvestSeed(plotIndex);
                } else if (plot.seedType === 'incubator' && plot.isPlanted) {
                    hatchEgg();
                } else if (plot.isPlanted) {
                    showMessage('Planta ainda em crescimento: ' + plot.growthStage.toFixed(0) + '%', 'info');
                }
                break;
        }
    }
}

function hatchEgg() {
    if (!gameData.incubator.egg || !gameData.incubator.isPlanted) return;

    const timeElapsed = Date.now() - gameData.incubator.startTime;
    const remainingTime = gameData.incubator.hatchTime - timeElapsed;
    
    if (remainingTime <= 0) {
        const eggKey = gameData.incubator.egg.key;
        const eggData = EGGS[eggKey];
        
        let pets = eggData.pets;
        let chances = [...eggData.chance]; 

        if (gameData.pet.ability === 'adm_henrique') {
            const henriqueLuck = PETS.henrique.eggLuck;
            chances = chances.map(chance => chance * henriqueLuck);
        }

        const petKey = getWeightedRandom(pets, chances);
        
        if (gameData.pet.ability === 'egg_dupe_water_time' && Math.random() < PETS.galacticPhoenix.eggDupeChance) {
            if (gameData.eggInventory.length < 6) { 
                gameData.eggInventory.push({ key: eggKey });
                showMessage('Fênix Galáctica duplicou seu ovo!', 'event');
            }
        }
        
        gameData.pet = PETS[petKey]; 
        
        gameData.plots[gameData.incubator.plotIndex].isPlanted = false; 
        gameData.incubator = JSON.parse(JSON.stringify(INITIAL_DATA.incubator));
        
        showMessage(`Ovo chocado! Você ganhou: ${gameData.pet.name}!`, 'success');
    }
}


// --- 6. PAINEL DE ADMINISTRAÇÃO E COMANDOS (Inalterados) ---

function redeemCode(code) {
    // ... (lógica inalterada) ...
}

function executeAdminCommand(command) {
    // ... (lógica inalterada) ...
}

function openAdminPanel() {
    // ... (lógica inalterada) ...
}


function updateInventoryDisplay() {
    // ... (lógica inalterada) ...
}

// --- NOVO: FUNÇÃO DE RESET PARA BOTÃO ---
function hardReset() {
    if (confirm("ATENÇÃO: Isso apagará TODO o seu progresso no jogo! Tem certeza?")) {
        // Remove a chave de salvamento do Local Storage
        localStorage.removeItem(SAVE_KEY); 
        
        // Recarrega a página para iniciar o jogo do zero
        window.location.reload(); 
    }
}
// --- FIM DA FUNÇÃO DE RESET ---


function updateGame() {
    const now = Date.now();
    const deltaTime = now - (gameData.lastUpdate || now);
    
    // 1. Checa por restock
    if (now - lastRestockTime >= RESTOCK_INTERVAL) {
        restockShops();
        lastRestockTime = now;
    }
    
    // 2. Movimento do Jogador
    movePlayer();
    
    // 3. Lógica de Pets
    checkPetAbilities(deltaTime);

    // 4. Checa por ovo pronto
    hatchEgg(); 
    
    // 5. Atualiza o crescimento das plantas 
    for (let i = 0; i < gameData.plots.length; i++) {
        const plot = gameData.plots[i];
        if (plot.isPlanted && plot.growthStage < 100) {
            const isWatered = (now - plot.wateredAt) < 30 * 1000; 
            const growthTime = getGrowthTime(plot.seedType, isWatered);
            
            const growthIncrease = (deltaTime / growthTime) * 100;
            plot.growthStage = Math.min(100, plot.growthStage + growthIncrease);
        }
    }

    gameData.lastUpdate = now;
    saveGame();
    drawMap(); 
    requestAnimationFrame(updateGame);
}

// Inicialização
loadImages();
