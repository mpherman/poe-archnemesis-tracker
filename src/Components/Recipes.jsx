import { Grid, IconButton, Paper, Typography } from "@mui/material";
import Monsters from '../Util/Monsters';
import {
  CheckSquare
} from "react-feather";

function Recipe({monster, components, update}) {
    const imgSrc = Monsters[monster].img;
    const recipeComponents = components.map((component, index) => {
        return (
            <Grid item xs={3} key={index}>
                <Paper elevation={3}>
                    <div className="monster-grid-item">
                        {component}
                        <img className="monster-image" src={Monsters[component].img} alt={component} />
                    </div>
                </Paper>
            </Grid>
        )
    });
    function handleUpdate(event) {
        update(monster);
    }
    return (
        <Grid className="recipe-container" container spacing={1}>
            <Grid item xs={12}>
                <IconButton onClick={handleUpdate}>
                    <CheckSquare className="success-light" />
                </IconButton>
                {monster}
                <img src={imgSrc} alt={monster} />
            </Grid>
            <Grid container item xs={12} spacing={2}>
                {recipeComponents}
            </Grid>
        </Grid>
    )
}

function RecipeSection({monster, recipes, update}) {
    const recipeMonsters = Object.keys(recipes);
    const recipeList = recipeMonsters.map((recipeMonster, index) => {
        return <Recipe monster={recipeMonster} components={recipes[recipeMonster]} key={index} update={update}/>
    })

    return (
        <div className="recipe-section">
            <Typography variant="h5" className="recipe-section-title">
                {monster}
            </Typography>
            <Typography variant="h6">
                {recipeList}
            </Typography>
        </div>
    )
}

function Recipes({recipes, update}) {
    const recipeMonsters = Object.keys(recipes);
    const recipeGrid = recipeMonsters.map((recipeMonster, index) => {
        return <RecipeSection monster={recipeMonster} recipes={recipes[recipeMonster]} key={index} update={update} />
    })
    return (
        <div className="monster-recipe-box">
            <Typography display='inline' variant='h2'>
                Active Recipes
            </Typography>
            {recipeGrid}
        </div>
    )
}

export default Recipes;