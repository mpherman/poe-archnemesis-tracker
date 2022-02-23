import { ButtonBase, Grid, Paper, Typography } from "@mui/material";
import Monsters from '../Util/Monsters';

function Monster({name, img, rewards, collect}) {
    function handleCollect(event) {
        collect(name);
    }
    return (
        <Grid className="monster-grid-item" container spacing={0} alignItems="stretch">
            <ButtonBase onClick={handleCollect} sx={{ width: 1 }}> 
                <Grid item xs={2}>
                <Grid item xs={12}>
                        <img src={img} alt={name} />
                    </Grid>
                </Grid>
                <Grid className="monster-grid-title" item xs={10}>
                    {name}
                </Grid>
            </ButtonBase>
        </Grid>
    )
}


function MissingPieces({missing, collectMonster}) {
    const missingMonsters = Object.keys(missing);
    const missingGrid = missingMonsters.map((monster) => {
        const imageSrc = Monsters[monster].img;
        return (
            <Grid item p={0} xs={3} key={monster}>
                <Paper elevation={3}>
                    <Monster name={monster} img={imageSrc} collect={collectMonster}/>
                </Paper>
            </Grid>
        );
    })
    return (
        <div className="monster-combo-box">
            <Typography display='inline' variant='h2'>
                Missing Pieces
            </Typography>
            <Grid container spacing={6} p={0}>
                {missingGrid}
            </Grid>
        </div>
    )
}

export default MissingPieces;
