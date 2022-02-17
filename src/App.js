import React from 'react';
import './App.css';
import { Grid } from "@mui/material";
import Inventory from './Components/Inventory';
import BlankInventory from './Data/MonsterInventory.json'

function App() {
    console.log(BlankInventory);
    // Load inventory from localStorage
    let inventory = localStorage.getItem('inventory');
    if (!inventory) {
        inventory = BlankInventory;
        localStorage.setItem('inventory', JSON.stringify(BlankInventory));
    }
    else {
        inventory = JSON.parse(inventory);
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
                <Grid item xs={3}>
                    <Inventory inventoryProp={inventory}/>  
                </Grid>
            </Grid>
        </div>
        </div>
    );
}

export default App;
