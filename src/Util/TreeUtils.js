import MONSTER_RECIPES from './Recipes';
import BlankInventory from '../Data/MonsterInventory'

function isTierOne(monster) {
    return !MONSTER_RECIPES[monster];
}

function createSubTree(monster) {
    if (isTierOne(monster)) {
        return [monster]
    }
    let recipe = MONSTER_RECIPES[monster];
    let monster_tree = {};
    for (let i = 0; i < recipe.length; i++) {
        const recipeMonster = recipe[i];
        monster_tree[recipeMonster] = createSubTree(recipeMonster)
    }
    return monster_tree;
}

function createMonsterTree(monster) {
    let monster_tree = {};
    monster_tree[monster] = createSubTree(monster);
    return monster_tree;
}

function getRequiredComponents(tree, components) {
    const monsters = Object.keys(tree);
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (!components[monster]) {
            components[monster] = 1;
        }
        else {
            components[monster]++;
        }
        if (!isTierOne(monster)) {
            getRequiredComponents(tree[monster], components);
        }
    }
}

function getRemainingComponents(tree, inventory, components) {
    let monsters;
    if (Array.isArray(tree)) {
        monsters = tree;
    }
    else {
        monsters = Object.keys(tree);
    }
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (inventory[monster] > 0) {
            inventory[monster]--;
        }
        else if (isTierOne(monster)) {
            if (!components[monster]) {
                components[monster] = 1;
            }
            else {
                components[monster]++;
            }
        }
        else {
            getRemainingComponents(tree[monster], inventory, components);
        }
    }
}

function getActiveRecipes(tree, inventory, recipes) {
    const monsters = Object.keys(tree);
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (!isTierOne(monster)) {
            const recipe = MONSTER_RECIPES[monster];
            let canDoRecipe = true;
            for (let j = 0; j < recipe.length; j++) {
                const recipeMonster = recipe[j];
                if (inventory[recipeMonster] === 0) {
                    canDoRecipe = false;
                }
            }
            if (canDoRecipe) {
                recipes[monster] = recipe;
            }
            getActiveRecipes(tree[monster], inventory, recipes);
        }
    }
}

function getRecipe(monster) {
    return MONSTER_RECIPES[monster];
}

function getTreeDepth(tree) {
    if (Array.isArray(tree)) return 0;
    const monsters = Object.keys(tree);
    let depth = 0;
    for (let i = 0; i < monsters.length; i++) {
        depth = Math.max(depth, getTreeDepth(tree[monsters[i]]));
    }
    return depth + 1;
}

function copy(object) {
    return JSON.parse(JSON.stringify(object));
}

function getExportCode(inventory) {
    return JSON.stringify(inventory);
}

function isValidImportCode(code) {
    let newInventory;
    try {
        newInventory = JSON.parse(code);
    }
    catch (error) {
        return false;
    }
    if (typeof newInventory !== 'object') return false;
    let defaultMonsters = Object.keys(BlankInventory);
    let newMonsters = Object.keys(newInventory);
    if (defaultMonsters.length !== newMonsters.length) return false;
    for (let i = 0; i < defaultMonsters.length; i++) {
        const monster = defaultMonsters[i];
        // Monster must exist
        if (newInventory[monster] === undefined) return false;
        // Monster must be a number
        if (typeof newInventory[monster] !== 'number') return false;
        // Monster must be an integer
        if (!Number.isInteger(newInventory[monster])) return false;
        // Monster must be a positive value less than 64
        if (newInventory[monster] < 0 || newInventory[monster] > 64) return false;
    }
    return true;
}

function getImportedInventory(code) {
    return JSON.parse(code);
}


const TreeUtils = {
    createMonsterTree: createMonsterTree,
    getRequiredComponents: getRequiredComponents,
    getRemainingComponents: getRemainingComponents,
    getActiveRecipes: getActiveRecipes,
    copy: copy,
    getRecipe: getRecipe,
    getTreeDepth: getTreeDepth,
    getExportCode: getExportCode,
    isValidImportCode: isValidImportCode,
    getImportedInventory: getImportedInventory,
}

export default TreeUtils;
