import MONSTER_RECIPES from './Recipes';

function isTierOne(monster) {
    return !MONSTER_RECIPES[monster];
}

function createMonsterTree(monster) {
    if (isTierOne(monster)) {
        return [monster]
    }
    let recipe = MONSTER_RECIPES[monster];
    let monster_tree = {};
    for (let i = 0; i < recipe.length; i++) {
        const recipeMonster = recipe[i];
        monster_tree[recipeMonster] = createMonsterTree(recipeMonster)
    }
    return monster_tree;
}

function getRequiredComponents(tree, components) {
    const monsters = Object.keys(tree);
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (isTierOne(monster)) {
            if (!components[monster]) {
                components[monster] = 1;
            }
            else {
                components[monster]++;
            }
        }
        else {
            getRequiredComponents(tree[monster], components);
        }
    }
}

function getRemainingComponents(tree, inventory, components) {
    const monsters = Object.keys(tree);
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        if (inventory[monster] > 0) {
            console.log("We have this monster: " + monster + "(" + inventory[monster] + ")");
            inventory[monster]--;
        }
        else if (isTierOne(monster)) {
            console.log("We dont't have this monster but its Tier 1: " + monster);
            if (!components[monster]) {
                components[monster] = 1;
            }
            else {
                components[monster]++;
            }
        }
        else {
            console.log("We dont't have this monster and its not Tier 1: " + monster);
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

function copy(object) {
    return JSON.parse(JSON.stringify(object));
}


const TreeUtils = {
    createMonsterTree: createMonsterTree,
    getRequiredComponents: getRequiredComponents,
    getRemainingComponents: getRemainingComponents,
    getActiveRecipes: getActiveRecipes,
    copy: copy,
}

export default TreeUtils;
