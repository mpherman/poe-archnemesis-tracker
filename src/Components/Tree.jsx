import { Grid, Typography } from '@mui/material';
import React from 'react';
import Monsters from '../Util/Monsters';
import TreeUtils from '../Util/TreeUtils';

function Leaf({ name, img, haveInInventory }) {
    let className = haveInInventory ? 'item-completed' : 'item-missing';
    className += ' tree-item'
    return (
        <Grid container>
            <Grid item xs='auto'>
                <img className='tree-img' src={img} alt={name} />
            </Grid>
            <Grid className={className} item xs='auto'>
                <Typography variant='body1'>
                    {name}
                </Typography>
            </Grid>
        </Grid>
    )
}

function Subtree({tree, inventory, depth}) {
    if (Array.isArray(tree)) return (<React.Fragment></React.Fragment>)
    const monsters = Object.keys(tree);
    let subtrees = monsters.map((monster) => {
        const monsterInfo = Monsters[monster];
        return (
        <React.Fragment>
            <Grid item xs={1}>
                <Leaf name={monster} img={monsterInfo.img} haveInInventory={true} />
            </Grid>
            <Grid item xs={depth-1}>
                    <Subtree tree={tree[monster]} depth={depth-1} />
                </Grid>
        </React.Fragment>
        )
    })
    return (
        <Grid container columns={depth}>
            {subtrees}
        </Grid>
    )
}

function Tree({ tree, inventory }) {
    const treeDepth = TreeUtils.getTreeDepth(tree);
    return (
        <div className="tooltip-tree">
            <Subtree tree={tree} inventory={inventory} depth={treeDepth} />
        </div>
    );
}

export default Tree;