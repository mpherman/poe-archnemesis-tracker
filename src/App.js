import { React, useState } from 'react';
import './App.css';
import { Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import Combo from './Components/Combo';
import Recipes from './Components/Recipes';
import BlankInventory from './Data/MonsterInventory.json'

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
    }
    function addToCombo(name) {
        if (combo.length >= 4) return;
        if (combo.indexOf(name) !== -1) return;
        setCombo(combo => ([...combo, name]));
    }
    function removeFromCombo(name) {
        setCombo(combo => (combo.filter(item => item !== name)))
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
                    <Combo combo={combo} removeFromCombo={removeFromCombo}/>  
                </Grid>
                <Grid item xs={12}>
                    <Recipes />  
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
