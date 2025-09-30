const canvas = document.getElementById('gardenCanvas');
const ctx = canvas.getContext('2d');
const TILE_SIZE = 50;
const ROWS = canvas.height / TILE_SIZE;
const COLS = canvas.width / TILE_SIZE;
const ADMIN_CODE = "admin123";

const GARDEN_GRID_START_X = 2;
const GARDEN_GRID_START_Y = 2;
const GARDEN_WIDTH = 4;
const GARDEN_HEIGHT = 3;

const PETS = {
    none: { name: 'Nenhum', bonus: 1.0, color: 'gray' },
    bunny: { name: 'Coelho', bonus: 1.1, color: 'white' },
    fox: { name: 'Raposa', bonus: 1.25, color: 'orange' },
    dragon: { name: 'Dragão', bonus: 1.5, color: 'purple' }
};

const EGGS = {
    commonEgg: { name: 'Ovo Comum', cost: 1000, color: '#f0e68c', pets: ['bunny'], chance: [1.0] },
    rareEgg: { name: 'Ovo Raro', cost: 5000, color: '#00ced1', pets: ['bunny', 'fox'], chance: [0.7, 0.3] }
};

const GEAR = {
    basicSprinkler: { name: 'Sprinkler Básico', cost: 500, chance: 0.3, description: "30% chance de mutação" },
    proSprinkler: { name: 'Sprinkler Pro', cost: 2000, chance: 0.6, description: "60% chance de mutação" }
};

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
    pet: PETS.none
};

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

const moneySpan = document.getElementById('money');
const sprinklerCountSpan = document.getElementById('sprinklerCount');
const petNameSpan = document.getElementById('petName');
const petBonusSpan = document.getElementById('petBonus');
const harvestAllButton = document.getElementById('harvestAllButton');
const waterButton = document.getElementById('waterButton');

const seedShopModal = document.getElementById('seedShopModal');
const gearShopModal = document.getElementById('gearShopModal');
const eggShopModal = document.getElementById('eggShopModal');
const seedShopItemsDiv = document.getElementById('seed-shop-items');
const gearShopItemsDiv = document.getElementById('gear-shop-items');
const eggShopItemsDiv = document.getElementById('egg-shop-items');
const restockTimerSpan = document.getElementById('restockTimer');
const adminCodeInput = document.getElementById('adminCodeInput');
const adminPanel = document.getElementById('adminPanel');
const adminCommandInput = document.getElementById('adminCommandInput');
const runCommandButton = document.getElementById('runCommandButton');
const adminOutput = document.getElementById('adminOutput');

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

    if (seedShopModal.style.display === 'block') {
        renderSeedShop();
    }
}

function drawGarden() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9c6b4d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = '#805030';
    for (let y = 0; y < ROWS; y++) {
        for (let x = 0; x < COLS; x++) {
            ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }

    gameData.plots.forEach(plot => {
        const cx = plot.gridX * TILE_SIZE + TILE_SIZE / 2;
        const cy = plot.gridY * TILE_SIZE + TILE_SIZE / 2;
        
        ctx.fillStyle = '#805030';
        ctx.fillRect(plot.gridX * TILE_SIZE, plot.gridY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = '#6b432e';
        ctx.strokeRect(plot.gridX * TILE_SIZE, plot.gridY * TILE_SIZE, TILE_SIZE, TILE_SIZE);


        if (plot.isPlanted) {
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
                ctx.strokeRect(plot.gridX * TILE_SIZE, plot.gridY * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';

            if (plot.growthStage < 3) {
                const totalTime = seed.growTime * 1000;
                const timeElapsed = Date.now() - plot.growthStart;
                const progress = Math.min(1, timeElapsed / totalTime);
                const progressText = `${(progress * 100).toFixed(0)}%`;
                ctx.fillText(progressText, cx, cy + TILE_SIZE / 2 - 5);
            } else {
                ctx.fillStyle = plot.isMutated ? 'M. PRONTA!' : 'PRONTA!';
                ctx.font = 'bold 16px Arial';
                ctx.fillText(ctx.fillStyle, cx, cy + TILE_SIZE / 2 - 5);
                ctx.fillStyle = plot.isMutated ? 'yellow' : 'lime';
            }
        }
    });
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
        let value = seed.sellValue;
        
        if (plot.isMutated) {
            value *= 2; 
        }
        
        // Aplicar bônus do Pet
        value *= gameData.pet.bonus;
        
        console.log(`${seed.name} colhida! Valor base: ${seed.sellValue}. Valor Final: ${value.toFixed(2)} Sheckles`);
        
        gameData.money += value;
        
        if (seed.type === 'single') {
            plot.isPlanted = false;
            plot.seedType = null;
        } 
        
        // Recomeçar o ciclo de crescimento para plantas multi-colheita
        plot.growthStart = Date.now();
        plot.growthStage = 0;
        plot.isMutated = false;
        
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

function getActiveSprinklerChance() {
    if (gameData.inventory.proSprinkler > 0) return GEAR.proSprinkler.chance;
    if (gameData.inventory.basicSprinkler > 0) return GEAR.basicSprinkler.chance;
    return 0;
}

function checkMutation(plot, chance) {
    if (plot.isPlanted && plot.growthStage > 0 && plot.growthStage < 3 && !plot.isMutated) {
        if (Math.random() < chance) {
            plot.isMutated = true;
            console.log(`Mutação Acionada na parcela em (${plot.gridX}, ${plot.gridY})!`);
            return true;
        }
    }
    return false;
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
            updateStats();
            return;
        }
    }
}

function renderSeedShop() {
    seedShopItemsDiv.innerHTML = '';
    
    Object.keys(gameData.seeds).forEach(key => {
        const seed = gameData.seeds[key];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const info = document.createElement('span');
        info.innerHTML = `<strong>${seed.name}</strong> (${seed.cost}¢) | Estoque: <span id="stock-${key}">${seed.currentStock}</span> | Seu: ${seed.count}<br><small>Tipo: ${seed.type === 'multi' ? 'Múltipla' : 'Única'}</small>`;

        const buyButton = document.createElement('button');
        buyButton.className = 'buy-button';
        buyButton.textContent = 'Comprar';
        buyButton.disabled = gameData.money < seed.cost || seed.currentStock <= 0;
        
        buyButton.onclick = () => {
            if (gameData.money >= seed.cost && seed.currentStock > 0) {
                gameData.money -= seed.cost;
                seed.currentStock -= 1;
                seed.count += 1;
                updateStats();
                renderSeedShop();
            }
        };

        itemDiv.appendChild(info);
        itemDiv.appendChild(buyButton);
        seedShopItemsDiv.appendChild(itemDiv);
    });
}

function renderGearShop() {
    gearShopItemsDiv.innerHTML = '';
    
    Object.keys(GEAR).forEach(key => {
        const gearItem = GEAR[key];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'gear-item';
        
        const info = document.createElement('span');
        info.innerHTML = `<strong>${gearItem.name}</strong> (${gearItem.cost}¢) | Seu: ${gameData.inventory[key]}<br><small>${gearItem.description}</small>`;

        const buyButton = document.createElement('button');
        buyButton.className = 'buy-button';
        buyButton.textContent = 'Comprar';
        buyButton.disabled = gameData.money < gearItem.cost;
        
        buyButton.onclick = () => {
            if (gameData.money >= gearItem.cost) {
                gameData.money -= gearItem.cost;
                gameData.inventory[key] += 1;
                updateStats();
                renderGearShop();
            }
        };

        itemDiv.appendChild(info);
        itemDiv.appendChild(buyButton);
        gearShopItemsDiv.appendChild(itemDiv);
    });
}

function renderEggShop() {
    eggShopItemsDiv.innerHTML = '';
    
    Object.keys(EGGS).forEach(key => {
        const eggItem = EGGS[key];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'shop-item';
        
        const info = document.createElement('span');
        info.innerHTML = `<strong>${eggItem.name}</strong> (${eggItem.cost}¢)<br><small>Pode chocar: ${eggItem.pets.map(p => PETS[p].name).join(', ')}</small>`;

        const buyButton = document.createElement('button');
        buyButton.className = 'buy-button';
        buyButton.textContent = 'Comprar & Chocar';
        buyButton.disabled = gameData.money < eggItem.cost;
        
        buyButton.onclick = () => {
            if (gameData.money >= eggItem.cost) {
                gameData.money -= eggItem.cost;
                hatchEgg(key);
                renderEggShop();
            }
        };

        itemDiv.appendChild(info);
        itemDiv.appendChild(buyButton);
        eggShopItemsDiv.appendChild(itemDiv);
    });
}

let restockTimer = 60;
function handleRestock() {
    restockTimer--;
    if (restockTimer < 0) {
        restockTimer = 60;
        console.log("Restock da loja de sementes!");
        
        Object.keys(gameData.seeds).forEach(key => {
            const seed = gameData.seeds[key];
            if (seed.currentStock < seed.maxStock) {
                seed.currentStock = Math.min(seed.maxStock, seed.currentStock + 1);
            }
        });
        renderSeedShop();
    }
    
    restockTimerSpan.textContent = restockTimer;
}

function executeAdminCommand(commandString) {
    const parts = commandString.trim().split(/\s+/);
    const command = parts[0].toLowerCase().replace('/', '');
    const value1 = parts[1];
    const value2 = parts.length > 2 ? parts.slice(2).join(' ') : null;
    let output = '';

    try {
        switch (command) {
            case 'give':
                if (value1 === 'money' && !isNaN(parseInt(value2))) {
                    gameData.money += parseInt(value2);
                    output = `Adicionado ${parseInt(value2)} Sheckles. Dinheiro atual: ${gameData.money.toFixed(2)}`;
                } else if (value1 === 'seed' && gameData.seeds[value2] && !isNaN(parseInt(value3))) {
                     gameData.seeds[value2].count += parseInt(value3);
                     output = `Adicionado ${parseInt(value3)} sementes de ${gameData.seeds[value2].name}.`;
                } else if (value1 === 'sprinkler' && (value2 === 'basic' || value2 === 'pro') && !isNaN(parseInt(value3))) {
                    gameData.inventory[`${value2}Sprinkler`] += parseInt(value3);
                    output = `Adicionado ${parseInt(value3)} Sprinklers ${value2}.`;
                } else {
                    output = "Erro: Comando GIVE inválido. Tente: /give money 1000, /give sprinkler basic 5";
                }
                break;

            case 'set':
                if (value1 === 'money' && !isNaN(parseInt(value2))) {
                    gameData.money = parseInt(value2);
                    output = `Dinheiro definido para ${gameData.money.toFixed(2)}`;
                } else if (value1 === 'pet' && PETS[value2]) {
                    gameData.pet = PETS[value2];
                    output = `Pet definido para ${gameData.pet.name} (x${gameData.pet.bonus.toFixed(2)})`;
                } else {
                    output = "Erro: Comando SET inválido. Tente: /set money 500 ou /set pet dragon";
                }
                break;
                
            case 'max':
                if (value1 === 'all') {
                    gameData.money = 999999;
                    Object.keys(gameData.seeds).forEach(key => gameData.seeds[key].count = 99);
                    gameData.inventory.basicSprinkler = 99;
                    gameData.inventory.proSprinkler = 99;
                    gameData.pet = PETS.dragon; 
                    output = "Dinheiro, sementes e equipamentos maximizados! Pet: Dragão!";
                } else {
                    output = "Erro: Comando MAX inválido. Tente: /max all";
                }
                break;

            case 'grow':
                if (value1 === 'all') {
                    gameData.plots.forEach(p => {
                        if(p.isPlanted) p.growthStage = 3;
                    });
                    output = "Todas as plantas prontas para colheita!";
                } else {
                    output = "Erro: Comando GROW inválido. Tente: /grow all";
                }
                break;

            default:
                output = "Comando Admin desconhecido. Comandos: /give, /set, /max, /grow.";
                break;
        }
        adminOutput.style.color = 'green';
    } catch (e) {
        output = `Erro: ${e.message}`;
        adminOutput.style.color = 'red';
    }
    adminOutput.textContent = output;
    updateStats();
}

document.getElementById('shopButton').addEventListener('click', () => {
    renderSeedShop();
    seedShopModal.style.display = 'block';
});

document.getElementById('gearButton').addEventListener('click', () => {
    renderGearShop();
    gearShopModal.style.display = 'block';
});

document.getElementById('eggButton').addEventListener('click', () => {
    renderEggShop();
    eggShopModal.style.display = 'block';
});

document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', (e) => {
        document.getElementById(e.target.dataset.modal).style.display = 'none';
    });
});

window.onclick = function(event) {
    if (event.target == seedShopModal) {
        seedShopModal.style.display = "none";
    }
    if (event.target == gearShopModal) {
        gearShopModal.style.display = "none";
    }
    if (event.target == eggShopModal) {
        eggShopModal.style.display = "none";
    }
};

waterButton.addEventListener('click', () => {
    const chance = getActiveSprinklerChance();
    if (chance > 0) {
        // Usa o melhor sprinkler disponível
        if (gameData.inventory.proSprinkler > 0) {
            gameData.inventory.proSprinkler--;
        } else if (gameData.inventory.basicSprinkler > 0) {
            gameData.inventory.basicSprinkler--;
        }
        
        let mutationSuccess = false;
        
        gameData.plots.forEach(plot => {
            if (checkMutation(plot, chance)) {
                mutationSuccess = true;
            }
        });
        
        if (!mutationSuccess) {
            alert(`O Sprinkler foi usado (Chance: ${chance*100}%), mas nenhuma mutação ocorreu desta vez.`);
        } else {
             alert(`MUTACÃO acionada com sucesso em uma ou mais plantas!`);
        }
        updateStats();
    }
});

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
            const carrotSeed = gameData.seeds.carrot;
            const pumpkinSeed = gameData.seeds.pumpkin;
            const strawberrySeed = gameData.seeds.strawberry;
            
            let message = "Qual semente você gostaria de plantar?\n";
            if (carrotSeed.count > 0) message += `1 - Cenoura (${carrotSeed.cost}¢)\n`;
            if (pumpkinSeed.count > 0) message += `2 - Abóbora (${pumpkinSeed.cost}¢)\n`;
            if (strawberrySeed.count > 0) message += `3 - Morango (${strawberrySeed.cost}¢ - Múltipla)\n`;
            message += "Digite o número ou Cancelar.";
            
            const choice = prompt(message);
            
            if (choice === '1' && carrotSeed.count > 0) {
                plantSeed('carrot', plotIndex);
            } else if (choice === '2' && pumpkinSeed.count > 0) {
                plantSeed('pumpkin', plotIndex);
            } else if (choice === '3' && strawberrySeed.count > 0) {
                plantSeed('strawberry', plotIndex);
            } else if (choice !== null) {
                alert("Seleção inválida ou sem sementes.");
            }
        } else {
            alert(`Planta em crescimento! Estágio: ${plot.growthStage}/3.`);
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === '/') {
        e.preventDefault();
        if (adminPanel.style.display === 'none') {
            adminCodeInput.style.display = 'block';
            adminCodeInput.focus();
        }
    }
});

adminCodeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const code = adminCodeInput.value.trim();
        if (code === ADMIN_CODE) {
            adminCodeInput.style.display = 'none';
            adminPanel.style.display = 'block';
            adminCommandInput.focus();
            adminOutput.textContent = 'Painel Admin Aberto. Digite comandos.';
        } else {
            alert("Código Admin Incorreto.");
            adminCodeInput.value = '';
            adminCodeInput.style.display = 'none';
        }
    }
});

runCommandButton.addEventListener('click', () => {
    executeAdminCommand(adminCommandInput.value);
    adminCommandInput.value = '';
});

adminCommandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        executeAdminCommand(adminCommandInput.value);
        adminCommandInput.value = '';
    }
});

function gameLoop() {
    runIdleLogic();
    drawGarden();
    requestAnimationFrame(gameLoop);
}

setInterval(handleRestock, 1000);

updateStats();
gameLoop();
