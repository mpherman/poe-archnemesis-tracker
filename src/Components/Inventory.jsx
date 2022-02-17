import { Grid, Card as MuiCard, Paper, Button, } from "@mui/material";
import { useState } from 'react';
import Monsters from '../Util/Monsters';
import {
  ArrowUpCircle,
  ArrowDownCircle,
} from "react-feather";


function Monster({name, img, count, add, subtract}) {
    function handleAdd(event) {
        add(name);
    };
    function handleSubtract(event) {
        subtract(name);
    }
    return (
        <Grid className="monster-grid-item" container spacing={0}>
            <Grid item xs={2}>
                <img src={img} alt={name} />
            </Grid>
            <Grid container xs={10}>
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

function Inventory({inventoryProp}) {
    const [inventory, setInventory] = useState(inventoryProp);
    const monsterKeys = Object.keys(inventory);
    function add(name) {
        let updatedValue = {}
        updatedValue[name] = inventory[name] + 1; 
        setInventory(inventory => ({ ...inventory, ...updatedValue }));
    }
    function subtract(name) {
        let updatedValue = {}
        updatedValue[name] = Math.max(0, inventory[name]-1);
        setInventory(inventory => ({ ...inventory, ...updatedValue }));
    }
    const inventoryObjects = monsterKeys.map((monster) => {
        const imageSrc = Monsters[monster].img;
        const monsterCount = inventory[monster];
        return (
            <Grid item p={0} xs={12} key={monster}>
                <Paper elevation={3}>
                    <Monster name={monster} img={imageSrc} count={monsterCount} add={add} subtract={subtract}/>
                </Paper>
            </Grid>
        );
    });
    return (
        <div>
            <h2>
                Inventory
            </h2>
            <Grid container spacing={6} p={0}>
                {inventoryObjects}
            </Grid>
        </div>
    );
}

export default Inventory;