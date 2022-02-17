import { Grid, IconButton, Paper } from "@mui/material";
import Monsters from '../Util/Monsters';
import {
  MinusSquare
} from "react-feather";

function Monster({name, img, rewards, removeFromCombo}) {
    function handleRemoveFromCombo(event) {
        removeFromCombo(name);
    }
    const rewardImages = rewards.map((reward, index) => {
        const rewardImg = "rewards/" + reward + ".png";
        return (
            <Grid item xs={3} key={index}>
                <img src={rewardImg} alt={reward} className="reward-icon"/>
            </Grid>
        )
    })
    return (
        <Grid className="monster-grid-item" container spacing={0}>
            <Grid item xs={2}>
               <Grid item xs={12}>
                    <img src={img} alt={name} />
                </Grid>
                <Grid className="monster-grid-button" item xs={12}>
                    <IconButton onClick={handleRemoveFromCombo}>
                        <MinusSquare className="monster-grid-combo-remove-button" />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid container item={true} xs={10}>
                <Grid className="monster-grid-title" item xs={12}>
                    {name}
                </Grid>
                {rewardImages}
            </Grid>
        </Grid>
    )
}


function Combo({combo, removeFromCombo}) {
    const ComboPieces = combo.map((monster) => {
        const imageSrc = Monsters[monster].img;
        const rewards = Monsters[monster].rewards;
        return (
            <Grid item p={0} xs={3} key={monster}>
                <Paper elevation={3}>
                    <Monster name={monster} img={imageSrc} rewards={rewards} removeFromCombo={removeFromCombo}/>
                </Paper>
            </Grid>
        );
    })
    return (
        <div className="monster-combo-box">
            <h2>
                Combo
            </h2>
            <Grid container spacing={6} p={0}>
                {ComboPieces}
            </Grid>
        </div>
    )
}

export default Combo;