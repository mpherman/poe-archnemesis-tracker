import { Grid } from "@mui/material";

function Recipes() {
    return (
        <div>
            <h2>
                Active Recipes
            </h2>
            <Grid container spacing={6} p={0}>
                {"recipes"}
            </Grid>
        </div>
    )
}

export default Recipes;