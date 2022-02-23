import React, { useState } from 'react';
import { Grid, Paper, Button, IconButton, TextField, Typography, } from "@mui/material";
import Monsters from '../Util/Monsters';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  PlusSquare
} from "react-feather";


function Monster({name, img, count, add, subtract, addToCombo}) {
    function handleAdd(event) {
        add(name);
    };
    function handleSubtract(event) {
        subtract(name);
    }
    function handleAddToCombo(event) {
        addToCombo(name);
    }
    return (
        <Grid className="monster-grid-item" container spacing={0}>
            <Grid item xs={2}>
               <Grid item xs={12}>
                    <img src={img} alt={name} />
                </Grid>
                <Grid className="monster-grid-button" item xs={12}>
                    <IconButton onClick={handleAddToCombo}>
                        <PlusSquare className="monster-grid-combo-button success" />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container item={true} xs={10}>
                <Grid className="monster-grid-title" item xs={12}>
                    {name}
                </Grid>
                <Grid className="monster-grid-button" item xs={2}>
                    <Button onClick={handleSubtract}>
                        <ArrowDownCircle/>
                    </Button>
                </Grid>
                <Grid className="monster-grid-info" item xs={6}>
                    {count}
                </Grid>
                <Grid className="monster-grid-button" item xs={2}>
                    <Button onClick={handleAdd}>
                        <ArrowUpCircle/>
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

function Inventory({inventory, updateInventory, addToCombo}) {
    const [searchString, setSearchString] = useState("");
    function handleSearch(event) {
        setSearchString(event.target.value);
    }
    const monsterKeys = Object.keys(inventory);
    function add(name) {
        let updatedValue = {}
        updatedValue[name] = inventory[name] + 1; 
        updateInventory(updatedValue);
    }
    function subtract(name) {
        let updatedValue = {}
        updatedValue[name] = Math.max(0, inventory[name]-1);
        updateInventory(updatedValue);
    }
    const inventoryObjects = monsterKeys.map((monster) => {
        if (!monster.toLowerCase().includes(searchString.toLowerCase())) {
            return (
                <React.Fragment key={monster}></React.Fragment>
            )
        }
        const imageSrc = Monsters[monster].img;
        const monsterCount = inventory[monster];
        return (
            <Grid item p={0} xs={3} key={monster}>
                <Paper elevation={3}>
                    <Monster name={monster} img={imageSrc} count={monsterCount} add={add} subtract={subtract} addToCombo={addToCombo}/>
                </Paper>
            </Grid>
        );
    });
    return (
        <div className="inventory">
            <Typography display='inline' variant='h2'>
                Inventory
            </Typography>
            <Typography display='inline' variant='h6'>
                <TextField 
                    hiddenLabel
                    id='inventory-filter' 
                    placeholder='Search' 
                    variant='outlined' 
                    onChange={handleSearch} 
                    style={
                        {
                            'fontColor': '#000',
                            'backgroundColor': '#fff',
                            'marginLeft': '40px'
                        }
                    } />
            </Typography>
            <Typography variant='h6'>
                <Grid container spacing={6} p={0}>
                    {inventoryObjects}
                </Grid>
            </Typography>
        </div>
    );
}

export default Inventory;