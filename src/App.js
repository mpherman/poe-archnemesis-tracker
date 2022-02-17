import { React, useState } from 'react';
import './App.css';
import { Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import Combo from './Components/Combo';
import Recipes from './Components/Recipes';
import BlankInventory from './Data/MonsterInventory.json'

function App() {
    console.log(BlankInventory);
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
    let combo = localStorage.getItem('combo');
    if (!combo) {
        combo = [];
        localStorage.setItem('combo', JSON.stringify(combo));
    }
    else {
        combo = JSON.parse(combo);
    }

    function updateInventory(newValues) {
        setInventory(inventory => ({ ...inventory, ...newValues }));
    }
    function addToCombo(name) {
        console.log('adding to combo:' + name)
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
                    <Combo comboProp={combo}/>  
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
