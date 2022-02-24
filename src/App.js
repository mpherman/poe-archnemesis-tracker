import { React, useState, useEffect } from 'react';
import './App.css';
import { Backdrop, Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import Combos from './Components/Combos';
import Recipes from './Components/Recipes';
import Tree from './Components/Tree';
import BlankInventory from './Data/MonsterInventory.json';
import TreeUtils from './Util/TreeUtils';
import StorageUtils from './Data/StorageUtils';
import MissingPieces from './Components/Missing';

function App() {
    // Load inventory from localStorage
    let loadedInventory =  StorageUtils.load('inventory', BlankInventory);
    const [inventory, setInventory] = useState(loadedInventory);
    // Load activeCombo
    let loadedActiveCombo = StorageUtils.load('activeCombo', ['', '', '', '']);
    const [activeCombo, setActiveCombo] = useState(loadedActiveCombo);
    // Load combos from localStorage
    let loadedCombos = StorageUtils.load('combos', [loadedActiveCombo]);
    const [combos, setCombo] = useState(loadedCombos);
    function updateInventory(newValues) {
        const newInventory = { ...inventory, ...newValues };
        setInventory(inventory => newInventory);
        StorageUtils.save('inventory', newInventory);
    }
    function updateActiveCombo(combo) {
        const newActiveCombo = [...combo];
        setActiveCombo(x => newActiveCombo);
        StorageUtils.save('activeCombo', newActiveCombo);
    }

    useEffect(() => {
        updateRecipes();
        updateMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeCombo, inventory]);

    // Get recipes
    const [recipes, setRecipes] = useState({});
    function updateRecipes() {
        let inventoryCopy = TreeUtils.copy(inventory);
        let newRecipes = {};
        for (let i = 0; i < activeCombo.length; i++) {
            if (!activeCombo[i]) continue;
            const monster = activeCombo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            let monsterRecipes = {}
            TreeUtils.getActiveRecipes(tree, inventoryCopy, monsterRecipes);
            newRecipes[monster] = monsterRecipes;
        }
        setRecipes((oldRecipes) => newRecipes);
    }
    function completeRecipe(monster) {
        const recipe = TreeUtils.getRecipe(monster);
        let newInventoryValues = {};
        for (let i = 0; i < recipe.length; i++) {
            newInventoryValues[recipe[i]] = inventory[recipe[i]] - 1;
        }
        newInventoryValues[monster] = inventory[monster] + 1;
        updateInventory(newInventoryValues);
    }

    // Determine missing pieces
    const [missing, setMissing] = useState({});
    function updateMissing() {
        let remainingComponents = {};
        let inventoryCopy = TreeUtils.copy(inventory);
        for (let i = 0; i < activeCombo.length; i++) {
            if (!activeCombo[i]) continue;
            const monster = activeCombo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            TreeUtils.getRemainingComponents(tree, inventoryCopy, remainingComponents);
        }
        setMissing((oldMissing) => remainingComponents);
    }
    function collectMonster(name) {
        const newValue = {};
        newValue[name] = inventory[name] + 1;
        updateInventory(newValue);
    }
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipTree, setTooltipTree] = useState({});
    const closeTooltip = () => {
        setTooltipOpen(false);
    }
    const openTooltip = (monster) => {
        setTooltipOpen(true);
        setTooltipTree(oldTree => TreeUtils.createMonsterTree(monster));
    }
    return (
        <div className="App">
        <header className="App-header">
            <h1>
                Archnemesis Tracker
            </h1>
        </header>
        <div className="App-body">
            <Grid container spacing={0}>
                <Grid item xs={12}>
                    <Combos combos={combos} active={activeCombo} inventory={inventory} openTooltip={openTooltip} updateActiveCombo={updateActiveCombo}/>  
                </Grid>
                <Grid item xs={12}>
                    <Recipes recipes={recipes} update={completeRecipe}/>  
                </Grid>
                <Grid item xs={12}>
                    <MissingPieces missing={missing} collectMonster={collectMonster}/>  
                </Grid>
                <Grid item xs={12}>
                    <Inventory inventory={inventory} updateInventory={updateInventory} />  
                </Grid>
            </Grid>
            <Backdrop open={tooltipOpen} onClick={closeTooltip}>
                <Tree tree={tooltipTree} inventory={inventory}/>
            </Backdrop>
        </div>
        </div>
    );
}

export default App;
