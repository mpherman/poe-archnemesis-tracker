import { FormControl, Grid, MenuItem, Paper, Select, Typography, } from "@mui/material";
import React from 'react';
import Monsters from '../Util/Monsters';

function Monster({name, img, rewards, haveInInventory, openTooltip}) {
    const rewardImages = rewards.map((reward, index) => {
        const rewardImg = "rewards/" + reward + ".png";
        return (
            <Grid item xs={3} key={index}>
                <img src={rewardImg} alt={reward} className="reward-icon"/>
            </Grid>
        )
    });
    const handleTooltipClick = (event) => {
        openTooltip(name);
    }
    const className = haveInInventory ? 'combo-grid-completed' : 'combo-grid-missing';
    return (
        <Grid className={className} container spacing={0}>
            <Grid item xs={2}>
               <Grid item xs={12}>
                    <img src={img} alt={name} />
                </Grid>
            </Grid>
            <Grid container item={true} xs={10} onClick={handleTooltipClick}>
                <Grid className="monster-grid-title" item xs={12}>
                    {name}
                </Grid>
                {rewardImages}
            </Grid>
        </Grid>
    )
}

function ActiveCombo({combo, inventory, openTooltip, updateActiveCombo}) {
    const ComboPieces = !combo ? <React.Fragment></React.Fragment> : combo.map((monster, index) => {
        if (!monster) {
            return (
                <Grid item p={0} xs={3} key={index}>
                    <Paper elevation={3}>
                    </Paper>
                </Grid>
            )
        }
        const imageSrc = Monsters[monster].img;
        const rewards = Monsters[monster].rewards;
        return (
            <Grid item p={0} xs={3} key={index}>
                <Paper elevation={3}>
                    <Monster 
                        name={monster} 
                        img={imageSrc} 
                        rewards={rewards} 
                        haveInInventory={inventory[monster] > 0} 
                        /*removeFromCombo={removeFromCombo}*/
                        openTooltip={openTooltip} />
                </Paper>
            </Grid>
        );
    });
    function dropdownChange(event) {
        combo[event.target.name] = event.target.value;
        updateActiveCombo(combo);
    }
    const dropdownChoices = Object.keys(Monsters).map(monster => {
        return (
            <MenuItem value={monster}>{monster}</MenuItem>
        )
    })
    const activeDropdowns = [0,1,2,3].map(x => {
        return (
            <Grid item xs={3} key={x}>
                <FormControl sx={{minWidth:120}}
                    style={
                        {
                            'fontColor': '#000',
                            'backgroundColor': '#fff',
                            'marginLeft': '40px'
                        }
                    }>
                    <Select
                        onChange={dropdownChange}
                        displayEmpty
                        name={''+x}
                        id={x}
                        defaultValue=""
                    >
                        <MenuItem value="">
                            None
                        </MenuItem>
                        {dropdownChoices}
                    </Select>
                </FormControl>
            </Grid>
        )
    })
    return (
        <Grid container spacing={6} p={0}>
            <Grid container item xs={12}>
                {ComboPieces}
            </Grid>
            <Grid container item xs={12}>
                {activeDropdowns}
            </Grid>
        </Grid>
    )
}

function getComboDisplayName(combo) {
    let display = '';
    for (let i = 0; i < combo.length; i++) {
        if (i !== 0) {
            display += ', ';
        }
        display += combo[i]
    }
    return display;
}

function ComboList({combos, active}) {
    function onComboSelection(event) {
        console.log(event);
    }
    const comboOptions = combos.map((combo, index) => {
        return (
            <MenuItem value={index}>{getComboDisplayName(combo)}</MenuItem>
        )
    })
    return (
        <FormControl sx={{minWidth:120}}
            style={
                {
                    'fontColor': '#000',
                    'backgroundColor': '#fff',
                    'marginLeft': '40px',
                }
            }>
            <Select
                onChange={onComboSelection}
                displayEmpty
            >
                {comboOptions}
            </Select>
        </FormControl>
    )
}


function Combos({combos, active, inventory, openTooltip, updateActiveCombo}) {
    return (
        <div className="monster-combo-box">
            <Typography display='inline' variant='h2'>
                Combos
            </Typography>
            <ComboList combos={combos} active={active}/>
            <ActiveCombo combo={active} inventory={inventory} openTooltip={openTooltip} updateActiveCombo={updateActiveCombo}/>
        </div>
    )
}

export default Combos;