import { React, useState, useEffect } from 'react';
import './App.css';
import { Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import Combo from './Components/Combo';
import Recipes from './Components/Recipes';
import BlankInventory from './Data/MonsterInventory.json';
import TreeUtils from './Util/TreeUtils';
import StorageUtils from './Data/StorageUtils';
import MissingPieces from './Components/Missing';

function App() {
    // Load inventory from localStorage
    let loadedInventory =  StorageUtils.load('inventory', BlankInventory);
    const [inventory, setInventory] = useState(loadedInventory);
    // Load combo from localStorage
    let loadedCombo = StorageUtils.load('combo', []);
    const [combo, setCombo] = useState(loadedCombo);
    function updateInventory(newValues) {
        const newInventory = { ...inventory, ...newValues };
        setInventory(inventory => newInventory);
        StorageUtils.save('inventory', newInventory);
    }
    function addToCombo(name) {
        if (combo.length >= 4) return;
        if (combo.indexOf(name) !== -1) return;
        let newCombo = [...combo, name];
        setCombo(combo => newCombo);
        StorageUtils.save('combo', newCombo);
    }
    function removeFromCombo(name) {
        const newCombo = combo.filter(item => item !== name);
        setCombo(combo => newCombo);
        StorageUtils.save('combo', newCombo);
    }

    useEffect(() => {
        updateRecipes();
        updateMissing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [combo, inventory]);

    // Get recipes
    const [recipes, setRecipes] = useState({});
    function updateRecipes() {
        let inventoryCopy = TreeUtils.copy(inventory);
        let newRecipes = {};
        for (let i = 0; i < combo.length; i++) {
            const monster = combo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            TreeUtils.getActiveRecipes(tree, inventoryCopy, newRecipes);
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
        for (let i = 0; i < combo.length; i++) {
            const monster = combo[i];
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
                    <Combo combo={combo} inventory={inventory} removeFromCombo={removeFromCombo}/>  
                </Grid>
                <Grid item xs={12}>
                    <Recipes recipes={recipes} update={completeRecipe}/>  
                </Grid>
                <Grid item xs={12}>
                    <MissingPieces missing={missing} collectMonster={collectMonster}/>  
                </Grid>
                <Grid item xs={12}>
                    <Inventory inventory={inventory} updateInventory={updateInventory} addToCombo={addToCombo}/>  
                </Grid>
            </Grid>
        </div>
        </div>
    );
}

export default App;
