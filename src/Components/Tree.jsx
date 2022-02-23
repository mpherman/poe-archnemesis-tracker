import { Grid, Typography } from '@mui/material';
import React from 'react';
import Monsters from '../Util/Monsters';
import TreeUtils from '../Util/TreeUtils';

const MISSING = 0;
const HAVE = 1;
const HAVE_PARENT = 2;

function Leaf({ name, img, status }) {
    let className;
    switch (status) {
        case MISSING:
            className = 'item-missing';
            break;
        case HAVE:
            className = 'item-completed';
            break;
        default:
        case HAVE_PARENT:
            className = 'item-unsure';
            break;
    }
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

function Subtree({tree, inventory, haveParentInInventory, depth, ignoreStatus}) {
    if (Array.isArray(tree)) return (<React.Fragment></React.Fragment>)
    const monsters = Object.keys(tree);
    let subtrees = monsters.map((monster) => {
        const monsterInfo = Monsters[monster];
        let status;
        if (haveParentInInventory) {
            status = HAVE_PARENT;
        }
        else if (inventory[monster] > 0) {
            // Check for monster in inventory
            status = HAVE;
        } 
        else {
            status = MISSING;
        }
        return (
        <React.Fragment key={monster}>
            <Grid item xs={1}>
                <Leaf name={monster} img={monsterInfo.img} status={status} />
            </Grid>
            <Grid item xs={depth-1}>
                <Subtree tree={tree[monster]} inventory={inventory} haveParentInInventory={!ignoreStatus && (haveParentInInventory || status === HAVE)} depth={depth-1} />
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
            <Subtree tree={tree} inventory={inventory} depth={treeDepth} ignoreStatus />
        </div>
    );
}

export default Tree;