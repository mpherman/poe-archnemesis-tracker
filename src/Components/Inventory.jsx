import { Grid, Paper, Button, IconButton, } from "@mui/material";
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