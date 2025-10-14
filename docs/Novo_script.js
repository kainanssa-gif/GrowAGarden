// --- 1. CONFIGURAÃ‡Ã•ES E DADOS GLOBAIS ---

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

const RESTOCK_INTERVAL = 3 * 60 * 1000; 

const EXPANSION_COST = 2000;

const MAX_EXPANSION = 3; 



// TEMPOS

const OPEN_DURATION_MS = 10 * 60 * 1000; 

const ANIMATION_DURATION_MS = 2 * 60 * 1000; 

const FRAME_COUNT = 6; 



let isMoving = false;

let keysPressed = {}; 

let lastRestockTime = Date.now(); 

let portalFrame = FRAME_COUNT; 



// VariÃ¡veis para carregar as imagens

const SEED_IMAGES = {}; 

const HARVESTED_IMAGES = {}; 

const OTHER_IMAGES = {}; 

const PORTAL_IMAGES = []; 

const PET_IMAGES = {}; 

const EGG_IMAGES = {}; 

let imagesLoaded = 0;

let totalImages = 0;



// URLs das Imagens de InteraÃ§Ã£o do Mapa

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



// --- PETS ---

const PETS = { 

    none: { name: 'Nenhum', bonus: 1.0, ability: 'none', color: '#606060', chance: 0, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Nenhum.png' }, 

    bunny: { name: 'Coelho', bonus: 1.1, ability: 'harvest', color: '#f5f5dc', chance: 0.50, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Bunny_pet.png' }, 

    fox: { name: 'Raposa', bonus: 1.25, ability: 'harvest', color: '#ff4500', chance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Fox_pet.png' },

    dragon: { name: 'DragÃ£o', bonus: 1.5, ability: 'harvest', color: '#b22222', chance: 0.10, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Dragon_pet.png' },

    goldenLab: { name: 'Lab. Dourado', bonus: 1.0, ability: 'mutation_boost', color: '#ffd700', chance: 0.08, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Golden_lab_pet.png' },

    phoenix: { name: 'FÃªnix', bonus: 1.0, ability: 'water_time', color: '#ff4500', chance: 0.02, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Phoenix_pet.png' },

    

    // Pets Espaciais (mantidos para que o jogo nÃ£o quebre, mas sem lÃ³gica de admin)

    cosmicLab: { name: 'Cosmic Lab', bonus: 1.0, ability: 'dig_space_seed', color: '#e0ffff', chance: 0.40, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_lab_pet.png' },

    superStar: { name: 'Super Star', bonus: 1.0, ability: 'cosmic_touch', color: '#ffd700', chance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Super_star_pet.png' },

    alien: { name: 'Alien', bonus: 1.0, ability: 'alien_form', color: '#9932cc', chance: 0.25, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Alien_pet.png' },

};



// --- EGGS ---

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

        name: 'Ovo LendÃ¡rio', cost: 25000, color: '#ffd700', maxStock: 1, currentStock: 1,

        pets: ['dragon', 'goldenLab', 'phoenix'], chance: [0.35, 0.40, 0.25], restockChance: 0.33,

        hatchTime: 15 * 60 * 1000,

        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Legendary_egg.png'

    },

    spaceEgg: { 

        name: 'Ovo Espacial', cost: 100000, color: '#8a2be2', maxStock: 1, currentStock: 0, 

        pets: ['cosmicLab', 'superStar', 'alien'], chance: [0.50, 0.30, 0.20], 

        restockChance: 0.63,

        hatchTime: 20 * 60 * 1000,

        imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_egg.png'

    }

};





// --- GEAR ---

const GEAR = { 

    wateringCan: { name: 'Regador BÃ¡sico', cost: 100, description: "Item para regar suas plantas", maxStock: 10, currentStock: 10, restockChance: 1.0, isTool: true },

    basicSprinkler: { name: 'Sprinkler BÃ¡sico', cost: 500, description: "30% chance de regar auto", maxStock: 5, currentStock: 5, restockChance: 0.87 }, 

    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto", maxStock: 2, currentStock: 2, restockChance: 0.63 },

    reclaimer: { name: 'Reclaimer', cost: 500, description: "Remove a semente do jardim, retornando-a.", maxStock: 5, currentStock: 5, restockChance: 0.36, isTool: true },

    incubator: { name: 'Incubadora', cost: 5000, description: "Choca ovos. Ocupa 1 slot no jardim.", maxStock: 1, currentStock: 1, restockChance: 1.0, isPlottable: true, isMaster: true, slots: 1, color: '#f0f8ff' },

};



// --- SEMENTES ---

const SEEDS_DATA_BASE = {

    carrot: { name: 'Cenoura', cost: 10, sellValue: 10, growTime: 10, harvestAmount: 1, slots: 1, type: 'single', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_harvest.png' },

    pumpkin: { name: 'AbÃ³bora', cost: 50, sellValue: 30, growTime: 30, harvestAmount: 3, slots: 4, type: 'multi', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_harvest.png' },

};



const SPACE_SEEDS = {

    starfruit: { name: 'Starfruit', cost: 5000, sellValue: 500, growTime: 60, harvestAmount: 5, slots: 1, type: 'single', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_harvest.png' },

    cosmicTree: { name: 'Cosmic Tree', cost: 20000, sellValue: 2000, growTime: 120, harvestAmount: 10, slots: 4, type: 'multi', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_harvest.png' },

};



const SEEDS_DATA = Object.assign({}, SEEDS_DATA_BASE, SPACE_SEEDS);



// --- DADOS INICIAIS ---

const INITIAL_DATA = {

    money: 100,

    inventory: { 

        carrot: 1, 

        pumpkin: 1,

        wateringCan: 1,

        reclaimer: 1, 

        basicSprinkler: 1

    }, 

    harvestInventory: {},

    seeds: JSON.parse(JSON.stringify(SEEDS_DATA)), 

    plots: [],

    

    pet: PETS.none,

    

    petTimers: { cosmicLab: 0, superStar: 0, alien: 0, alienBuffEnd: 0 },

    currentScene: 'map', 

    selectedItem: 'none', 

    gardenExpansion: { x: 0, y: 0 }, 

    player: { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE, color: '#32cd32', speed: 2 },

    masterPlots: {},

    eggInventory: [], 

    incubator: { isPlanted: false, egg: null, hatchTime: 0, startTime: 0, plotIndex: -1 }, 

    lastSpaceShopOpen: 0 

};



let gameData = JSON.parse(JSON.stringify(INITIAL_DATA));



// --- 2. GERENCIAMENTO E SALVAMENTO DE DADOS ---



// Funcao de hard reset para limpar o local storage

function hardReset() {

    localStorage.removeItem(SAVE_KEY);

    window.location.reload(); 

}



// Vincula a funÃ§Ã£o de reset ao botÃ£o Admin/Resetar

document.addEventListener('DOMContentLoaded', () => {

    const adminButton = document.getElementById('adminButton');

    if (adminButton) {

        adminButton.addEventListener('click', hardReset);

    }

});





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

            // Tratamento de erro: se uma imagem falhar, o jogo pode travar. 

            // Para garantir que o jogo inicie, podemos IGNORAR a imagem que falhou:

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



    // 1. Carregar Sprites EstÃ¡ticos e Placeholders

    const staticUrls = {

        expansionTile: EXPANSION_IMAGE_URL, sellTile: SELL_IMAGE_URL, seedShopTile: SEED_SHOP_IMAGE_URL,

        gearShopTile: GEAR_SHOP_IMAGE_URL, eggShopTile: EGG_SHOP_IMAGE_URL, gardenEntrance: GARDEN_IMAGE_URL,

        incubator: INCUBATOR_IMAGE_URL, eggInventoryTile: EGG_INVENTORY_IMAGE_URL,

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



// CORREÃ‡ÃƒO DE EMERGÃŠNCIA: Trata erros de JSON e garante plots.

function initGame() {

    const savedData = localStorage.getItem(SAVE_KEY);

    

    if (savedData) {

        try {

            gameData = JSON.parse(savedData);

            

            // Corrige a estrutura do pet

            if (typeof gameData.pet === 'string') {

                gameData.pet = PETS[gameData.pet.replace(/ /g, '')] || PETS.none;

            }

            

            if (!gameData.seeds) {

                gameData.seeds = JSON.parse(JSON.stringify(SEEDS_DATA));

            }

            

        } catch (e) {

            console.error("Dados salvos corrompidos. Iniciando novo jogo.");

            gameData = JSON.parse(JSON.stringify(INITIAL_DATA));

            createInitialPlots();

        }

    } else {

        gameData = JSON.parse(JSON.stringify(INITIAL_DATA));

        createInitialPlots();

    }

    

    // GARANTE QUE O JARDIM EXISTE.

    if (!gameData.plots || gameData.plots.length === 0) {

         createInitialPlots();

    }

    

    // Garante que o pet existe 

    if (!gameData.pet || typeof gameData.pet === 'string') {

        gameData.pet = PETS.none;

    }

    

    document.getElementById('inventoryPanel').style.display = 'block';

    document.getElementById('shopPanel').style.display = 'none';

    document.getElementById('eggShopPanel').style.display = 'none';

    document.getElementById('gearShopPanel').style.display = 'none';

    

    drawMap(); 

}



function saveGame() {

    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));

}



function createInitialPlots() {

    const numPlots = INITIAL_GARDEN_WIDTH * INITIAL_GARDEN_HEIGHT;

    gameData.plots = []; 

    for (let i = 0; i < numPlots; i++) {

        const x = (i % INITIAL_GARDEN_WIDTH) * TILE_SIZE;

        const y = Math.floor(i / INITIAL_GARDEN_WIDTH) * TILE_SIZE;

        gameData.plots.push({

            x: x + TILE_SIZE * 2, y: y + TILE_SIZE * 2, 

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



// --- FunÃ§Ãµes UtilitÃ¡rias ---

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





// --- 3. HABILIDADES ESPECIAIS E TIMERS ---

function getHarvestBonus() {

    return gameData.pet.bonus;

}



function getSellMultiplier(seedKey) {

    let multiplier = 1.0;

    

    const plotWithMutation = gameData.plots.find(p => p.seedType === seedKey && p.mutation);

    if (plotWithMutation) {

        multiplier *= plotWithMutation.mutation.multiplier;

    }

    

    return multiplier;

}



function applyMutationToRandomPlot(mutationKey, mutationMult) {

    const plantablePlots = gameData.plots.filter(p => p.isPlanted && p.growthStage < 100);

    if (plantablePlots.length === 0) {

        showMessage(`MutaÃ§Ã£o falhou: Nenhum plot plantado.`, 'info');

        return false;

    }

    

    const targetPlot = plantablePlots[Math.floor(Math.random() * plantablePlots.length)];

    

    if (!targetPlot.mutation) {

        targetPlot.mutation = { key: mutationKey, multiplier: mutationMult };

        return true;

    }

    return false;

}



function getGrowthTime(seedKey, isWatered) {

    const seed = SEEDS_DATA[seedKey];

    let growthTime = seed.growTime * 1000;

    

    let waterMultiplier = 1.0; 

    if (gameData.pet.ability === 'water_time') {

        waterMultiplier = 0.5; 

    }

    

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

    

    // LÃ³gica simples de pets

    if (petData.ability === 'mutation_boost') {

         if (Math.random() < 0.005) { // 0.5% chance por tick

            applyMutationToRandomPlot('goldenBoost', 2.0);

            showMessage(`Lab. Dourado aplicou boost de 2x!`, 'event');

        }

    }

    

    // LÃ³gica de Space Seeds

    if (petData.ability === 'dig_space_seed' && now >= gameData.petTimers.cosmicLab) {

        if (Math.random() < 0.20) {

            const keys = Object.keys(SPACE_SEEDS);

            const randomSeedKey = keys[Math.floor(Math.random() * keys.length)];

            gameData.seeds[randomSeedKey].currentStock = (gameData.seeds[randomSeedKey].currentStock || 0) + 1;

            showMessage(`Cosmic Lab cavou uma semente de ${SPACE_SEEDS[randomSeedKey].name}!`, 'event');

        }

        gameData.petTimers.cosmicLab = now + 4 * 60 * 1000;

    }



    saveGame();

}





// --- 4. LÃ“GICA DE MOVIMENTO E DESENHO ---



function calculatePortalFrame(now) {

    const timeSinceOpen = now - gameData.lastSpaceShopOpen;

    

    if (timeSinceOpen < OPEN_DURATION_MS) {

        portalFrame = 0; 

        return;

    }

    

    const timeSinceClosing = timeSinceOpen - OPEN_DURATION_MS;

    if (timeSinceClosing > ANIMATION_DURATION_MS) {

        portalFrame = FRAME_COUNT; 

        return;

    }

    

    const animationProgress = timeSinceClosing / ANIMATION_DURATION_MS;

    portalFrame = Math.floor(animationProgress * FRAME_COUNT) + 1;

    portalFrame = Math.min(portalFrame, FRAME_COUNT); 

}



function isSpaceShopOpen() {

    return portalFrame === 0;

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

    ctx.fillStyle = color;

    ctx.beginPath();

    ctx.arc(x + PLAYER_SIZE / 2, y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);

    ctx.fill();

}



// *** FUNÃ‡ÃƒO DE DESENHO CORRIGIDA ***

function drawMap() {

    // 1. Limpa o Canvas

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    

    // 2. Desenha o chÃ£o e as bordas (mapa 10x10)

    for (let row = 0; row < 10; row++) {

        for (let col = 0; col < 10; col++) {

            const tileX = col * TILE_SIZE;

            const tileY = row * TILE_SIZE;

            const tileType = GAME_MAP[row][col];

            

            // ESSA LINHA Ã‰ ESSENCIAL PARA DESENHAR O CHÃƒO E AS PAREDES

            ctx.fillStyle = tileType === 1 ? '#696969' : '#3cb371';

            ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE); 

            // FIM DA LINHA ESSENCIAL

            

            // Desenha elementos interativos

            if (tileType === 2 && OTHER_IMAGES.gardenEntrance) { 

                ctx.drawImage(OTHER_IMAGES.gardenEntrance, tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 3 && OTHER_IMAGES.sellTile) { 

                ctx.drawImage(OTHER_IMAGES.sellTile, tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 4 && OTHER_IMAGES.seedShopTile) { 

                ctx.drawImage(OTHER_IMAGES.seedShopTile, tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 5 && OTHER_IMAGES.gearShopTile) { 

                ctx.drawImage(OTHER_IMAGES.gearShopTile, tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 6 && OTHER_IMAGES.eggShopTile) { 

                ctx.drawImage(OTHER_IMAGES.eggShopTile, tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 7 && portalFrame < PORTAL_IMAGES.length) { 

                ctx.drawImage(PORTAL_IMAGES[portalFrame], tileX, tileY, TILE_SIZE, TILE_SIZE);

            } else if (tileType === 8 && OTHER_IMAGES.expansionTile) {

                if (gameData.gardenExpansion.x < MAX_EXPANSION || gameData.gardenExpansion.y < MAX_EXPANSION) {

                    ctx.drawImage(OTHER_IMAGES.expansionTile, tileX, tileY, TILE_SIZE, TILE_SIZE);

                    ctx.fillStyle = 'black';

                    ctx.font = '10px Arial';

                    ctx.fillText(`$${EXPANSION_COST}`, tileX + 5, tileY + 35);

                }

            } else if (tileType === 1) {

                ctx.fillStyle = '#696969';

                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

            }

        }

    }



    // 3. Desenha o Jardim e os Plots

    for (let i = 0; i < gameData.plots.length; i++) {

        const p = gameData.plots[i];

        

        const plotX = p.x;

        const plotY = p.y;

        

        ctx.fillStyle = '#a0522d'; 

        ctx.fillRect(plotX, plotY, TILE_SIZE, TILE_SIZE);

        

        if (p.isPlanted) {

            const seedKey = p.seedType;

            const isIncubator = seedKey === 'incubator';

            const isHarvested = p.growthStage >= 100;



            let image = isIncubator ? OTHER_IMAGES.incubator : (isHarvested ? HARVESTED_IMAGES[seedKey] : SEED_IMAGES[seedKey]);



            if (image) {

                ctx.drawImage(image, plotX, plotY, TILE_SIZE, TILE_SIZE);

            }

            

            if (!isHarvested && !isIncubator) {

                const barHeight = 5;

                const barY = plotY + TILE_SIZE - barHeight - 2;

                ctx.fillStyle = '#606060'; 

                ctx.fillRect(plotX + 2, barY, TILE_SIZE - 4, barHeight);

                

                ctx.fillStyle = p.isWatered ? '#00bfff' : '#32cd32'; 

                ctx.fillRect(plotX + 2, barY, (TILE_SIZE - 4) * (p.growthStage / 100), barHeight);

            }

            

            if (p.mutation && !isIncubator) {

                ctx.fillStyle = 'red';

                ctx.font = '12px Arial';

                ctx.fillText(`M x${p.mutation.multiplier.toFixed(0)}`, plotX + 2, plotY + 12);

            }

        }

        

        const now = Date.now();

        if (p.wateredAt > 0 && (now - p.wateredAt) < 30 * 1000) {

            ctx.fillStyle = 'rgba(0, 191, 255, 0.5)';

            ctx.fillRect(plotX, plotY, TILE_SIZE, TILE_SIZE);

            p.isWatered = true;

        } else {

            p.isWatered = false;

        }

        

        ctx.strokeStyle = '#363636';

        ctx.strokeRect(plotX, plotY, TILE_SIZE, TILE_SIZE);

    }

    

    drawPets(); 

    

    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.color);

}

// *** FIM DA FUNÃ‡ÃƒO DE DESENHO CORRIGIDA ***





function movePlayer() {

    const newX = gameData.player.x + (keysPressed['ArrowRight'] ? gameData.player.speed : 0) - (keysPressed['ArrowLeft'] ? gameData.player.speed : 0);

    const newY = gameData.player.y + (keysPressed['ArrowDown'] ? gameData.player.speed : 0) - (keysPressed['ArrowUp'] ? gameData.player.speed : 0);



    const isColliding = (x, y) => {

        const playerCorners = [

            { col: Math.floor(x / TILE_SIZE), row: Math.floor(y / TILE_SIZE) },

            { col: Math.floor((x + PLAYER_SIZE) / TILE_SIZE), row: Math.floor(y / TILE_SIZE) },

            { col: Math.floor(x / TILE_SIZE), row: Math.floor((y + PLAYER_SIZE) / TILE_SIZE) },

            { col: Math.floor((x + PLAYER_SIZE) / TILE_SIZE), row: Math.floor((y + PLAYER_SIZE) / TILE_SIZE) }

        ];



        return playerCorners.some(pos => {

            if (pos.row < 0 || pos.row >= 10 || pos.col < 0 || pos.col >= 10) return true;

            return GAME_MAP[pos.row][pos.col] === 1; // 1 Ã© parede

        });

    };



    if (!isColliding(newX, gameData.player.y)) {

        gameData.player.x = Math.max(0, Math.min(CANVAS_WIDTH - PLAYER_SIZE, newX));

    }

    if (!isColliding(gameData.player.x, newY)) {

        gameData.player.y = Math.max(0, Math.min(CANVAS_HEIGHT - PLAYER_SIZE, newY));

    }

}





// --- 5. FUNÃ‡Ã•ES DE INTERAÃ‡ÃƒO E SHOP ---



function openShop(type) {

    closeShop(); 

    document.getElementById('shopTitle').textContent = type;

    document.getElementById('shopPanel').style.display = 'block';

    

    if (type === 'Egg Shop') {

        document.getElementById('eggShopPanel').style.display = 'block';

    } else if (type === 'Gear Shop') {

        document.getElementById('gearShopPanel').style.display = 'block';

    } else {

        document.getElementById('seedShopPanel').style.display = 'block';

    }

    

    updateShopDisplay();

}



function closeShop() {

    document.getElementById('shopPanel').style.display = 'none';

    document.getElementById('seedShopPanel').style.display = 'none';

    document.getElementById('eggShopPanel').style.display = 'none';

    document.getElementById('gearShopPanel').style.display = 'none';

}



function updateShopDisplay() {

    const renderShop = (containerId, items, isSeedShop, isSpace) => {

        const container = document.getElementById(containerId);

        container.innerHTML = ''; 



        for (const key in items) {

            const item = items[key];

            if (isSeedShop && item.isSpace !== isSpace) continue; 



            const itemDiv = document.createElement('div');

            itemDiv.className = 'shop-item';

            

            const title = document.createElement('h4');

            title.textContent = `${item.name} ($${item.cost.toFixed(2)})`;

            itemDiv.appendChild(title);



            const description = document.createElement('p');

            description.textContent = item.description || `Valor de Venda: $${item.sellValue || 0}`;

            itemDiv.appendChild(description);



            if (item.maxStock > 0) {

                 const stock = document.createElement('p');

                 stock.textContent = `Estoque: ${item.currentStock}/${item.maxStock}`;

                 itemDiv.appendChild(stock);

            }

            

            const buyButton = document.createElement('button');

            buyButton.textContent = 'Comprar';

            buyButton.onclick = () => buyItem(document.getElementById('shopTitle').textContent, key);

            

            if (item.currentStock <= 0 && item.maxStock > 0) {

                 buyButton.disabled = true;

                 buyButton.textContent = 'Esgotado';

            }

            itemDiv.appendChild(buyButton);



            container.appendChild(itemDiv);

        }

    };



    const shopTitle = document.getElementById('shopTitle').textContent;

    if (shopTitle === 'Seed Shop') {

        renderShop('seedShopPanel', SEEDS_DATA, true, false); 

    } else if (shopTitle === 'Space Shop') {

        renderShop('seedShopPanel', SEEDS_DATA, true, true); 

    } else if (shopTitle === 'Egg Shop') {

        renderShop('eggShopPanel', EGGS, false, false); 

    } else if (shopTitle === 'Gear Shop') {

        renderShop('gearShopPanel', GEAR, false, false); 

    }

    

    updateInventoryDisplay(); 

}



function restockShops() {

    for (const key in SEEDS_DATA) {

        if (SEEDS_DATA[key].maxStock > 0) {

            if (Math.random() < 0.75) { 

                SEEDS_DATA[key].currentStock = SEEDS_DATA[key].maxStock;

            }

        }

    }

    

    for (const key in GEAR) {

        const item = GEAR[key];

        if (item.maxStock > 0 && Math.random() < item.restockChance) {

            item.currentStock = item.maxStock;

        }

    }

    

    for (const key in EGGS) {

        const egg = EGGS[key];

        if (egg.maxStock > 0 && Math.random() < egg.restockChance) {

            egg.currentStock = egg.maxStock;

        }

    }



    if (document.getElementById('shopPanel').style.display === 'block') {

        updateShopDisplay();

    }

    saveGame();

}



function buyItem(shopType, itemKey) {

    const shopList = shopType === 'Seed Shop' || shopType === 'Space Shop' ? SEEDS_DATA : (shopType === 'Gear Shop' ? GEAR : EGGS);

    const itemInfo = shopList[itemKey];



    if (!itemInfo || gameData.money < itemInfo.cost || (itemInfo.currentStock <= 0 && itemInfo.maxStock > 0)) {

        showMessage(gameData.money < itemInfo.cost ? 'Dinheiro insuficiente!' : 'Item esgotado!', 'error');

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

            showMessage('InventÃ¡rio de Ovos cheio (6/6). Choque um ovo.', 'error');

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



function expandGarden(axis) {

    const maxExpansion = MAX_EXPANSION;

    if (gameData.gardenExpansion[axis] >= maxExpansion) {

        showMessage(`A expansÃ£o mÃ¡xima (${maxExpansion}x) jÃ¡ foi atingida no eixo ${axis.toUpperCase()}.`, 'error');

        return;

    }

    if (gameData.money < EXPANSION_COST) {

        showMessage(`Precisa de $${EXPANSION_COST.toFixed(2)} para expandir!`, 'error');

        return;

    }



    gameData.money -= EXPANSION_COST;

    gameData.gardenExpansion[axis]++;

    

    showMessage(`Jardim expandido no eixo ${axis.toUpperCase()}!`, 'success');

    saveGame();

    drawMap();

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

    

    showMessage(`Colheu ${amount} ${seed.name} (x${harvestBonus.toFixed(2)} bÃ´nus)!`, 'success');

    

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
     // AÃ§Ã£o: Reseta os plots conectados (4 slots)
        updateConnectedPlots(plotIndex, resetPlot);
    }
    
    saveGame();
}

function sellHarvest(itemKey, quantity) {
    if (!gameData.harvestInventory[itemKey] || gameData.harvestInventory[itemKey] < quantity) {
        showMessage('NÃ£o hÃ¡ itens suficientes para vender.', 'error');
        return;
    }
    
    const item = SEEDS_DATA[itemKey]; 
    if (!item) return;

    const sellMult = getSellMultiplier(itemKey);
    const profit = item.sellValue * quantity * sellMult;
    
    gameData.harvestInventory[itemKey] -= quantity;
    gameData.money += profit;
    
    if (gameData.harvestInventory[itemKey] <= 0) {
if ((gameData.inventory.reclaimer || 0) <= 0) {
        showMessage('VocÃª precisa de um Reclaimer no inventÃ¡rio!', 'error');
        return;
    }
    
    const seedKey = plot.seedType;
    const seed = SEEDS_DATA[seedKey];
    
    gameData.seeds[seedKey].currentStock = (gameData.seeds[seedKey].currentStock || 0) + 1;
    gameData.inventory.reclaimer -= 1;
    if (gameData.inventory.reclaimer <= 0) {
        delete gameData.inventory.reclaimer;
    }

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

    // 1. InteraÃ§Ã£o com Tiles 
    if (mapTile > 1) { 
        const tileX = mapCol * TILE_SIZE;
        const tileY = mapRow * TILE_SIZE;

        if (!isPlayerNearby(tileX, tileY)) {
            showMessage('Aproxime-se para interagir.', 'info');
            return;
        }

        closeShop();

        switch (mapTile) {
            case 2: // Entrada do Jardim
                showMessage('Bem-vindo(a) ao Jardim!', 'info');
                break;
            case 3: // Venda
                openShop('Sell Shop'); 
                break;
            case 4: // Seed Shop
                openShop('Seed Shop');
                break;
            case 5: // Gear Shop
                openShop('Gear Shop');
                break;
            case 6: // Egg Shop
                openShop('Egg Shop');
                break;
            case 7: // Portal Espacial
                if (isSpaceShopOpen()) {
                    openShop('Space Shop');
                } else {
                    showMessage('O Portal estÃ¡ fechado. Espere ele abrir!', 'info');
                }
                break;
            case 8: // ExpansÃ£o
                if (gameData.gardenExpansion.x <= gameData.gardenExpansion.y) {
                    expandGarden('x');
                } else {
                    expandGarden('y');
                }
                break;
        }
    }

    // 2. InteraÃ§Ã£o com Plots
    let plotIndex = -1;
    let clickedPlot = null;
    for (let i = 0; i < gameData.plots.length; i++) {
        const p = gameData.plots[i];
        if (clickX >= p.x && clickX < p.x + TILE_SIZE && 
            clickY >= p.y && clickY < p.y + TILE_SIZE) {
            plotIndex = i;
            clickedPlot = p;
            break;
        }
    }

    if (plotIndex !== -1) {
        let plot = clickedPlot;
        
        if (!isPlayerNearby(plot.x, plot.y)) {
            showMessage('Aproxime-se do plot para interagir.', 'info');
            return;
        }
        
        // Redireciona a aÃ§Ã£o para o plot mestre (superior-esquerdo) se for um plot 4x4
        if (plot.isPlanted && plot.seedType !== 'incubator' && SEEDS_DATA[plot.seedType].slots === 4 && !plot.isMaster) {
            
            const masterOffset = (i) => {
                // Tenta encontrar o mestre (superior-esquerdo)
                if (gameData.plots[i - 1] && gameData.plots[i - 1].isMaster && gameData.plots[i - 1].seedType === plot.seedType) return i - 1; 
                if (gameData.plots[i - INITIAL_GARDEN_WIDTH] && gameData.plots[i - INITIAL_GARDEN_WIDTH].isMaster && gameData.plots[i - INITIAL_GARDEN_WIDTH].seedType === plot.seedType) return i - INITIAL_GARDEN_WIDTH; 
                if (gameData.plots[i - INITIAL_GARDEN_WIDTH - 1] && gameData.plots[i - INITIAL_GARDEN_WIDTH - 1].isMaster && gameData.plots[i - INITIAL_GARDEN_WIDTH - 1].seedType === plot.seedType) return i - INITIAL_GARDEN_WIDTH - 1; 
                return i; 
            }
            
            plotIndex = masterOffset(plotIndex);
            plot = gameData.plots[plotIndex]; 
        }

        
        const selectedKey = gameData.selectedItem;

        if (SEEDS_DATA[selectedKey]) {
            const seed = SEEDS_DATA[selectedKey];
            
            if (plot.isPlanted || gameData.seeds[selectedKey].currentStock <= 0) {
                showMessage(plot.isPlanted ? 'Plot jÃ¡ plantado!' : 'Semente esgotada!', 'error');
                return;
            }

            // Plantio Multi-Slot
            if (seed.slots === 4) {
                let slotsAvailable = true;
                const adjacentIndices = [plotIndex + 1, plotIndex + INITIAL_GARDEN_WIDTH, plotIndex + INITIAL_GARDEN_WIDTH + 1];
                
                if (plotIndex % INITIAL_GARDEN_WIDTH === INITIAL_GARDEN_WIDTH - 1 || 
                    Math.floor(plotIndex / INITIAL_GARDEN_WIDTH) === INITIAL_GARDEN_HEIGHT - 1) {
                    slotsAvailable = false; 
                }
                
                for(const idx of adjacentIndices) {
                     if (!gameData.plots[idx] || gameData.plots[idx].isPlanted) {
                         slotsAvailable = false;
                         break;
                     }
                }
                
                if (slotsAvailable) {
                    gameData.seeds[selectedKey].currentStock--;
                    plot.isPlanted = true;
                    plot.seedType = selectedKey;
                    plot.isMaster = true;
                    plot.linkedPlots = adjacentIndices;
                    
                    adjacentIndices.forEach(idx => {
                        if (gameData.plots[idx]) {
                            gameData.plots[idx].isPlanted = true;
                            gameData.plots[idx].seedType = selectedKey;
                        }
                    });

                    showMessage(`Plantou ${seed.name} (4 slots)!`, 'success');
                } else {
                    showMessage('NÃ£o hÃ¡ 4 slots livres na Ã¡rea selecionada!', 'error');
                    return;
                }
            } else {
                // Plantio Single-Slot
                gameData.seeds[selectedKey].currentStock--;
                plot.isPlanted = true;
                plot.seedType = selectedKey;
                plot.isMaster = true; 
                
                showMessage(`Plantou ${seed.name} (1 slot)!`, 'success');
            }
            
            gameData.selectedItem = 'none';
            saveGame();
            updateInventoryDisplay();

        } else {
            // InteraÃ§Ã£o com Ferramentas
            switch (gameData.selectedItem) {
                case 'wateringCan':
                    if (plot.isPlanted && plot.growthStage < 100) {
                        plot.wateredAt = Date.now();
                        
                        if (SEEDS_DATA[plot.seedType] && SEEDS_DATA[plot.seedType].slots === 4) {
                            updateConnectedPlots(plotIndex, (p) => p.wateredAt = Date.now());
                        }
                        
                        showMessage('Plot regado!', 'info');
                    }
                    break;
                    
                case 'reclaimer':
                    reclaimSeed(plotIndex);
                    break;

                case 'incubator':
                    if (!plot.isPlanted) {
                         if (gameData.inventory.incubator > 0) {
                            gameData.inventory.incubator--;
                            plot.isPlanted = true;
                            plot.seedType = 'incubator';
                            gameData.incubator.isPlanted = true;
                            gameData.incubator.plotIndex = plotIndex;
                            gameData.selectedItem = 'none';
                            showMessage('Incubadora instalada! Coloque um ovo no inventÃ¡rio.', 'success');
                         } else {
                            showMessage('VocÃª nÃ£o tem Incubadoras no inventÃ¡rio.', 'error');
                         }
                    }
                    break;

                case 'none':
                    // Tenta Colher/Chocar
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
        saveGame();
        updateInventoryDisplay();
    }
}

function hatchEgg() {
    if (!gameData.incubator.egg || !gameData.incubator.isPlanted) return;

    const timeElapsed = Date.now() - gameData.incubator.startTime;
    const remainingTime = gameData.incubator.hatchTime - timeElapsed;
    
    if (remainingTime <= 0) {
        const eggKey = gameData.incubator.egg.key;
        const eggData = EGGS[eggKey];
        
        const petKey = getWeightedRandom(eggData.pets, eggData.chance);
        
        // Remove o plot da incubadora e reseta
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
        resetPlot(gameData.plots[gameData.incubator.plotIndex]);
        
        gameData.pet = PETS[petKey]; 
        gameData.incubator = JSON.parse(JSON.stringify(INITIAL_DATA.incubator));
        
        showMessage(`Ovo chocado! VocÃª ganhou: ${gameData.pet.name}!`, 'success');
    } else {
        const minutes = Math.ceil(remainingTime / 60000);
        showMessage(`Faltam ${minutes} minutos para chocar.`, 'info');
    }
    
    saveGame();
    updateInventoryDisplay();
}


function updateInventoryDisplay() {
    document.getElementById('moneyDisplay').textContent = gameData.money.toFixed(2) + 'Â¢';
    document.getElementById('petDisplay').textContent = gameData.pet.name;

    const renderInventory = (containerId, items, isHarvest) => {
        const container = document.getElementById(containerId);
        container.innerHTML = ''; 
        
        const currentInventory = isHarvest ? gameData.harvestInventory : gameData.inventory;

        for (const key in currentInventory) {
            const amount = currentInventory[key];
            if (amount <= 0) continue; 

            const item = isHarvest ? SEEDS_DATA[key] : (GEAR[key] || SEEDS_DATA[key]);
            if (!item) continue; 
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'inventory-item';
            
            const title = document.createElement('h4');
            title.textContent = `${item.name} (${amount})`;
            itemDiv.appendChild(title);
            
            if (!isHarvest) {
                const selectButton = document.createElement('button');
                selectButton.textContent = (gameData.selectedItem === key) ? 'Selecionado' : 'Selecionar';
                selectButton.onclick = () => {
                    gameData.selectedItem = (gameData.selectedItem === key) ? 'none' : key;
                    saveGame();
                    updateInventoryDisplay();
                };
                itemDiv.appendChild(selectButton);
            } else {
                 const sellButton = document.createElement('button');
                 sellButton.textContent = 'Vender 1';
                 sellButton.onclick = () => sellHarvest(key, 1);
                 itemDiv.appendChild(sellButton);
            }

            container.appendChild(itemDiv);
        }
    };
    
    renderInventory('currentInventory', gameData.inventory, false); 
    renderInventory('harvestInventoryDisplay', gameData.harvestInventory, true); 
    
    const eggInv = document.getElementById('eggInventoryDisplay');
    eggInv.innerHTML = '';
    
    if (gameData.incubator.isPlanted && gameData.incubator.egg) {
         const eggData = EGGS[gameData.incubator.egg.key];
         const remainingTime = gameData.incubator.hatchTime - (Date.now() - gameData.incubator.startTime);
         const minutes = Math.max(0, Math.ceil(remainingTime / 60000));
         
         const incubatingDiv = document.createElement('div');
         incubatingDiv.className = 'egg-incubating';
         incubatingDiv.textContent = `${eggData.name} (Chocando: ${minutes}m)`;
         eggInv.appendChild(incubatingDiv);
    } else {
        gameData.eggInventory.forEach((egg, index) => {
            const eggData = EGGS[egg.key];
            const eggDiv = document.createElement('div');
            eggDiv.textContent = `1x ${eggData.name}`;
            
            const useButton = document.createElement('button');
            useButton.textContent = 'Usar';
            useButton.onclick = () => {
                if (gameData.incubator.plotIndex !== -1 && !gameData.incubator.egg) {
                    gameData.incubator.egg = gameData.eggInventory.splice(index, 1)[0];
                    gameData.incubator.startTime = Date.now();
                    gameData.incubator.hatchTime = EGGS[gameData.incubator.egg.key].hatchTime;
                    showMessage(`Ovo ${eggData.name} colocado na Incubadora!`, 'success');
                } else if (gameData.incubator.egg) {
                    showMessage('A incubadora jÃ¡ estÃ¡ chocando um ovo.', 'error');
                } else {
                    showMessage('VocÃª precisa instalar uma Incubadora no jardim (Gear Shop).', 'error');
                }
                saveGame();
                updateInventoryDisplay();
            };
            eggDiv.appendChild(useButton);
            eggInv.appendChild(eggDiv);
        });
    }
    
    if (document.getElementById('shopPanel').style.display === 'block') {
         updateShopDisplay();
    }
}


function updateGame() {
    const now = Date.now();
    const deltaTime = now - (gameData.lastUpdate || now);
    
    calculatePortalFrame(now); 
    
    if (now - lastRestockTime >= RESTOCK_INTERVAL) {
        restockShops();
        lastRestockTime = now;
        showMessage('Lojas reestocadas!', 'event');
    }
    
    movePlayer();
    
    checkPetAbilities(deltaTime);

    for (let i = 0; i < gameData.plots.length; i++) {
        const plot = gameData.plots[i];
        
        if (plot.isPlanted && plot.growthStage < 100 && plot.isMaster && plot.seedType !== 'incubator') {
            
            // 1. LÃ³gica de Sprinklers
            if (!plot.isWatered) {
                let sprinklerChance = 0;
                sprinklerChance += (gameData.inventory.basicSprinkler || 0) * 0.30;
                sprinklerChance += (gameData.inventory.proSprinkler || 0) * 0.60;
                
                if (Math.random() < sprinklerChance) {
                    plot.wateredAt = Date.now();
                    
                    if (SEEDS_DATA[plot.seedType].slots === 4) {
                       updateConnectedPlots(i, (p) => p.wateredAt = Date.now());
                    }
                }
            }
            
            // 2. CÃ¡lculo do Crescimento
            const isWatered = (now - plot.wateredAt) < 30 * 1000; 
            const growthTimeMS = getGrowthTime(plot.seedType, isWatered); 
            
            const growthIncrease = (deltaTime / growthTimeMS) * 100; 
            plot.growthStage = Math.min(100, plot.growthStage + growthIncrease);
            
            // 3. PropagaÃ§Ã£o do Crescimento para Plots 4x4
            if (SEEDS_DATA[plot.seedType].slots === 4) {
                 updateConnectedPlots(i, (p) => {
                     p.growthStage = plot.growthStage;
                     p.wateredAt = plot.wateredAt; 
                 });
            }
        }
    }

    gameData.lastUpdate = now;
    saveGame();
    drawMap(); 
    updateInventoryDisplay();
    requestAnimationFrame(updateGame);
}

// InicializaÃ§Ã£o
loadImages();

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    // Liga o Canvas
    const canvas = document.getElementById('gardenCanvas');
    if (canvas) {
        canvas.addEventListener('click', handleClick);
    }
    
    // Liga os Controles de Movimento
    document.addEventListener('keydown', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keysPressed[e.key] = true;
            isMoving = true;
        }
        
        if (e.key === 'Escape') {
            closeShop();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            keysPressed[e.key] = false;
            if (!Object.values(keysPressed).some(v => v === true)) {
                isMoving = false;
            }
        }
    });
    
    // Placeholder para botÃµes de aÃ§Ã£o (caso existam no HTML)
    const regarBtn = document.getElementById('regadorButton');
    if (regarBtn) {
        regarBtn.addEventListener('click', () => showMessage('Funcionalidade "Regar Tudo" nÃ£o implementada.', 'info'));
    }
    
    const colherBtn = document.getElementById('colherButton');
    if (colherBtn) {
        colherBtn.addEventListener('click', () => showMessage('Funcionalidade "Colher Tudo" nÃ£o implementada.', 'info'));
    }
});
