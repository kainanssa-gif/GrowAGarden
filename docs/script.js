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
    [1, 2, 0, 0, 0, 3, 0, 0, 0, 1], // Vendedor movido para 5,8
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

// DADOS DOS ITENS E RARIDADES
const PETS = { 
    none: { name: 'Nenhum', bonus: 1.0 }, 
    bunny: { name: 'Coelho', bonus: 1.1, color: '#f5f5dc' }, 
    fox: { name: 'Raposa', bonus: 1.25, color: '#ff4500' },
    dragon: { name: 'Dragão', bonus: 1.5, color: '#b22222' } 
};
const EGGS = { 
    commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', pets: ['bunny'], chance: [1.0] }, 
    rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', pets: ['bunny', 'fox'], chance: [0.7, 0.3] },
    legendaryEgg: { name: 'Ovo Lendário', cost: 25000, color: '#ffd700', pets: ['fox', 'dragon'], chance: [0.5, 0.5] }
};
const GEAR = { 
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, description: "30% chance de regar auto" }, 
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, description: "60% chance de regar auto" },
    wateringCan: { name: 'Regador Básico', cost: 100, description: "Item para regar suas plantas" }
};

// --- SEMENTES ATUALIZADAS (Com 5 novas e raridades ajustadas) ---
const SEEDS_DATA = {
    // Comuns
    carrot: { name: 'Cenoura Comum', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, color: '#ff9800', type: 'single', harvestColor: '#ff9800', rarity: 'common' },
    pumpkin: { name: 'Abóbora Comum', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, color: '#ff5722', type: 'single', harvestColor: '#ff5722', rarity: 'common' },
    
    // Raras
    blueBerry: { name: 'Mirtilo Raro', cost: 400, sellValue: 800, growTime: 15, count: 0, maxStock: 4, currentStock: 4, color: '#4169e1', type: 'multi', harvestColor: '#4169e1', rarity: 'rare' },
    moonFlower: { name: 'Flor Lunar Rara', cost: 800, sellValue: 1800, growTime: 25, count: 0, maxStock: 2, currentStock: 2, color: '#e0ffff', type: 'single', harvestColor: '#e0ffff', rarity: 'rare' },
    
    // Épicas
    goldenMelon: { name: 'Melancia Dourada', cost: 2000, sellValue: 5000, growTime: 40, count: 0, maxStock: 1, currentStock: 1, color: '#ffd700', type: 'single', harvestColor: '#ffd700', rarity: 'epic' },
    starFruit: { name: 'Carambola Estelar', cost: 1500, sellValue: 3500, growTime: 35, count: 0, maxStock: 1, currentStock: 1, color: '#fdfd96', type: 'multi', harvestColor: '#fdfd96', rarity: 'epic' },

    // --- NOVAS LENDÁRIAS / ACIMA ---
    // Lendárias
    shadowBloom: { name: 'Flor Sombra', cost: 5000, sellValue: 12000, growTime: 60, count: 0, maxStock: 1, currentStock: 1, color: '#301934', type: 'single', harvestColor: '#301934', rarity: 'legendary' },
    crystalGrape: { name: 'Uva de Cristal', cost: 7500, sellValue: 18000, growTime: 70, count: 0, maxStock: 1, currentStock: 1, color: '#e6e6fa', type: 'multi', harvestColor: '#e6e6fa', rarity: 'legendary' },

    // Míticas
    solarMango: { name: 'Manga Solar', cost: 15000, sellValue: 35000, growTime: 90, count: 0, maxStock: 1, currentStock: 1, color: '#ff8c00', type: 'single', harvestColor: '#ff8c00', rarity: 'mythic' },
    voidApple: { name: 'Maçã do Vazio', cost: 20000, sellValue: 50000, growTime: 120, count: 0, maxStock: 1, currentStock: 1, color: '#000000', type: 'single', harvestColor: '#000000', rarity: 'mythic' },
    
    // Mítica Suprema
    cosmicDust: { name: 'Poeira Cósmica', cost: 50000, sellValue: 150000, growTime: 180, count: 0, maxStock: 1, currentStock: 1, color: '#8a2be2', type: 'multi', harvestColor: '#8a2be2', rarity: 'supreme' },
};

// Dados iniciais
const INITIAL_DATA = {
    money: 100,
    inventory: { basicSprinkler: 0, proSprinkler: 0, wateringCan: 1 }, 
    harvestInventory: {}, // Inicializa vazio, será preenchido com chaves
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
            gridX: x, gridY: y, isPlanted: false, seedType: null, growthStart: 0, growthStage: 0, isMutated: false, isWatered: false
        });
    }
}

let gameData = JSON.parse(JSON.stringify(INITIAL_DATA));


// --- 2. REFERÊNCIAS DO DOM ---
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
// Referência ao container de rolagem (CRÍTICO para o scroll)
const modalScrollContent = document.getElementById('modalScrollContent'); 
const modalContent = document.getElementById('modalContent');
const adminScrollContent = document.getElementById('adminScrollContent');
const adminCommandInput = document.getElementById('adminCommandInput');
const adminOutput = document.getElementById('adminOutput');


// --- 3. LÓGICA DE MOVIMENTO E DESENHO (Omitida para brevidade, mas mantida no seu arquivo) ---

// ... (Mantenha toda a lógica de movimento, drawMap, drawGarden, etc.) ...

// Função auxiliar para desenhar texto
function drawText(text, x, y, color, size) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// [INÍCIO DO BLOCO DE CÓDIGO CRÍTICO PARA ROLAGEM E NOVAS SEMENTES]

// Função para mudar a cena
function changeScene(scene) {
    saveGame(); 
    
    gameData.currentScene = scene;
    
    // Esconde ou mostra botões conforme a cena (map ou garden)
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

// --- 4. FUNÇÕES DE SALVAR E CARREGAR (Correção de Dados) ---

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
            
            // --- CORREÇÃO CRÍTICA DE MESCLAGEM DE DADOS ---
            
            // 1. Mescla Sementes: Adiciona sementes novas ao save antigo
            const mergedSeeds = { ...SEEDS_DATA }; // Começa com o template completo (incluindo as novas)
            if (loadedData.seeds) {
                // Sobrescreve as sementes existentes do save, mantendo as novas
                for (const key in loadedData.seeds) {
                    if (mergedSeeds[key]) {
                        // Copia apenas o count e o currentStock, mantendo o growTime/cost atualizado
                        mergedSeeds[key].count = loadedData.seeds[key].count;
                        mergedSeeds[key].currentStock = loadedData.seeds[key].currentStock;
                    }
                }
            }
            
            // 2. Mescla Inventário de Colheita: Adiciona novas chaves de colheita ao save antigo
            const mergedHarvestInventory = { ...loadedData.harvestInventory };
            for (const key in SEEDS_DATA) {
                if (mergedHarvestInventory[key] === undefined) {
                    mergedHarvestInventory[key] = 0; // Garante que as novas frutas tenham a chave no inventário
                }
            }
            
            // 3. Mescla Inventário de Equipamentos
            const mergedInventory = { ...INITIAL_DATA.inventory, ...loadedData.inventory };

            // Sobrescreve gameData com os dados carregados e mesclados
            gameData = { ...INITIAL_DATA, ...loadedData }; 
            gameData.seeds = mergedSeeds;
            gameData.harvestInventory = mergedHarvestInventory;
            gameData.inventory = mergedInventory;

            // Recalcula o tempo offline (se houver)
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

// ... (Mantenha as funções simulateOfflineGrowth, executeAdminCommand, updateStats, checkGrowth, etc.) ...

// --- 5. FUNÇÕES DE LOJA E MODAL (Ajuste de Referência) ---

// Função principal de renderização da Loja de Sementes
function renderSeedShop() {
    let html = '';
    const rarities = { 
        'common': 'Comum', 'rare': 'Rara', 'epic': 'Épica', 
        'legendary': 'Lendária', 'mythic': 'Mítica', 'supreme': 'SUPREMA' 
    };
    
    // Ordena as sementes por raridade (para as raras ficarem no topo da lista)
    const sortedSeedKeys = Object.keys(gameData.seeds).sort((a, b) => {
        const rarityOrder = ['common', 'rare', 'epic', 'legendary', 'mythic', 'supreme'];
        return rarityOrder.indexOf(gameData.seeds[b].rarity) - rarityOrder.indexOf(gameData.seeds[a].rarity);
    }).reverse(); // Reverte para listar Comum -> Suprema (ou tire o reverse para Suprema -> Comum)
    
    sortedSeedKeys.forEach(key => {
        const seed = gameData.seeds[key];
        const disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        html += `<div class="shop-item">
            <span><strong>${seed.name}</strong> (${rarities[seed.rarity]})</span>
            <small>Custo: **${seed.cost}¢** | Tempo: ${seed.growTime}s | Estoque: ${seed.currentStock} | Seu: ${seed.count}</small>
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
        // ATUALIZADO: Renderiza o conteúdo no modalContent (dentro do scroll area)
        if (modalContent) modalContent.innerHTML = renderSeedShop(); 
        saveGame(); 
    }
    updateStats();
}

function renderGearShop() {
    // ... (Conteúdo da loja de equipamentos)
    let html = '';
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const disabled = gameData.money < gearItem.cost;
        html += `<div class="shop-item">
            <span><strong>${gearItem.name}</strong> (${gearItem.cost}¢) | Seu: ${gameData.inventory[key] || 0}</span>
            <small>${gearItem.description}</small>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyGear('${key}')">Comprar</button>
        </div>`;
    });
    return html;
}

// ... (Mantenha as funções renderEggShop, renderSellerModal, etc.) ...

function openModal(title, contentHTML) {
    if (modalTitle) modalTitle.textContent = title;
    
    // ATUALIZADO: Injeta o HTML no modalContent, que está DENTRO do modalScrollContent
    if (modalContent) modalContent.innerHTML = contentHTML; 
    
    if (shopInteractionModal) shopInteractionModal.style.display = 'block';
    updateStats(); 
}

// --- 6. LISTENERS E ADMIN (Ajuste de Referência Admin) ---

if (adminButtonMap) {
    adminButtonMap.addEventListener('click', () => {
        if (adminPanel) {
            if (adminPanel.style.display === 'block') {
                 adminPanel.style.display = 'none'; 
            } else {
                const enteredPassword = prompt("Digite a senha de administrador:");
                if (enteredPassword === ADMIN_PASSWORD) {
                    adminPanel.style.display = 'block';
                    
                    // Conteúdo do Admin injetado DENTRO da área de scroll do Admin
                    if (adminScrollContent) {
                        adminScrollContent.innerHTML = `
                            <input type="text" id="adminCommandInput" placeholder="/give money 1000" style="width: 95%; padding: 8px; margin-bottom: 10px;">
                            <button id="runCommandButton">Executar</button>
                            <p id="adminOutput" style="margin-top: 10px;">Logado como Admin. Senha: ${ADMIN_PASSWORD}</p>
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
// ... (Mantenha o restante dos listeners) ...


// --- 7. LOOP PRINCIPAL E INICIALIZAÇÃO ---

// ... (Mantenha gameLoop) ...

window.onload = function() {
    loadGame();
    // A inicialização da cena deve ocorrer após o loadGame
    changeScene(gameData.currentScene); 
    updateStats();
    gameLoop();
                }
