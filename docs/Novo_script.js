// --- 1. CONFIGURAÇÕES E DADOS GLOBAIS ---

// Base64 da sua imagem PNG de 400x400 (Mapa Principal)
// Usado para garantir que o fundo carregue imediatamente.
const MAP_BACKGROUND_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQAQMAAAC6M54AAAABlBMVEUAAAD///+l2QzIAAAAAXRSTlMAQObYZgAAAFRJREFUeNrtwTEBAAAAgiD7p4bT3xI+yAAAAAABAIABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAABAIAAAAAAAAAAPconst PLAYER_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Player_placeholder.png'; 

const canvas = document.getElementById('gardenCanvas');
let ctx;
if (canvas) {
    ctx = canvas.getContext('2d');
}


const TILE_SIZE = 40;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 400;

if (canvas) {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
}


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
const GARDEN_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Garden_entrance.png'; // Entrada do Jardim (Tile 2)
const INCUBATOR_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Incubator_placeholder.png'; 
const EGG_INVENTORY_IMAGE_URL = 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Egg_inventory_placeholder.png'; 

const PORTAL_FRAMES_URLS = [
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Portal_aberto.png',     
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_1.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_2.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_3.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_4.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/Sprites/Portal_fechando_5.png',  
    'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Portal_fechado.png'      
];

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

const PETS = { 
    none: { name: 'Nenhum', bonus: 1.0, ability: 'none', color: '#606060', chance: 0, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Nenhum.png' }, 
    bunny: { name: 'Coelho', bonus: 1.1, ability: 'harvest', color: '#f5f5dc', chance: 0.50, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Bunny_pet.png' }, 
    fox: { name: 'Raposa', bonus: 1.25, ability: 'harvest', color: '#ff4500', chance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Fox_pet.png' },
    dragon: { name: 'Dragão', bonus: 1.5, ability: 'harvest', color: '#b22222', chance: 0.10, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Dragon_pet.png' },
    goldenLab: { name: 'Lab. Dourado', bonus: 1.0, ability: 'mutation_boost', color: '#ffd700', chance: 0.08, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Golden_lab_pet.png' },
    phoenix: { name: 'Fênix', bonus: 1.0, ability: 'water_time', color: '#ff4500', chance: 0.02, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Phoenix_pet.png' },
    cosmicLab: { name: 'Cosmic Lab', bonus: 1.0, ability: 'dig_space_seed', color: '#e0ffff', chance: 0.40, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_lab_pet.png' },
    superStar: { name: 'Super Star', bonus: 1.0, ability: 'cosmic_touch', color: '#ffd700', chance: 0.30, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Super_star_pet.png' },
    alien: { name: 'Alien', bonus: 1.0, ability: 'alien_form', color: '#9932cc', chance: 0.25, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Alien_pet.png' },
};

const EGGS = { 
    commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', maxStock: 5, currentStock: 5, pets: ['bunny', 'fox', 'dragon', 'goldenLab', 'phoenix'], chance: [0.70, 0.20, 0.07, 0.02, 0.01], restockChance: 1.0, hatchTime: 5 * 60 * 1000, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Common_egg.png' }, 
    rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', maxStock: 3, currentStock: 3, pets: ['fox', 'dragon', 'goldenLab', 'phoenix'], chance: [0.40, 0.30, 0.20, 0.10], restockChance: 0.65, hatchTime: 10 * 60 * 1000, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Rare_egg.png' },
    legendaryEgg: { name: 'Ovo Lendário', cost: 25000, color: '#ffd700', maxStock: 1, currentStock: 1, pets: ['dragon', 'goldenLab', 'phoenix'], chance: [0.35, 0.40, 0.25], restockChance: 0.33, hatchTime: 15 * 60 * 1000, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Legendary_egg.png' },
    spaceEgg: { name: 'Ovo Espacial', cost: 100000, color: '#8a2be2', maxStock: 1, currentStock: 0, pets: ['cosmicLab', 'superStar', 'alien'], chance: [0.50, 0.30, 0.20], restockChance: 0.63, hatchTime: 20 * 60 * 1000, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_egg.png' }
};

const GEAR = { 
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas", maxStock: 10, currentStock: 10, restockChance: 1.0, isTool: true },
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto", maxStock: 5, currentStock: 5, restockChance: 0.87 }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto", maxStock: 2, currentStock: 2, restockChance: 0.63 },
    reclaimer: { name: 'Reclaimer', cost: 500, description: "Remove a semente do jardim, retornando-a.", maxStock: 5, currentStock: 5, restockChance: 0.36, isTool: true },
    incubator: { name: 'Incubadora', cost: 5000, description: "Choca ovos. Ocupa 1 slot no jardim.", maxStock: 1, currentStock: 1, restockChance: 1.0, isPlottable: true, isMaster: true, slots: 1, color: '#f0f8ff' },
};

const SEEDS_DATA_BASE = {
    carrot: { name: 'Cenoura', cost: 10, sellValue: 10, growTime: 10, harvestAmount: 1, slots: 1, type: 'single', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Carrot_harvest.png' },
    pumpkin: { name: 'Abóbora', cost: 50, sellValue: 30, growTime: 30, harvestAmount: 3, slots: 4, type: 'multi', imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Pumpkin_harvest.png' },
};

const SPACE_SEEDS = {
    starfruit: { name: 'Starfruit', cost: 5000, sellValue: 500, growTime: 60, harvestAmount: 5, slots: 1, type: 'single', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Starfruit_harvest.png' },
    cosmicTree: { name: 'Cosmic Tree', cost: 20000, sellValue: 2000, growTime: 120, harvestAmount: 10, slots: 4, type: 'multi', isSpace: true, imageURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_seed.png', harvestedURL: 'https://raw.githubusercontent.com/kainanssa-gif/GrowAGarden/main/assets/Cosmic_harvest.png' },
};

const SEEDS_DATA = Object.assign({}, SEEDS_DATA_BASE, SPACE_SEEDS);

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

function hardReset() {
    localStorage.removeItem(SAVE_KEY);
    window.location.reload(); 
}

document.addEventListener('DOMContentLoaded', () => {
    const adminButton = document.getElementById('adminButton');
    if (adminButton) {
        adminButton.addEventListener('click', hardReset);
    }
});

// NOVO: Imagem do Fundo Carregada a partir do Base64
const mapBackgroundImg = new Image();
mapBackgroundImg.src = MAP_BACKGROUND_BASE64;
let isMapBackgroundLoaded = false;
mapBackgroundImg.onload = () => {
    isMapBackgroundLoaded = true;
};

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
            // Se esta for a última falha, ainda tentamos iniciar o jogo
            if (imagesLoaded === totalImages) {
                initGame();
                requestAnimationFrame(updateGame);
            }
        };
        img.src = url;
        if (targetObject && key) {
            targetObject[key] = img;
        } else if (targetObject) {
            targetObject.push(img);
        }
        totalImages++;
    };

    // Imagem do Jogador (Fallback se o pet não tiver imagem)
    OTHER_IMAGES.playerPlaceholder = new Image();
    OTHER_IMAGES.playerPlaceholder.src = PLAYER_IMAGE_URL;

    // 1. Carregar Sprites Estáticos (Apenas os dinâmicos/placeholders)
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
    
    // Se não houver imagens, iniciar imediatamente
    // (O background em Base64 já está carregado)
    if (totalImages === 0) {
        initGame();
        requestAnimationFrame(updateGame);
    }
}

function initGame() {
    const savedData = localStorage.getItem(SAVE_KEY);
    
    if (savedData) {
        try {
            gameData = JSON.parse(savedData);
            
            if (typeof gameData.pet === 'string') {
                gameData.pet = PETS[gameData.pet.replace(/ /g, '')] || PETS.none;
            } else if (!gameData.pet || !PETS[gameData.pet.name.replace(/ /g, '')]) {
                gameData.pet = PETS.none;
            }

            if (!gameData.player.color) { 
                gameData.player.color = INITIAL_DATA.player.color;
            }

            if (gameData.incubator && gameData.incubator.egg) {
                gameData.incubator.egg = EGGS[gameData.incubator.egg.name.replace(/ /g, '').replace(/\./g, '')] || null;
            }
            
        } catch (e) {
            console.error("Dados salvos corrompidos. Iniciando novo jogo.");
            gameData = JSON.parse(JSON.stringify(INITIAL_DATA));
            createInitialPlots();
        }
    } else {
        createInitialPlots();
    }
    
    // Restaura o estoque
    updateStock(true); 
    
    // Configura o portal
    if (gameData.lastSpaceShopOpen > 0) {
        const timeElapsed = Date.now() - gameData.lastSpaceShopOpen;
        const animationTimeElapsed = Date.now() - (gameData.lastSpaceShopOpen - ANIMATION_DURATION_MS);
        
        if (timeElapsed >= OPEN_DURATION_MS) {
            portalFrame = FRAME_COUNT; // Fechado
        } else if (animationTimeElapsed < ANIMATION_DURATION_MS) {
            // Animação de fechamento
            const frameIndex = Math.floor((animationTimeElapsed / ANIMATION_DURATION_MS) * FRAME_COUNT);
            portalFrame = Math.min(frameIndex, FRAME_COUNT - 1);
        } else {
            portalFrame = 0; // Aberto
        }
    }
    
    // Sincronizar o estado do incubador com os plots
    if (gameData.incubator.isPlanted && gameData.incubator.plotIndex !== -1) {
        const plot = gameData.plots[gameData.incubator.plotIndex];
        if (plot && plot.isMaster && plot.seedType === 'incubator') {
            plot.growthStage = 1; // Marcar como "plantado"
        } else {
            // Se o plot não for mais um incubador, resetamos o estado.
            gameData.incubator = JSON.parse(JSON.stringify(INITIAL_DATA.incubator));
        }
    } else {
        // Se o estado interno diz que não está plantado, garantimos que o plot também não esteja
        if (gameData.incubator.plotIndex !== -1 && gameData.plots[gameData.incubator.plotIndex]) {
             // Limpa o plot se ele estiver referenciando o incubador antigo
             const plot = gameData.plots[gameData.incubator.plotIndex];
             if (plot.isMaster && plot.seedType === 'incubator') {
                 gameData.plots[gameData.incubator.plotIndex] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0])); 
             }
        }
    }
}

function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
}

function updateStock(isInitialLoad = false) {
    let hasRestocked = false;
    const now = Date.now();
    
    // Garante que a primeira atualização de estoque não ocorra imediatamente se o tempo já tiver passado
    if (isInitialLoad && now - lastRestockTime >= RESTOCK_INTERVAL) {
        lastRestockTime = now - (now % RESTOCK_INTERVAL); // Alinha ao último intervalo
    } else if (now - lastRestockTime < RESTOCK_INTERVAL) {
        return; 
    }

    if (now - lastRestockTime >= RESTOCK_INTERVAL) {
        lastRestockTime = now;
        hasRestocked = true;
    }
    
    // Atualiza Estoque de Ovos
    for (const key in EGGS) {
        const egg = EGGS[key];
        if (egg.currentStock < egg.maxStock && hasRestocked) {
            if (Math.random() < egg.restockChance) {
                egg.currentStock++;
            }
        }
        // Sincroniza o objeto EGGS em gameData.seeds (temporariamente para evitar falhas de referências)
        if (!gameData.seeds[key]) {
            gameData.seeds[key] = egg;
        } else {
            gameData.seeds[key].currentStock = egg.currentStock;
            gameData.seeds[key].maxStock = egg.maxStock;
        }
    }
    
    // Atualiza Estoque de Equipamentos (Gear)
    for (const key in GEAR) {
        const gear = GEAR[key];
        if (gear.currentStock < gear.maxStock && hasRestocked) {
            if (Math.random() < gear.restockChance) {
                gear.currentStock++;
            }
        }
        if (!gameData.seeds[key]) {
            gameData.seeds[key] = gear; 
        } else {
            gameData.seeds[key].currentStock = gear.currentStock;
            gameData.seeds[key].maxStock = gear.maxStock;
        }
    }
    
    if (hasRestocked) {
        showMessage('O estoque das lojas foi atualizado!', 'info');
        saveGame();
    }
}

// --- 3. LÓGICA DO JOGADOR E COLISÃO ---

function getMapTile(x, y) {
    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);

    if (row >= 0 && row < GAME_MAP.length && col >= 0 && col < GAME_MAP[0].length) {
        return GAME_MAP[row][col];
    }
    return 1; // Assume parede fora dos limites
}

function checkCollision(x, y, dx, dy) {
    const playerFutureX = x + dx;
    const playerFutureY = y + dy;

    // Define os cantos do jogador (simplificado para o centro do tile para colisão com a parede)
    const corners = [
        [playerFutureX, playerFutureY], // Canto superior esquerdo
        [playerFutureX + PLAYER_SIZE, playerFutureY], // Canto superior direito
        [playerFutureX, playerFutureY + PLAYER_SIZE], // Canto inferior esquerdo
        [playerFutureX + PLAYER_SIZE, playerFutureY + PLAYER_SIZE] // Canto inferior direito
    ];

    for (const [cx, cy] of corners) {
        const tile = getMapTile(cx, cy);

        // Se colidir com '1' (Parede/Borda)
        if (tile === 1) {
            return true; 
        }
    }
    return false;
}

function checkTileInteraction(x, y, item) {
    const tile = getMapTile(x, y);

    // Tipos de interação (Tile numbers):
    // 2: Garden Entrance (Entrada do Jardim)
    // 3: Sell (Venda)
    // 4: Seed Shop (Loja de Sementes)
    // 5: Gear Shop (Loja de Equipamentos)
    // 6: Egg Shop (Loja de Ovos)
    // 7: Portal/Space Shop
    
    const shopType = { 
        4: 'seedShop', 
        5: 'gearShop', 
        6: 'eggShop', 
        7: 'spaceShop' 
    };

    if (shopType[tile]) {
        if (shopType[tile] === 'spaceShop' && portalFrame !== 0) {
            // Se for a loja espacial, e o portal estiver fechado, não abre
            showMessage('O Portal Espacial está fechado!', 'error');
            return;
        }
        openShop(shopType[tile]);
        return;
    }
    
    if (tile === 3) {
        // Interação com o tile de Venda
        openSellInterface();
        return;
    }
    
    if (tile === 2) {
        // Interação com o tile de Entrada do Jardim
        if (item === 'wateringCan') {
            waterAllPlots();
            return;
        }
        // Se o jogador estiver no tile de entrada (2) e não tiver nenhum item de ação selecionado, 
        // ou se o jardim estiver cheio, ele não pode plantar plots.
    }
}

// --- 4. LÓGICA DO JARDIM E PLOTS ---

function createInitialPlots() {
    gameData.plots = [];
    const startX = 2; // Coluna 2
    const startY = 2; // Linha 2
    
    for (let i = 0; i < INITIAL_GARDEN_WIDTH * INITIAL_GARDEN_HEIGHT; i++) {
        const colOffset = i % INITIAL_GARDEN_WIDTH;
        const rowOffset = Math.floor(i / INITIAL_GARDEN_WIDTH);
        
        const x = (startX + colOffset) * TILE_SIZE;
        const y = (startY + rowOffset) * TILE_SIZE;
        
        gameData.plots.push({
            x: x, y: y, 
            isPlanted: false, 
            seedType: 'none', 
            growthStage: 0,
            isWatered: false, 
            wateredAt: 0, 
            isMaster: false, 
            mutation: null, 
            linkedPlots: null
        });
    }
}

function getPlotAt(playerX, playerY) {
    const playerCenterX = playerX + PLAYER_SIZE / 2;
    const playerCenterY = playerY + PLAYER_SIZE / 2;

    for (let i = 0; i < gameData.plots.length; i++) {
        const p = gameData.plots[i];
        
        // Verifica se o centro do player está dentro dos limites do plot
        if (playerCenterX >= p.x && playerCenterX < p.x + TILE_SIZE &&
            playerCenterY >= p.y && playerCenterY < p.y + TILE_SIZE) {
            
            return { plot: p, index: i };
        }
    }
    return null;
}

function canPlant(plot, seed) {
    if (plot.isPlanted) {
        showMessage('Este plot já está ocupado.', 'error');
        return false;
    }
    if (seed.slots === 4 && !is4x4Available(plot)) {
        showMessage('Não há espaço 2x2 suficiente para esta semente.', 'error');
        return false;
    }
    if (gameData.inventory[seed.name.toLowerCase()] <= 0) {
        showMessage(`Você não tem ${seed.name} suficiente.`, 'error');
        return false;
    }
    return true;
}

function getPlotsForMulti(masterPlotIndex, size = 4) {
    const cols = (gameData.gardenExpansion.x + INITIAL_GARDEN_WIDTH);
    const masterPlot = gameData.plots[masterPlotIndex];
    if (!masterPlot || size !== 4) return [masterPlot]; // Apenas o mestre para sementes 1x1

    const plots = [masterPlot];
    const indices = [masterPlotIndex];
    
    const row = Math.floor(masterPlotIndex / cols);
    const col = masterPlotIndex % cols;

    // Tenta incluir os 4 tiles do 2x2
    const potentialIndices = [
        masterPlotIndex + 1,        // Canto superior direito
        masterPlotIndex + cols,     // Canto inferior esquerdo
        masterPlotIndex + cols + 1  // Canto inferior direito
    ];

    for (const index of potentialIndices) {
        const p = gameData.plots[index];
        const pRow = Math.floor(index / cols);
        const pCol = index % cols;

        // Verifica se o plot existe, não está plantado e está adjacente
        if (p && !p.isPlanted && pRow < row + 2 && pCol < col + 2 && pCol >= col && pRow >= row) {
            plots.push(p);
            indices.push(index);
        }
    }

    return plots.length === size ? { plots: plots, indices: indices } : null;
}

function is4x4Available(masterPlot) {
    // Isso é uma simplificação para o seu jardim 4x4 original.
    // O código original não tinha expansão horizontal/vertical.
    // Vamos apenas verificar se é 2x2 dentro da matriz de plots.
    
    const masterIndex = gameData.plots.indexOf(masterPlot);
    if (masterIndex === -1) return false;

    const cols = (gameData.gardenExpansion.x + INITIAL_GARDEN_WIDTH);
    const row = Math.floor(masterIndex / cols);
    const col = masterIndex % cols;
    
    // Verifica se o 2x2 se encaixa no limite da área 4x4
    if (col + 1 >= INITIAL_GARDEN_WIDTH || row + 1 >= INITIAL_GARDEN_HEIGHT) {
        return false;
    }
    
    // Verifica se os 3 plots adjacentes estão livres
    const adjacentIndices = [
        masterIndex + 1,        
        masterIndex + cols,     
        masterIndex + cols + 1  
    ];
    
    for (const index of adjacentIndices) {
        const p = gameData.plots[index];
        if (!p || p.isPlanted) {
            return false;
        }
    }
    return true;
}

function plantSeed(plot, seed) {
    if (!canPlant(plot, seed)) return;
    
    if (seed.type === 'multi' && seed.slots === 4) {
        const result = getPlotsForMulti(gameData.plots.indexOf(plot));
        if (!result) {
            showMessage('Não há espaço 2x2 disponível para esta semente.', 'error');
            return;
        }
        
        plot.isPlanted = true;
        plot.seedType = seed.name.toLowerCase();
        plot.growthStage = 1;
        plot.isMaster = true; 
        plot.linkedPlots = result.indices;
        plot.wateredAt = Date.now();
        plot.isWatered = true;
        
        // Ocupa os plots adjacentes
        for (let i = 1; i < result.plots.length; i++) {
            const linkedPlot = result.plots[i];
            linkedPlot.isPlanted = true;
            linkedPlot.seedType = seed.name.toLowerCase();
            linkedPlot.growthStage = 1;
            linkedPlot.isWatered = true;
        }
        
        gameData.inventory[seed.name.toLowerCase()]--;
        showMessage(`Você plantou ${seed.name} em 2x2!`, 'success');
    } else {
        plot.isPlanted = true;
        plot.seedType = seed.name.toLowerCase();
        plot.growthStage = 1; 
        plot.isMaster = true; 
        plot.wateredAt = Date.now();
        plot.isWatered = true;
        
        gameData.inventory[seed.name.toLowerCase()]--;
        showMessage(`Você plantou ${seed.name}!`, 'success');
    }

    saveGame();
}

function waterPlot(plot) {
    if (!plot.isPlanted) {
        showMessage('Nada para regar aqui.', 'error');
        return;
    }
    if (plot.isWatered) {
        showMessage('Este plot já está regado.', 'info');
        return;
    }
    if (plot.seedType === 'incubator') {
        showMessage('Ovos não precisam ser regados.', 'info');
        return;
    }
    
    if (gameData.inventory.wateringCan <= 0) {
        showMessage('Você não tem um regador!', 'error');
        return;
    }
    
    plot.isWatered = true;
    plot.wateredAt = Date.now();
    showMessage(`Você regou a(o) ${plot.seedType}!`, 'success');

    // Se for multi-plot, rega os plots adjacentes
    if (plot.isMaster && plot.linkedPlots) {
        for (const index of plot.linkedPlots) {
            const linkedPlot = gameData.plots[index];
            if (linkedPlot) {
                linkedPlot.isWatered = true;
                linkedPlot.wateredAt = plot.wateredAt; 
            }
        }
    }
    saveGame();
}

function waterAllPlots() {
    let count = 0;
    for (const plot of gameData.plots) {
        if (plot.isPlanted && !plot.isWatered && plot.seedType !== 'incubator' && plot.isMaster) {
            plot.isWatered = true;
            plot.wateredAt = Date.now();
            count++;
            
            // Rega os plots ligados
            if (plot.linkedPlots) {
                 for (const index of plot.linkedPlots) {
                     const linkedPlot = gameData.plots[index];
                     if (linkedPlot) {
                         linkedPlot.isWatered = true;
                         linkedPlot.wateredAt = plot.wateredAt; 
                     }
                 }
             }
        }
    }
    if (count > 0) {
        showMessage(`Você regou ${count} plots!`, 'success');
        saveGame();
    } else {
        showMessage('Nenhum plot precisava ser regado.', 'info');
    }
}

function harvestPlot(plot) {
    if (!plot.isPlanted || plot.growthStage !== 3) {
        showMessage('Não há nada pronto para colher aqui.', 'error');
        return;
    }
    if (plot.seedType === 'incubator') {
        hatchEgg();
        return;
    }

    const seedName = plot.seedType;
    const seedData = SEEDS_DATA[seedName];
    const amount = seedData.harvestAmount;
    
    // Calcula bônus do pet
    const finalAmount = Math.floor(amount * gameData.pet.bonus);
    
    // Adiciona ao inventário
    gameData.harvestInventory[seedName] = (gameData.harvestInventory[seedName] || 0) + finalAmount;
    
    // Limpa o(s) plot(s)
    if (plot.isMaster && plot.linkedPlots) {
        for (const index of plot.linkedPlots) {
            if (gameData.plots[index]) {
                gameData.plots[index] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0])); 
            }
        }
    } else {
        gameData.plots[gameData.plots.indexOf(plot)] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0]));
    }
    
    showMessage(`Você colheu ${finalAmount}x ${seedName}!`, 'success');
    gameData.selectedItem = 'none'; // Deseleciona o item após colher (se fosse uma ferramenta de colheita)
    saveGame();
}

function removePlot(plot) {
    if (!plot.isPlanted) {
        showMessage('Este plot já está vazio.', 'error');
        return;
    }
    
    if (plot.seedType === 'incubator') {
        showMessage('Use o Incubador para remover o ovo.', 'error');
        return;
    }
    
    // Retorna a semente ao inventário
    if (gameData.inventory[plot.seedType] !== undefined) {
        gameData.inventory[plot.seedType]++;
    } else {
        gameData.inventory[plot.seedType] = 1;
    }
    
    // Limpa o(s) plot(s)
    if (plot.isMaster && plot.linkedPlots) {
        for (const index of plot.linkedPlots) {
            if (gameData.plots[index]) {
                gameData.plots[index] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0])); 
            }
        }
    } else {
        gameData.plots[gameData.plots.indexOf(plot)] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0]));
    }
    
    showMessage(`Semente de ${plot.seedType} removida e devolvida.`, 'info');
    gameData.selectedItem = 'none'; 
    saveGame();
}


// --- 5. LÓGICA DE LOJAS E INTERFACES ---

function openShop(type) {
    // Implementação da abertura de loja (que atualiza o HTML)
    const shopDiv = document.getElementById('shopInterface');
    const shopTitle = document.getElementById('shopTitle');
    const shopContent = document.getElementById('shopContent');

    if (!shopDiv || !shopTitle || !shopContent) return;

    // Atualiza título
    let title = '';
    let items = {};
    let itemData = {};
    let isSeedShop = false;
    let isEggShop = false;
    let isGearShop = false;
    
    switch (type) {
        case 'seedShop':
            title = 'Loja de Sementes';
            items = gameData.seeds;
            itemData = SEEDS_DATA;
            isSeedShop = true;
            break;
        case 'gearShop':
            title = 'Loja de Equipamentos';
            items = GEAR;
            itemData = GEAR;
            isGearShop = true;
            break;
        case 'eggShop':
            title = 'Loja de Ovos';
            items = EGGS;
            itemData = EGGS;
            isEggShop = true;
            break;
        case 'spaceShop':
            title = 'Loja Espacial (Portal)';
            items = SPACE_SEEDS;
            itemData = SPACE_SEEDS;
            isSeedShop = true; // Compartilha lógica de sementes
            break;
        default:
            return;
    }
    
    shopTitle.textContent = title;
    shopContent.innerHTML = '';
    
    // Gera o conteúdo da loja
    for (const key in itemData) {
        const data = itemData[key];
        const currentStock = items[key].currentStock !== undefined ? items[key].currentStock : -1; // -1 significa ilimitado
        
        // Se for loja espacial e o item não for espacial, pula
        if (type === 'spaceShop' && !data.isSpace) continue;
        
        // Se não for loja espacial e o item for espacial, pula
        if (type !== 'spaceShop' && data.isSpace) continue;


        // Cria o elemento do item
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        let stockDisplay = '';
        if (currentStock >= 0) {
            stockDisplay = `(${currentStock} em estoque)`;
        } else if (data.isTool) {
            stockDisplay = `(Você tem: ${gameData.inventory[key] || 0})`;
        }

        let description = data.description || '';
        if (isSeedShop) {
            description = `Tempo: ${data.growTime}min | Colheita: ${data.harvestAmount}x | Slots: ${data.slots} | ${description}`;
        } else if (isEggShop) {
             description = `Tempo de Chocagem: ${data.hatchTime / 60000}min | Pets: ${data.pets.join(', ')}`;
        }


        itemDiv.innerHTML = `
            <div class="item-name">${data.name}</div>
            <div class="item-description">${description}</div>
            <div class="item-buy-info">
                <span>Custo: $${data.cost}</span>
                <span>${stockDisplay}</span>
            </div>
            <button class="buy-button" data-item="${key}" data-type="${type}" ${currentStock === 0 ? 'disabled' : ''}>
                Comprar
            </button>
        `;
        
        shopContent.appendChild(itemDiv);
    }
    
    // Adiciona Event Listeners para os botões de compra
    shopContent.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', handleBuy);
    });

    // Mostra a loja
    shopDiv.style.display = 'flex';
}

function handleBuy(e) {
    const itemKey = e.target.getAttribute('data-item');
    const shopType = e.target.getAttribute('data-type');
    
    let itemData;
    let inventoryKey = itemKey; 

    switch (shopType) {
        case 'seedShop':
        case 'spaceShop':
            itemData = SEEDS_DATA[itemKey];
            inventoryKey = itemKey;
            break;
        case 'gearShop':
            itemData = GEAR[itemKey];
            inventoryKey = itemKey;
            break;
        case 'eggShop':
            itemData = EGGS[itemKey];
            inventoryKey = itemKey; 
            break;
        default:
            return;
    }

    if (!itemData) return;

    if (gameData.money < itemData.cost) {
        showMessage('Dinheiro insuficiente!', 'error');
        return;
    }
    
    let currentStock = -1;
    if (shopType === 'seedShop' || shopType === 'spaceShop') {
        // Sementes são ilimitadas, exceto as espaciais que usam gameData.seeds
        currentStock = itemData.isSpace ? gameData.seeds[itemKey].currentStock : -1; 
    } else if (shopType === 'gearShop') {
        currentStock = GEAR[itemKey].currentStock;
    } else if (shopType === 'eggShop') {
        currentStock = EGGS[itemKey].currentStock;
    }
    
    if (currentStock === 0) {
        showMessage('Item esgotado!', 'error');
        return;
    }
    
    // Realiza a compra
    gameData.money -= itemData.cost;
    
    if (shopType === 'eggShop') {
        // Ovos vão para o inventário de ovos, não para o inventário padrão
        gameData.eggInventory.push(itemKey);
        EGGS[itemKey].currentStock--;
        showMessage(`Você comprou 1x ${itemData.name}. Está no seu inventário de Ovos!`, 'success');
    } else if (shopType === 'gearShop' && itemKey === 'incubator') {
        // A incubadora é um item único que é "plantado"
        if (gameData.inventory[inventoryKey]) {
             showMessage('Você já possui uma incubadora.', 'error');
             gameData.money += itemData.cost; // Devolve o dinheiro
             return;
        }
        gameData.inventory[inventoryKey] = 1;
        GEAR[itemKey].currentStock--;
        showMessage(`Você comprou a ${itemData.name}!`, 'success');
    } else {
        // Sementes ou outros equipamentos
        gameData.inventory[inventoryKey] = (gameData.inventory[inventoryKey] || 0) + 1;
        
        if (currentStock > 0) {
             if (shopType === 'gearShop') GEAR[itemKey].currentStock--;
             else if (itemData.isSpace) gameData.seeds[itemKey].currentStock--;
        }
        
        showMessage(`Você comprou 1x ${itemData.name}!`, 'success');
    }
    
    // Se comprou da loja espacial, inicia o temporizador de fechamento
    if (shopType === 'spaceShop' && portalFrame === 0) {
        gameData.lastSpaceShopOpen = Date.now();
        portalFrame = 1; // Inicia a animação de fechamento
    }
    
    updateInventoryDisplay();
    // Reabre a loja para atualizar o estoque visível
    openShop(shopType); 
    saveGame();
}

function openSellInterface() {
    // Implementação da interface de venda (similar ao openShop)
    const sellDiv = document.getElementById('sellInterface');
    const sellContent = document.getElementById('sellContent');

    if (!sellDiv || !sellContent) return;
    
    sellContent.innerHTML = '';
    
    // Filtra apenas os itens colhidos
    const harvestableItems = Object.keys(gameData.harvestInventory).filter(key => gameData.harvestInventory[key] > 0);
    
    if (harvestableItems.length === 0) {
        sellContent.innerHTML = '<p>Você não tem colheitas para vender.</p>';
    } else {
        for (const key of harvestableItems) {
            const data = SEEDS_DATA[key];
            const amount = gameData.harvestInventory[key];
            const sellValue = data.sellValue * amount;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'sell-item';
            
            itemDiv.innerHTML = `
                <div class="item-name">${data.name}</div>
                <div class="item-info">
                    <span>Qtd: ${amount}</span>
                    <span>Valor Total: $${sellValue}</span>
                </div>
                <button class="sell-button" data-item="${key}">
                    Vender Tudo
                </button>
            `;
            
            sellContent.appendChild(itemDiv);
        }
        
        // Adiciona Event Listeners para os botões de venda
        sellContent.querySelectorAll('.sell-button').forEach(button => {
            button.addEventListener('click', handleSell);
        });
    }
    
    // Mostra a interface de venda
    sellDiv.style.display = 'flex';
}

function handleSell(e) {
    const itemKey = e.target.getAttribute('data-item');
    const amount = gameData.harvestInventory[itemKey];
    const data = SEEDS_DATA[itemKey];

    if (!data || amount <= 0) return;

    const sellValue = data.sellValue * amount;
    
    // Realiza a venda
    gameData.money += sellValue;
    delete gameData.harvestInventory[itemKey];
    
    showMessage(`Você vendeu ${amount}x ${data.name} por $${sellValue}!`, 'success');
    
    updateInventoryDisplay();
    // Reabre a interface para atualizar
    openSellInterface(); 
    closeShop(); // Fecha caso esteja aberta a loja
    saveGame();
}

function closeShop() {
    // Fecha todas as interfaces de loja/venda
    document.getElementById('shopInterface').style.display = 'none';
    document.getElementById('sellInterface').style.display = 'none';
}

function showMessage(msg, type = 'info') {
    const msgDiv = document.getElementById('message');
    if (!msgDiv) return;
    msgDiv.textContent = msg;
    msgDiv.className = `show ${type}`; 
    setTimeout(() => { msgDiv.textContent = ''; msgDiv.className = ''; }, 3000);
}

// --- 6. ATUALIZAÇÃO DO HUD E CONTROLES ---

function updateInventoryDisplay() {
    // Atualiza o dinheiro
    const moneyDisplay = document.getElementById('moneyDisplay');
    if (moneyDisplay) {
        moneyDisplay.textContent = `Dinheiro: $${gameData.money}`;
    }
    
    // Atualiza o Pet
    const petDisplay = document.getElementById('petDisplay');
    if (petDisplay) {
        petDisplay.textContent = `Pet: ${gameData.pet.name}`;
    }
    
    // Atualiza o Inventário (apenas itens que podem ser selecionados/usados)
    const inventoryList = document.getElementById('inventoryList');
    if (inventoryList) {
        inventoryList.innerHTML = '';
        
        // Itens de Sementes e Ferramentas (Regador, Reclaimer, Incubadora)
        const usableItems = ['wateringCan', 'reclaimer', 'incubator'];
        const seedKeys = Object.keys(SEEDS_DATA);
        const allKeys = [...new Set([...usableItems, ...seedKeys])]; 
        
        for (const key of allKeys) {
            const amount = gameData.inventory[key] || 0;
            const itemData = SEEDS_DATA[key] || GEAR[key];

            if (amount > 0) {
                const li = document.createElement('li');
                li.className = `inventory-item ${gameData.selectedItem === key ? 'selected' : ''}`;
                li.setAttribute('data-item', key);
                li.textContent = `${itemData.name} (${amount})`;
                
                li.addEventListener('click', () => {
                    gameData.selectedItem = key;
                    updateInventoryDisplay(); // Atualiza para mostrar o item selecionado
                });
                
                inventoryList.appendChild(li);
            }
        }
    }
    
    // Atualiza a lista de Ovos
    const eggInventoryList = document.getElementById('eggInventoryList');
    if (eggInventoryList) {
        eggInventoryList.innerHTML = '';
        
        if (gameData.eggInventory.length > 0) {
            for (let i = 0; i < gameData.eggInventory.length; i++) {
                const eggKey = gameData.eggInventory[i];
                const eggData = EGGS[eggKey];
                
                const li = document.createElement('li');
                li.className = 'egg-item';
                li.setAttribute('data-index', i);
                li.textContent = `${eggData.name}`;
                
                li.addEventListener('click', () => {
                    handleEggAction(i, eggKey); 
                });
                
                eggInventoryList.appendChild(li);
            }
        } else {
             eggInventoryList.innerHTML = '<li>Nenhum ovo.</li>';
        }
    }
    
    // Atualiza o estado da Incubadora
    const incubatorStatus = document.getElementById('incubatorStatus');
    if (incubatorStatus) {
        if (gameData.incubator.isPlanted && gameData.incubator.egg) {
            const eggData = EGGS[gameData.incubator.egg.name.replace(/ /g, '')];
            const timeElapsed = Date.now() - gameData.incubator.startTime;
            const timeLeft = Math.max(0, gameData.incubator.hatchTime - timeElapsed);
            const minutesLeft = Math.ceil(timeLeft / 60000);
            
            incubatorStatus.textContent = `Incubadora: Chocando ${eggData.name} (${minutesLeft}min restantes)`;
        } else if (gameData.incubator.isPlanted && !gameData.incubator.egg) {
             incubatorStatus.textContent = `Incubadora: Plot Livre - Pronto para ovo.`;
        } else {
            incubatorStatus.textContent = 'Incubadora: Não instalada.';
        }
    }
}

function handleEggAction(index, eggKey) {
    // Lógica para chocar ou colocar na incubadora
    const eggData = EGGS[eggKey];
    
    if (gameData.incubator.isPlanted) {
        // Incubadora está instalada
        if (!gameData.incubator.egg) {
            // Se não houver ovo, coloca este
            gameData.incubator.egg = eggData;
            gameData.incubator.hatchTime = eggData.hatchTime;
            gameData.incubator.startTime = Date.now();
            
            // Remove do inventário
            gameData.eggInventory.splice(index, 1);
            
            showMessage(`Ovo de ${eggData.name} colocado na incubadora!`, 'success');
            updateInventoryDisplay();
            saveGame();
        } else {
            showMessage(`A incubadora já está chocando um ${gameData.incubator.egg.name}.`, 'error');
        }
    } else {
        showMessage('Você precisa de uma incubadora instalada no jardim para chocar ovos.', 'error');
    }
}

function hatchEgg() {
    if (!gameData.incubator.isPlanted || !gameData.incubator.egg) {
        showMessage('Nenhum ovo na incubadora.', 'error');
        return;
    }
    
    const timeElapsed = Date.now() - gameData.incubator.startTime;
    
    if (timeElapsed < gameData.incubator.hatchTime) {
        const timeLeft = Math.ceil((gameData.incubator.hatchTime - timeElapsed) / 60000);
        showMessage(`Ainda faltam ${timeLeft} minutos para o ovo chocar.`, 'info');
        return;
    }
    
    // Lógica de sorteio de pet
    const eggKey = gameData.incubator.egg.name.replace(/ /g, '').replace(/\./g, '');
    const eggData = EGGS[eggKey];
    const pets = eggData.pets;
    const chances = eggData.chance;
    
    const rand = Math.random();
    let cumulativeChance = 0;
    let hatchedPetKey = pets[0];
    
    for (let i = 0; i < pets.length; i++) {
        cumulativeChance += chances[i];
        if (rand < cumulativeChance) {
            hatchedPetKey = pets[i];
            break;
        }
    }
    
    const hatchedPet = PETS[hatchedPetKey];
    
    // Atribui o novo pet (substituindo o antigo)
    gameData.pet = hatchedPet;
    
    // Limpa o plot da incubadora
    const plotIndex = gameData.incubator.plotIndex;
    if (plotIndex !== -1 && gameData.plots[plotIndex]) {
        gameData.plots[plotIndex] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0]));
    }
    
    // Reseta o estado da incubadora
    gameData.incubator = { isPlanted: false, egg: null, hatchTime: 0, startTime: 0, plotIndex: -1 };
    
    showMessage(`Um ${hatchedPet.name} nasceu! Ele é seu novo Pet!`, 'success');
    updateInventoryDisplay();
    saveGame();
}

// --- 7. DESENHO NO CANVAS ---

function drawPlayer(x, y, color) {
    if (!ctx) return;
    
    // Tenta usar a imagem do Pet
    const petImage = PET_IMAGES[gameData.pet.name.replace(/ /g, '').toLowerCase()];
    const playerImage = OTHER_IMAGES.playerPlaceholder;

    if (petImage && petImage.complete) {
        ctx.drawImage(petImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
    } else if (playerImage && playerImage.complete) {
        ctx.drawImage(playerImage, x, y, PLAYER_SIZE, PLAYER_SIZE);
    } else {
        // Fallback: Desenha um círculo (Se a imagem do pet ou do placeholder não carregou)
        ctx.fillStyle = gameData.player.color;
        ctx.beginPath();
        ctx.arc(x + PLAYER_SIZE / 2, y + PLAYER_SIZE / 2, PLAYER_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawMap() {
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 1. DESENHA O FUNDO DO MAPA (Usando o PNG em Base64)
    if (isMapBackgroundLoaded) {
        ctx.drawImage(mapBackgroundImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    } else {
        // Fallback se o Base64 por algum motivo não funcionar
        ctx.fillStyle = '#f0f0f0'; // Fundo Cinza Claro
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
    
    // 2. DESENHA OS TILES DE INTERAÇÃO (APENAS AQUELES QUE USAM IMAGENS DINÂMICAS/PLACEHOLDERS)
    // Isso é feito para garantir que os tiles interativos sobreponham o fundo estático (PNG)
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const tileX = col * TILE_SIZE;
            const tileY = row * TILE_SIZE;
            const tileType = GAME_MAP[row][col];
            
            let imgToDraw = null;
            let drawPortal = false;
            
            switch (tileType) {
                case 7: // Portal
                    if (PORTAL_IMAGES.length > 0) {
                         // Usa a imagem do frame atual
                         imgToDraw = PORTAL_IMAGES[portalFrame]; 
                         drawPortal = true;
                    }
                    break;
                case 4: // Seed Shop
                    imgToDraw = OTHER_IMAGES.seedShopTile;
                    break;
                case 5: // Gear Shop
                    imgToDraw = OTHER_IMAGES.gearShopTile;
                    break;
                case 6: // Egg Shop
                    imgToDraw = OTHER_IMAGES.eggShopTile;
                    break;
                case 3: // Sell
                    imgToDraw = OTHER_IMAGES.sellTile;
                    break;
                case 2: // Garden Entrance (Tile 2)
                    imgToDraw = OTHER_IMAGES.gardenEntrance;
                    
                    // FALLBACK FORÇADO: Desenha um quadrado verde escuro se a imagem falhar
                    if (!imgToDraw || !imgToDraw.complete) {
                        ctx.fillStyle = '#006400'; 
                        ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                        ctx.strokeStyle = '#000000';
                        ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
                    }
                    break;
            }
            
            if (imgToDraw && imgToDraw.complete && !drawPortal) {
                 ctx.drawImage(imgToDraw, tileX, tileY, TILE_SIZE, TILE_SIZE);
            } else if (drawPortal && imgToDraw && imgToDraw.complete) {
                 // Desenha o portal centralizado e ligeiramente maior
                 ctx.drawImage(imgToDraw, tileX - 5, tileY - 5, TILE_SIZE + 10, TILE_SIZE + 10);
            }
        }
    }

    // 3. DESENHA OS PLOTS DE PLANTAÇÃO (Dinâmico)
    for (const p of gameData.plots) {
        if (!p.isMaster) continue; // Desenha apenas o master plot
        
        ctx.fillStyle = p.isPlanted ? '#8b4513' : '#a0522d'; // Marrom mais escuro se plantado
        ctx.fillRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#363636';
        ctx.strokeRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
        
        if (p.isPlanted) {
            let itemImage = null;
            
            if (p.seedType === 'incubator') {
                // Desenha a incubadora
                itemImage = OTHER_IMAGES.incubator;
                if (gameData.incubator.egg) {
                    // Se tiver ovo, desenha o ovo sobre a incubadora
                    const eggKey = gameData.incubator.egg.name.replace(/ /g, '').replace(/\./g, '');
                    const eggImage = EGG_IMAGES[eggKey];
                    if (eggImage && eggImage.complete) {
                         ctx.drawImage(eggImage, p.x + 5, p.y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
                    }
                }
            } else {
                // Desenha a semente
                const seedData = SEEDS_DATA[p.seedType];
                
                // Mapeamento de estágios para imagens (simplificado)
                let imageKey = p.seedType; 
                if (p.growthStage === 3) {
                    imageKey = `${p.seedType}_harvest`; 
                    itemImage = HARVESTED_IMAGES[p.seedType];
                } else if (p.growthStage === 2) {
                    // Usar a imagem da semente, mas com algum indicador de crescimento (ou a próxima imagem se você tiver sprites)
                    itemImage = SEED_IMAGES[p.seedType]; 
                } else {
                    // Estágio 1 (Recém plantado)
                    itemImage = SEED_IMAGES[p.seedType]; 
                }
            }
            
            if (itemImage && itemImage.complete) {
                // Desenha a semente/colheita/incubadora no plot master
                ctx.drawImage(itemImage, p.x + 5, p.y + 5, TILE_SIZE - 10, TILE_SIZE - 10);
            }
            
            // Indicador de rega
            if (!p.isWatered && p.seedType !== 'incubator') {
                 ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Vermelho transparente
                 ctx.fillRect(p.x, p.y, TILE_SIZE, TILE_SIZE);
            }
        }
    }
    
    // 4. DESENHA O JOGADOR
    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.color);
}

// --- 8. GAME LOOP E ATUALIZAÇÃO ---

function updateGrowth() {
    const now = Date.now();
    let hasGrown = false;
    
    for (const plot of gameData.plots) {
        if (!plot.isMaster || !plot.isPlanted || plot.seedType === 'incubator') continue;

        const seedData = SEEDS_DATA[plot.seedType];
        
        // Verifica murcha (se não estiver regado por muito tempo, a ser implementado)
        
        // Verifica crescimento
        const growThreshold = seedData.growTime * 60 * 1000; // Tempo de crescimento em ms
        const waterTimeElapsed = now - plot.wateredAt;
        
        if (plot.isWatered && plot.growthStage < 3) {
             const timeToNextStage = growThreshold / 2; // Simplificação: 2 estágios de crescimento
             
             if (waterTimeElapsed >= timeToNextStage && plot.growthStage === 1) {
                 plot.growthStage = 2;
                 plot.wateredAt = now; // Reinicia o timer de rega para o próximo estágio
                 hasGrown = true;
             } else if (waterTimeElapsed >= timeToNextStage && plot.growthStage === 2) {
                 plot.growthStage = 3; // Colheita pronta
                 hasGrown = true;
             }
             
             // Desmarcar como regado após o tempo
             if (waterTimeElapsed >= timeToNextStage) {
                 plot.isWatered = false;
             }
        }
        
        // Aplica o estado de rega aos plots ligados
        if (plot.linkedPlots) {
            for (const index of plot.linkedPlots) {
                 if (gameData.plots[index]) {
                     gameData.plots[index].growthStage = plot.growthStage;
                     gameData.plots[index].isWatered = plot.isWatered;
                     gameData.plots[index].wateredAt = plot.wateredAt;
                 }
            }
        }
    }
    
    if (hasGrown) {
        saveGame();
    }
}

function updatePortalAnimation() {
    // Se o portal estiver aberto (frame 0) ou fechando (frame 1-6)
    if (portalFrame < FRAME_COUNT) {
        const timeElapsedSinceOpen = Date.now() - gameData.lastSpaceShopOpen;
        const animationTimeElapsed = Date.now() - (gameData.lastSpaceShopOpen - ANIMATION_DURATION_MS);

        if (timeElapsedSinceOpen >= OPEN_DURATION_MS) {
            portalFrame = FRAME_COUNT; // Fechado
        } else if (timeElapsedSinceOpen >= OPEN_DURATION_MS - ANIMATION_DURATION_MS) {
            // Animação de fechamento
            const timeSinceStartClose = timeElapsedSinceOpen - (OPEN_DURATION_MS - ANIMATION_DURATION_MS);
            const frameIndex = Math.floor((timeSinceStartClose / ANIMATION_DURATION_MS) * FRAME_COUNT);
            portalFrame = Math.min(frameIndex, FRAME_COUNT - 1);
        } else {
            portalFrame = 0; // Aberto
        }
    }
}

function updateGame() {
    if (ctx && canvas) {
        // 1. Lógica de Movimento
        let dx = 0, dy = 0;
        const speed = gameData.player.speed;
        
        if (keysPressed['ArrowUp'] || keysPressed['upButton']) dy -= 1;
        if (keysPressed['ArrowDown'] || keysPressed['downButton']) dy += 1;
        if (keysPressed['ArrowLeft'] || keysPressed['leftButton']) dx -= 1;
        if (keysPressed['ArrowRight'] || keysPressed['rightButton']) dx += 1;

        if (dx !== 0 || dy !== 0) {
            const magnitude = Math.hypot(dx, dy);
            dx = (dx / magnitude) * speed;
            dy = (dy / magnitude) * speed;
            
            let newX = gameData.player.x;
            let newY = gameData.player.y;

            // Tentativa de movimento em X
            if (!checkCollision(newX, newY, dx, 0)) {
                newX += dx;
            }
            // Tentativa de movimento em Y
            if (!checkCollision(newX, newY, 0, dy)) {
                newY += dy;
            }
            
            gameData.player.x = newX;
            gameData.player.y = newY;
            
            // Salva a posição
            // saveGame(); // Melhor salvar menos frequentemente
        }
        
        // 2. Lógica de Jogo
        updateStock();
        updateGrowth();
        updatePortalAnimation();

        // 3. Desenho
        drawMap(); 

        // 4. Atualização do HUD (melhor chamar apenas quando necessário)
        // updateInventoryDisplay(); 
        
        // 5. Loop
        requestAnimationFrame(updateGame);
    }
}

// --- 9. EVENT LISTENERS E INICIALIZAÇÃO ---

// Manipulador de clique no Canvas (para interações e plantio)
function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 1. Verifica interações (Lojas, Venda, Entrada do Jardim)
    const playerCenterX = gameData.player.x + PLAYER_SIZE / 2;
    const playerCenterY = gameData.player.y + PLAYER_SIZE / 2;
    
    // Verifica se o clique foi perto do jogador (para simular ação/interação)
    if (Math.abs(x - playerCenterX) < TILE_SIZE && Math.abs(y - playerCenterY) < TILE_SIZE) {
        
        // Verifica se o clique foi em um plot
        const plotCheck = getPlotAt(playerCenterX, playerCenterY);
        
        if (plotCheck) {
            const plot = plotCheck.plot;
            
            // Ações baseadas no item selecionado
            const selectedItem = gameData.selectedItem;
            const seedData = SEEDS_DATA[selectedItem];
            
            if (seedData) {
                // Ação: Plantar
                plantSeed(plot, seedData);
            } else if (selectedItem === 'wateringCan') {
                // Ação: Regar Plot
                waterPlot(plot);
            } else if (selectedItem === 'reclaimer') {
                // Ação: Remover Semente
                removePlot(plot);
            } else if (selectedItem === 'incubator') {
                // Ação: Plantar Incubadora
                const incubatorData = GEAR['incubator'];
                if (gameData.inventory.incubator > 0 && !gameData.incubator.isPlanted) {
                    
                    // Lógica simplificada: A incubadora é plantada como um plot 1x1 master
                    plot.isPlanted = true;
                    plot.seedType = 'incubator';
                    plot.growthStage = 1; 
                    plot.isMaster = true; 
                    plot.isWatered = true; // Não precisa regar
                    
                    gameData.incubator.isPlanted = true;
                    gameData.incubator.plotIndex = plotCheck.index;
                    gameData.inventory.incubator--;
                    showMessage('Incubadora instalada no jardim.', 'success');
                    updateInventoryDisplay();
                    saveGame();
                    
                } else if (gameData.incubator.isPlanted && plot === gameData.plots[gameData.incubator.plotIndex]) {
                     // Ação: Remover Incubadora (se o clique for na própria incubadora)
                     if (!gameData.incubator.egg) {
                         // Limpa o plot
                         gameData.plots[plotCheck.index] = JSON.parse(JSON.stringify(INITIAL_DATA.plots[0])); 
                         
                         gameData.incubator = JSON.parse(JSON.stringify(INITIAL_DATA.incubator));
                         gameData.inventory.incubator = 1; // Devolve ao inventário
                         showMessage('Incubadora removida.', 'info');
                         updateInventoryDisplay();
                         saveGame();
                     } else {
                         showMessage('Remova o ovo chocado antes de remover a incubadora.', 'error');
                     }
                } else {
                    showMessage('Você já tem uma incubadora instalada ou não possui uma no inventário.', 'error');
                }
            } else if (!selectedItem || selectedItem === 'none') {
                // Ação: Colheita (se nenhum item estiver selecionado)
                harvestPlot(plot);
            }
            
        } else {
            // Se o clique foi no mapa, perto do jogador, checa interação de tiles (lojas, entrada)
            checkTileInteraction(x, y, gameData.selectedItem);
        }
        
        // Reseta o item selecionado após uma interação bem-sucedida (opcional, dependendo do design)
        // gameData.selectedItem = 'none'; 
        
    }
}

// Inicialização
loadImages();

// --- Event Listeners ---\n
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
    
    // Controles de Toque (D-Pad)
    const setupButton = (id, key) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault(); 
                keysPressed[key] = true;
                isMoving = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault(); 
                keysPressed[key] = false;
                if (!Object.values(keysPressed).some(v => v === true)) {
                    isMoving = false;
                }
            });
        }
    };
    
    setupButton('upButton', 'ArrowUp');
    setupButton('downButton', 'ArrowDown');
    setupButton('leftButton', 'ArrowLeft');
    setupButton('rightButton', 'ArrowRight');
    
    // Placeholder para botões de ação (caso existam no HTML)
    const regarBtn = document.getElementById('regadorButton');
    if (regarBtn) {
        regarBtn.addEventListener('click', () => waterAllPlots());
    }
    
    const colherBtn = document.getElementById('colherButton');
    if (colherBtn) {
        colherBtn.addEventListener('click', () => showMessage('Ação "Colher Tudo" não implementada.', 'info'));
    }
    
    // Botão de fechar loja
    const closeShopBtn = document.getElementById('closeShopButton');
    if (closeShopBtn) {
        closeShopBtn.addEventListener('click', closeShop);
    }
    
    const closeSellBtn = document.getElementById('closeSellButton');
    if (closeSellBtn) {
        closeSellBtn.addEventListener('click', closeShop);
    }
    
    // Se o código da imagem já carregou, o jogo será iniciado
    // na função loadImages()
    
    // Inicia a exibição do HUD
    updateInventoryDisplay(); 
    
    // Inicia a lógica de salvamento
    setInterval(saveGame, 5000); 
    
    // Chamada inicial (se todas as imagens falharem, initGame() deve ser chamado por aqui)
    // Se o totalImages for 0, initGame() é chamado imediatamente.
    if (totalImages === 0) {
        initGame();
        requestAnimationFrame(updateGame);
    }
});
