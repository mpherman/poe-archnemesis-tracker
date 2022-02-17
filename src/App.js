import { React, useState, useEffect } from 'react';
import './App.css';
import { Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import Combo from './Components/Combo';
import Recipes from './Components/Recipes';
import BlankInventory from './Data/MonsterInventory.json'
import TreeUtils from './Util/TreeUtils';

function App() {
    // Load inventory from localStorage
    let loadedInventory = localStorage.getItem('inventory');
    if (!loadedInventory) {
        loadedInventory = BlankInventory;
        localStorage.setItem('inventory', JSON.stringify(BlankInventory));
    }
    else {
        loadedInventory = JSON.parse(loadedInventory);
    }
    const [inventory, setInventory] = useState(loadedInventory);
    // Load combo from localStorage
    let loadedCombo = localStorage.getItem('combo');
    if (!loadedCombo) {
        loadedCombo = [];
        localStorage.setItem('combo', JSON.stringify(loadedCombo));
    }
    else {
        loadedCombo = JSON.parse(loadedCombo);
    }
    const [combo, setCombo] = useState(loadedCombo);
    function updateInventory(newValues) {
        setInventory(inventory => ({ ...inventory, ...newValues }));
        //updateRecipes();
    }
    function addToCombo(name) {
        if (combo.length >= 4) return;
        if (combo.indexOf(name) !== -1) return;
        setCombo(combo => ([...combo, name]));
        //updateRecipes();
    }
    function removeFromCombo(name) {
        setCombo(combo => (combo.filter(item => item !== name)));
        //updateRecipes();
    }

    useEffect(() => {
        console.log("updating recipes");
        updateRecipes();
    }, [combo, inventory]);

    // Get recipes
    const [recipes, setRecipes] = useState({});
    function updateRecipes() {
        let inventoryCopy = TreeUtils.copy(inventory);
        let newRecipes = {};
        console.log(combo);
        for (let i = 0; i < combo.length; i++) {
            const monster = combo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            console.log(monster, tree, inventoryCopy);
            TreeUtils.getActiveRecipes(tree, inventoryCopy, newRecipes);
        }
        console.log("New recipes:", newRecipes);
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
        //updateRecipes();
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
                    <Inventory inventory={inventory} updateInventory={updateInventory} addToCombo={addToCombo}/>  
                </Grid>
            </Grid>
        </div>
        </div>
    );
}

export default App;
