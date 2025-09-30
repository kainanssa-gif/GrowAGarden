// --- CONFIGURAÇÕES BÁSICAS ---
const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 50;
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const ADMIN_CODE = "admin123";
const GARDEN_GRID_START_X = 2;
const GARDEN_GRID_START_Y = 2;
const GARDEN_WIDTH = 4;
const GARDEN_HEIGHT = 3;
const PLAYER_SIZE = 30;

// Definição do Mapa (0:Gramado, 1:Parede/Loja, 2:Entrada Jardim, 3:Vendedor, 4:Loja)
const GAME_MAP = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 1, 1, 1, 1, 1, 0, 0], // 2 = Entrada do Jardim
    [0, 0, 0, 1, 4, 4, 4, 1, 0, 0], // Lojas (4)
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 0, 0, 0, 0, 0, 0, 0], // Vendedor (3)
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

// --- DADOS DO JOGO ---
const PETS = { /* ... (dados de PETS iguais) ... */ };
const EGGS = { /* ... (dados de EGGS iguais) ... */ };
const GEAR = { /* ... (dados de GEAR iguais) ... */ };

let gameData = {
    money: 100,
    inventory: {
        basicSprinkler: 0,
        proSprinkler: 0
    },
    seeds: {
        carrot: { name: 'Cenoura', cost: 50, sellValue: 100, growTime: 10, count: 5, maxStock: 10, currentStock: 10, color: '#ff9800', type: 'single' },
        pumpkin: { name: 'Abóbora', cost: 150, sellValue: 300, growTime: 20, count: 0, maxStock: 5, currentStock: 5, color: '#ff5722', type: 'single' },
        strawberry: { name: 'Morango', cost: 500, sellValue: 150, growTime: 30, count: 0, maxStock: 3, currentStock: 3, color: '#ff0000', type: 'multi' }
    },
    plots: [],
    pet: { name: 'Nenhum', bonus: 1.0, color: 'gray' },
    // NOVO: Estado do Jogo e Posição do Jogador
    currentScene: 'map', // 'map' ou 'garden'
    player: { x: 50, y: 50, speed: 5, dx: 0, dy: 0, lastMove: 0, animationFrame: 0 }
};

// Inicializa as parcelas do jardim
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
const moneySpan = document.getElementById('money');
const sprinklerCountSpan = document.getElementById('sprinklerCount');
const petNameSpan = document.getElementById('petName');
const petBonusSpan = document.getElementById('petBonus');
const harvestAllButton = document.getElementById('harvestAllButton');
const waterButton = document.getElementById('waterButton');
const adminPanel = document.getElementById('adminPanel');
const adminCommandInput = document.getElementById('adminCommandInput');
const runCommandButton = document.getElementById('runCommandButton');
const adminOutput = document.getElementById('adminOutput');
const sceneChanger = document.getElementById('sceneChanger'); // Botão de transição
const adminButtonMap = document.getElementById('adminButtonMap'); // Novo botão admin no mapa

// NOVO: Menus Modais agora são "Lojas Físicas"
const shopInteractionModal = document.getElementById('shopInteractionModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const closeModalButton = document.getElementById('closeModalButton');

// --- LÓGICA DE MOVIMENTO E ANIMAÇÃO ---
const keys = {};
document.addEventListener('keydown', (e) => { keys[e.key] = true; });
document.addEventListener('keyup', (e) => { keys[e.key] = false; });

function handlePlayerMovement() {
    if (gameData.currentScene !== 'map') return;

    gameData.player.dx = 0;
    gameData.player.dy = 0;

    if (keys['ArrowUp'] || keys['w']) gameData.player.dy = -gameData.player.speed;
    if (keys['ArrowDown'] || keys['s']) gameData.player.dy = gameData.player.speed;
    if (keys['ArrowLeft'] || keys['a']) gameData.player.dx = -gameData.player.speed;
    if (keys['ArrowRight'] || keys['d']) gameData.player.dx = gameData.player.speed;

    if (gameData.player.dx !== 0 || gameData.player.dy !== 0) {
        // Lógica de Animação
        if (Date.now() - gameData.player.lastMove > 150) { // Troca de sprite a cada 150ms
            gameData.player.animationFrame = (gameData.player.animationFrame === 0) ? 1 : 0;
            gameData.player.lastMove = Date.now();
        }

        const nextX = gameData.player.x + gameData.player.dx;
        const nextY = gameData.player.y + gameData.player.dy;
        
        // Checagem de Colisão (simples por tile)
        const tileX = Math.floor(nextX / TILE_SIZE);
        const tileY = Math.floor(nextY / TILE_SIZE);

        if (tileY >= 0 && tileY < GAME_MAP.length && tileX >= 0 && tileX < GAME_MAP[0].length) {
            if (GAME_MAP[tileY][tileX] === 0 || GAME_MAP[tileY][tileX] >= 2) { // Não colide com Grama, Entrada ou Lojas
                gameData.player.x = nextX;
                gameData.player.y = nextY;
            }
        }
        
        // Colisão com bordas da tela
        gameData.player.x = Math.min(CANVAS_WIDTH - PLAYER_SIZE, Math.max(0, gameData.player.x));
        gameData.player.y = Math.min(CANVAS_HEIGHT - PLAYER_SIZE, Math.max(0, gameData.player.y));
    } else {
        gameData.player.animationFrame = 0; // Padrão parado
    }
    
    checkMapInteractions();
}

function drawPlayer(x, y, frame) {
    ctx.fillStyle = '#606060'; // Cor Cinza Base
    ctx.fillRect(x, y, PLAYER_SIZE, PLAYER_SIZE);
    
    // Animação Simples: troca de cor na parte inferior
    ctx.fillStyle = frame === 0 ? '#404040' : '#808080';
    ctx.fillRect(x, y + PLAYER_SIZE - 5, PLAYER_SIZE, 5); 
}

// --- DESENHO DE CENA ---

function drawMap() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    for (let y = 0; y < GAME_MAP.length; y++) {
        for (let x = 0; x < GAME_MAP[y].length; x++) {
            const tile = GAME_MAP[y][x];
            let color = '#4CAF50'; // Grama (0)

            if (tile === 1) color = '#795548'; // Parede
            if (tile === 2) color = '#f0f0f0'; // Entrada Jardim
            if (tile === 3) color = '#ffeb3b'; // Vendedor
            if (tile === 4) color = '#2196F3'; // Loja

            ctx.fillStyle = color;
            ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
    
    // Desenha as Lojas
    drawText('LOJA SEMENTES', 4 * TILE_SIZE + TILE_SIZE / 2, 2 * TILE_SIZE + 20, 'white');
    drawText('LOJA GEAR', 5 * TILE_SIZE + TILE_SIZE / 2, 2 * TILE_SIZE + 20, 'white');
    drawText('LOJA OVOS', 6 * TILE_SIZE + TILE_SIZE / 2, 2 * TILE_SIZE + 20, 'white');
    drawText('VENDEDOR', 2 * TILE_SIZE + TILE_SIZE / 2, 5 * TILE_SIZE + 20, 'red');

    drawPlayer(gameData.player.x, gameData.player.y, gameData.player.animationFrame);
}

function drawGarden() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#9c6b4d';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Desenha o Grid do Jardim
    gameData.plots.forEach(plot => {
        const x = plot.gridX * TILE_SIZE;
        const y = plot.gridY * TILE_SIZE;
        const cx = x + TILE_SIZE / 2;
        const cy = y + TILE_SIZE / 2;
        
        ctx.fillStyle = '#805030';
        ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#6b432e';
        ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);

        if (plot.isPlanted) {
            // ... (Lógica de desenho da planta igual, removendo a parte de texto de status) ...
            const seed = gameData.seeds[plot.seedType];
            let color = seed.color;
            let size = TILE_SIZE * 0.1;
            
            switch (plot.growthStage) {
                case 0: size = TILE_SIZE * 0.1; break;
                case 1: size = TILE_SIZE * 0.25; break;
                case 2: size = TILE_SIZE * 0.4; break;
                case 3: size = TILE_SIZE * 0.5; break;
            }
            
            if (plot.isMutated) {
                color = '#00ff00';
                ctx.strokeStyle = 'yellow';
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
            }

            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
            ctx.closePath();
            
            if (plot.growthStage === 3) {
                ctx.fillStyle = '#4caf50';
                ctx.fillRect(cx - 5, cy - size / 2 - 10, 10, 10);
            }

            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';

            if (plot.growthStage === 3) {
                 ctx.fillStyle = plot.isMutated ? 'yellow' : 'lime';
                 ctx.fillText(plot.isMutated ? 'PRONTA (M)' : 'PRONTA!', cx, cy + TILE_SIZE / 2 - 5);
            }
        }
    });
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, x, y);
}

// --- CORREÇÃO DE BUG E LÓGICA DE JOGO ---

function plantSeed(seedType, plotIndex) {
    const seed = gameData.seeds[seedType];
    const plot = gameData.plots[plotIndex];

    // CORREÇÃO DE BUG: O bug ocorria porque a verificação era feita apenas no IF principal.
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
        let value = seed.sellValue;
        
        if (plot.isMutated) {
            value *= 2; 
        }
        
        value *= gameData.pet.bonus;
        
        gameData.money += value;
        
        if (seed.type === 'single') {
            plot.isPlanted = false;
            plot.seedType = null;
        } else { // Multi-colheita
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
    
    updateStats();
}

// --- INTERAÇÕES DE MAPA E LOJAS ---

function checkMapInteractions() {
    const pX = Math.floor(gameData.player.x / TILE_SIZE);
    const pY = Math.floor(gameData.player.y / TILE_SIZE);
    
    const tile = GAME_MAP[pY][pX];
    
    if (tile === 2) { // Entrada do Jardim
        sceneChanger.textContent = "Entrar no Jardim";
        sceneChanger.onclick = () => changeScene('garden');
        sceneChanger.style.display = 'block';
    } else if (tile === 3) { // Vendedor
        sceneChanger.textContent = "Vender Itens";
        sceneChanger.onclick = openSellerModal;
        sceneChanger.style.display = 'block';
    } else if (tile === 4) { // Lojas (Todas no mesmo tile 4)
        sceneChanger.textContent = "Acessar Lojas (Seed/Gear/Egg)";
        sceneChanger.onclick = openShopSelectionModal;
        sceneChanger.style.display = 'block';
    } else {
        sceneChanger.style.display = 'none';
    }
}

function changeScene(scene) {
    gameData.currentScene = scene;
    if (scene === 'map') {
        sceneChanger.textContent = 'Entrar no Jardim';
        harvestAllButton.style.display = 'none';
        waterButton.style.display = 'none';
        adminButtonMap.style.display = 'block';
    } else {
        sceneChanger.textContent = 'Sair do Jardim';
        sceneChanger.onclick = () => {
            changeScene('map');
            gameData.player.x = 2 * TILE_SIZE; 
            gameData.player.y = 1 * TILE_SIZE; // Retorna para a posição da entrada no mapa
        };
        harvestAllButton.style.display = 'inline-block';
        waterButton.style.display = 'inline-block';
        adminButtonMap.style.display = 'none';
    }
}

// LÓGICA DE MODAIS DE INTERAÇÃO (AGORA UNIFICADOS)
function openModal(title, contentHTML) {
    modalTitle.textContent = title;
    modalContent.innerHTML = contentHTML;
    shopInteractionModal.style.display = 'block';
    updateStats(); 
}

function openShopSelectionModal() {
    const html = `
        <button onclick="openSeedShopModal()">Loja de Sementes</button>
        <button onclick="openGearShopModal()">Loja de Equipamentos</button>
        <button onclick="openEggShopModal()">Loja de Ovos (Pets)</button>
    `;
    openModal("Selecione a Loja", html);
}

function openSellerModal() {
    let sellableItems = 0;
    const itemsToSell = {};
    
    gameData.plots.forEach((p) => {
        if(p.isPlanted && p.growthStage === 3) {
            itemsToSell[p.seedType] = (itemsToSell[p.seedType] || 0) + 1;
            sellableItems++;
        }
    });
    
    let html = '';
    if (sellableItems === 0) {
        html = '<p>Você não tem plantas prontas para colheita/venda.</p>';
    } else {
        html = '<h4>Itens para Vender (Colheita Imediata)</h4>';
        
        Object.keys(itemsToSell).forEach(seedKey => {
            const seed = gameData.seeds[seedKey];
            const count = itemsToSell[seedKey];
            const value = seed.sellValue * count * gameData.pet.bonus;
            
            html += `<div class="shop-item">
                <span>${seed.name} x${count}</span>
                <button onclick="harvestAllButton.click(); closeModalButton.click();">Vender Tudo (${value.toFixed(2)}¢)</button>
            </div>`;
        });
    }
    openModal("Vendedor de Colheitas", html);
}

function renderSeedShop() {
    let html = '';
    Object.keys(gameData.seeds).forEach(key => {
        const seed = gameData.seeds[key];
        const disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        html += `<div class="shop-item">
            <span><strong>${seed.name}</strong> (${seed.cost}¢) | Estoque: <span id="stock-${key}">${seed.currentStock}</span> | Seu: ${seed.count}</span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buySeed('${key}')">Comprar</button>
        </div>`;
    });
    return html;
}

function openSeedShopModal() {
    openModal("Loja de Sementes", renderSeedShop());
}

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

// ... (Outras funções de loja e administração (hatchEgg, renderGearShop, renderEggShop, executeAdminCommand, etc.) permanecem as mesmas, adaptadas para usar a função 'openModal') ...
// Devido à limitação de espaço, as funções de renderização de lojas (Gear e Egg) são abreviadas.

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

function openGearShopModal() {
    openModal("Loja de Equipamentos", renderGearShop());
}

function buyGear(gearKey) {
    const gearItem = GEAR[gearKey];
    if (gameData.money >= gearItem.cost) {
        gameData.money -= gearItem.cost;
        gameData.inventory[gearKey] += 1;
        modalContent.innerHTML = renderGearShop();
    }
    updateStats();
}

function renderEggShop() {
    let html = '';
    Object.keys(EGGS).forEach(key => {
        const eggItem = EGGS[key];
        const disabled = gameData.money < eggItem.cost;
        html += `<div class="shop-item">
            <span><strong>${eggItem.name}</strong> (${eggItem.cost}¢)<br><small>Pode chocar: ${eggItem.pets.map(p => p.name).join(', ')}</small></span>
            <button class="buy-button" ${disabled ? 'disabled' : ''} onclick="buyAndHatchEgg('${key}')">Comprar & Chocar</button>
        </div>`;
    });
    return html;
}

function openEggShopModal() {
    openModal("Loja de Ovos (Pets)", renderEggShop());
}

function buyAndHatchEgg(eggKey) {
    const egg = EGGS[eggKey];
    if (gameData.money >= egg.cost) {
        gameData.money -= egg.cost;
        hatchEgg(eggKey); 
        modalContent.innerHTML = renderEggShop();
    }
    updateStats();
}

function executeAdminCommand(commandString) {
    // ... (Lógica de admin igual, mas atualize o DOM com updateStats e não alerte) ...
}


// --- EVENT LISTENERS E INICIALIZAÇÃO ---

closeModalButton.addEventListener('click', () => {
    shopInteractionModal.style.display = 'none';
});

canvas.addEventListener('click', (e) => {
    if (gameData.currentScene !== 'garden') return; // Só interage no jardim
    
    // ... (Lógica de plantio e colheita do jardim igual, usando a função plantSeed corrigida) ...
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
            let message = "Qual semente você gostaria de plantar?\n";
            let validSeeds = [];

            Object.keys(gameData.seeds).forEach(key => {
                if (gameData.seeds[key].count > 0) {
                    message += `${validSeeds.length + 1} - ${gameData.seeds[key].name} (${gameData.seeds[key].cost}¢) (Seu: ${gameData.seeds[key].count})\n`;
                    validSeeds.push(key);
                }
            });
            
            message += "Digite o número ou Cancelar.";

            const choice = prompt(message);
            const choiceIndex = parseInt(choice) - 1;

            if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < validSeeds.length) {
                plantSeed(validSeeds[choiceIndex], plotIndex);
            } else if (choice !== null) {
                alert("Seleção inválida ou sem sementes.");
            }
        } else {
            alert(`Planta em crescimento! Estágio: ${plot.growthStage}/3.`);
        }
    }
});


// NOVO: Acesso ao painel Admin diretamente no mapa
adminButtonMap.addEventListener('click', () => {
    if (adminPanel.style.display === 'none') {
        adminPanel.style.display = 'block';
    } else {
        adminPanel.style.display = 'none';
    }
});

runCommandButton.addEventListener('click', () => {
    executeAdminCommand(adminCommandInput.value);
    adminCommandInput.value = '';
});


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

setInterval(() => {
    // ... (Lógica de Restock igual) ...
}, 1000);

changeScene('map'); // Inicia no mapa
gameLoop();
