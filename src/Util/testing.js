const fs = require('fs');

let inventory = {
    // Tier 1
    "Arcane Buffer": 2,
    "Berserker": 3,
    "Bloodletter": 0,
    "Bombardier": 1,
    "Bonebreaker": 3,
    "Chaosweaver": 1,
    "Consecrator": 1,
    "Deadeye": 1,
    "Dynamo": 3,
    "Echoist": 2,
    "Flameweaver": 3,
    "Frenzied": 1,
    "Frostweaver": 2,
    "Gargantuan": 1,
    "Hasted": 0,
    "Incendiary": 0,
    "Juggernaut": 1,
    "Malediction": 1,
    "Opulent": 0,
    "Overcharged": 2,
    "Permafrost": 2,
    "Sentinel": 0,
    "Soul Conduit": 2,
    "Steel-Infused": 2,
    "Stormweaver": 0,
    "Toxic": 3,
    "Vampiric": 3,
    // Tier 2
    "Rejuvenating": 2,
    "Corrupter": 0,
    "Assassin": 0,
    "Hexer": 0,
    "Entangler": 0,
    "Necromancer": 2,
    "Drought Bringer": 1,
    "Hexer": 0,
    "Evocationist": 0,
    "Treant Horde": 0,
    "Invulnerable": 0,
    "Frost Strider": 1,
    "Storm Strider": 0,
    "Flame Strider": 2,
    "Executioner": 0,
    "Magma Barrier": 1,
    "Ice Prison": 1,
    "Heralding Minions": 2,
    "Mana Siphoner": 2,
    "Mirror Image": 2,
    "Empowering Minions": 0,
    // Tier 3
    "Effigy": 0,
    "Crystal-Skinned": 0,
    "Temporal Bubble": 0,
    "Empowered Elements": 0,
    "Trickster": 0,
    "Soul Eater": 0,
    "Tukohama-touched": 1,
    "Corpse Detonator": 1,
    "Abberath-touched": 0,
    // Tier 4
    "Lunaris-touched": 0,
    "Solaris-touched": 0,
    "Arakaali-touched": 1,
    "Innocence-touched": 0,
    "Shakari-touched": 0,
    "Kitava-touched": 0,
    "Brine King-touched": 1,
}

const MONSTER_RECIPES = {
    "Rejuvenating": [ "Gargantuan", "Vampiric" ],
    "Corrupter": ["Bloodletter", "Chaosweaver"],
    "Assassin": ["Deadeye", "Vampiric"],
    "Hexer": ["Chaosweaver", "Echoist"],
    "Entangler": ["Toxic", "Bloodletter"],
    "Necromancer": ["Bombardier", "Overcharged"],
    "Drought Bringer": ["Malediction", "Deadeye"],
    "Hexer": ["Chaosweaver", "Echoist"],
    "Evocationist": ["Flameweaver", "Frostweaver", "Stormweaver"],
    "Treant Horde": ["Toxic", "Sentinel", "Steel-Infused"],
    "Invulnerable": ["Sentinel", "Juggernaut", "Consecrator"],
    "Frost Strider": ["Frostweaver", "Hasted"],
    "Storm Strider": ["Stormweaver", "Hasted"],
    "Flame Strider": ["Flameweaver", "Hasted"],
    "Executioner": ["Frenzied", "Berserker"],
    "Magma Barrier": ["Incendiary", "Bonebreaker"],
    "Ice Prison": ["Permafrost", "Sentinel"],
    "Heralding Minions": ["Dynamo", "Arcane Buffer"],
    "Mana Siphoner": ["Consecrator", "Dynamo"],
    "Mirror Image": ["Echoist", "Soul Conduit"],
    "Empowering Minions": ["Necromancer", "Executioner", "Gargantuan"],
    "Effigy": ["Hexer", "Malediction", "Corrupter"],
    "Crystal-Skinned": ["Rejuvenating", "Permafrost", "Berserker"],
    "Temporal Bubble": ["Juggernaut", "Hexer", "Arcane Buffer"],
    "Empowered Elements": ["Evocationist", "Steel-infused", "Chaosweaver"],
    "Trickster": ["Overcharged", "Assassin", "Echoist"],
    "Soul Eater": ["Necromancer", "Soul Conduit", "Gargantuan"],
    "Tukohama-touched": ["Bonebreaker", "Executioner", "Magma Barrier"],
    "Corpse Detonator": ["Necromancer", "Incendiary"],
    "Abberath-touched": ["Flame Strider", "Frenzied", "Rejuvenating"],
    "Lunaris-touched": ["Frost Strider", "Invulnerable", "Empowering Minions"],
    "Solaris-touched": ["Invulnerable", "Magma Barrier", "Empowering Minions"],
    "Arakaali-touched": ["Corpse Detonator", "Entangler", "Assassin"],
    "Innocence-touched": ["Lunaris-touched", "Solaris-touched", "Mirror Image", "Mana Siphoner"],
    "Shakari-touched": ["Entangler", "Soul Eater", "Drought Bringer"],
    "Kitava-touched": ["Abberath-touched", "Tukohama-touched", "Corrupter", "Corpse Detonator"],
    "Brine King-touched": ["Ice Prison", "Storm Strider", "Heralding Minions"],
}

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
                if (inventory[recipeMonster] == 0) {
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

let filename = 'test.json'
//let tree = createMonsterTree("Innocence-touched")
//let components = {};
//getRequiredComponents(tree, components);
//let remainingComponents = {}
//getRemainingComponents(tree, copy(inventory), remainingComponents)
//console.log(components)
//console.log(remainingComponents);
//fs.writeFileSync(filename, JSON.stringify(tree, null, 4));

/* let intentoryRemaining = copy(inventory);
let componentsNeeded = {};
let componentsRemaining = {};
let activeRecipes = {};
for (let i = 0; i < comboTargets.length; i++) {
    const monsterTree = createMonsterTree(comboTargets[i]);
    getRequiredComponents(monsterTree, componentsNeeded);
    getRemainingComponents(monsterTree, intentoryRemaining, componentsRemaining);
    getActiveRecipes(monsterTree, copy(inventory), activeRecipes);
} */
//console.log(componentsNeeded);
//console.log(componentsRemaining);
//console.log(activeRecipes);

function main() {
    const comboTargets = [ 'Kitava-touched', 'Brine King-touched', 'Treant Horde', 'Arakaali-touched' ];
    let monsters = Object.keys(inventory);
    let monsterInfo = {};
    for (let i = 0; i < monsters.length; i++) {
        const monster = monsters[i];
        monsterInfo[monster] = {
            img: "monsters/" + monster.toLocaleLowerCase().replace(" ", "-") +".png"
        }
    }
    console.log(monsterInfo);
    let filename = 'monsters.json'
    fs.writeFileSync(filename, JSON.stringify(monsterInfo, null, 4));
}

main();


