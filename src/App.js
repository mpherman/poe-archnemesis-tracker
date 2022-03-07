import { React, useState, useEffect } from 'react';
import './App.css';
import { Backdrop, Grid, Button, Typography, Dialog, DialogContent, DialogTitle, DialogContentText, IconButton, OutlinedInput, InputAdornment, Tooltip } from "@mui/material";
import { Copy, Download, CheckSquare } from 'react-feather';
import Inventory from './Components/Inventory';
import Combos from './Components/Combos';
import Recipes from './Components/Recipes';
import Tree from './Components/Tree';
import BlankInventory from './Data/MonsterInventory.json';
import TreeUtils from './Util/TreeUtils';
import StorageUtils from './Data/StorageUtils';
import MissingPieces from './Components/Missing';

function App() {
    // Load inventory from localStorage
    let loadedInventory =  StorageUtils.load('inventory', BlankInventory);
    const [inventory, setInventory] = useState(loadedInventory);
    // Load activeCombo
    let loadedActiveCombo = StorageUtils.load('activeComboIndex', 0);
    const [activeComboIndex, setActiveComboIndex] = useState(loadedActiveCombo);
    // Load combos from localStorage
    let loadedCombos = StorageUtils.load('combos', [['', '', '', '']]);
    const [combos, setCombos] = useState(loadedCombos);
    function updateInventory(newValues) {
        const newInventory = { ...inventory, ...newValues };
        setInventory(inventory => newInventory);
        StorageUtils.save('inventory', newInventory);
    }
    function updateActiveCombo(combo) {
        const newCombos = [...combos];
        newCombos[activeComboIndex] = combo;
        setCombos(x => newCombos);
        StorageUtils.save('combos', newCombos);
    }
    function addBlankCombo() {
        const newCombos = [...combos];
        newCombos[newCombos.length] = ['', '', '', ''];
        setCombos(x => newCombos);
        StorageUtils.save('combos', newCombos);
    }
    function switchActiveCombo(index) {
        if (index === -1) {
            // Add new combo
            index = combos.length;
            setActiveComboIndex(index);
            addBlankCombo()
        }
        else {
            setActiveComboIndex(index);
        }
        StorageUtils.save('activeComboIndex', index);
    }
    function removeActiveCombo() {
        let newIndex = Math.max(activeComboIndex-1, 0);
        let newCombos = [...combos];
        newCombos.splice(activeComboIndex, 1);
        setCombos(x => newCombos);
        setActiveComboIndex(newIndex);
        StorageUtils.save('activeComboIndex', newIndex);
        StorageUtils.save('combos', newCombos);
    }
    function completeActiveCombo() {
        let activeCombo = combos[activeComboIndex];
        let newValues = {};
        for (let i = 0; i < activeCombo.length; i++) {
            const monster = activeCombo[i];
            if (monster) {
                newValues[monster] = inventory[monster] - 1;
            }
        }
        updateInventory(newValues);
    }

    useEffect(() => {
        updateRecipes();
        updateMissing();
        updateRequired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeComboIndex, combos, inventory]);

    // Get recipes
    const [recipes, setRecipes] = useState({});
    function updateRecipes() {
        let inventoryCopy = TreeUtils.copy(inventory);
        let newRecipes = {};
        let activeCombo = combos[activeComboIndex];
        if (!activeCombo) return;
        for (let i = 0; i < activeCombo.length; i++) {
            if (!activeCombo[i]) continue;
            const monster = activeCombo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            let monsterRecipes = {}
            TreeUtils.getActiveRecipes(tree, inventoryCopy, monsterRecipes);
            newRecipes[monster] = monsterRecipes;
        }
        setRecipes((oldRecipes) => newRecipes);
    }
    function completeRecipe(monster) {
        const recipe = TreeUtils.getRecipe(monster);
        let newInventoryValues = {};
        for (let i = 0; i < recipe.length; i++) {
            newInventoryValues[recipe[i]] = inventory[recipe[i]] - 1;
        }
        newInventoryValues[monster] = inventory[monster] + 1;
        updateInventory(newInventoryValues);
    }

    // Determine required components
    const [required, setRequired] = useState({});
    function updateRequired() {
        let requiredComponents = {};
        let activeCombo = combos[activeComboIndex];
        if (!activeCombo) return;
        for (let i = 0; i < activeCombo.length; i++) {
            if (!activeCombo[i]) continue;
            const monster = activeCombo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            TreeUtils.getRequiredComponents(tree, requiredComponents);
        }
        setRequired((oldRequired) => requiredComponents);
    }

    // Determine missing pieces
    const [missing, setMissing] = useState({});
    function updateMissing() {
        let remainingComponents = {};
        let inventoryCopy = TreeUtils.copy(inventory);
        let activeCombo = combos[activeComboIndex];
        if (!activeCombo) return;
        for (let i = 0; i < activeCombo.length; i++) {
            if (!activeCombo[i]) continue;
            const monster = activeCombo[i];
            const tree = TreeUtils.createMonsterTree(monster);
            TreeUtils.getRemainingComponents(tree, inventoryCopy, remainingComponents);
        }
        setMissing((oldMissing) => remainingComponents);
    }
    function collectMonster(name) {
        const newValue = {};
        newValue[name] = inventory[name] + 1;
        updateInventory(newValue);
    }
    // Tooltip
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipTree, setTooltipTree] = useState({});
    const closeTooltip = () => {
        setTooltipOpen(false);
    }
    const openTooltip = (monster) => {
        setTooltipOpen(true);
        setTooltipTree(oldTree => TreeUtils.createMonsterTree(monster));
    }

    // Import/export popup
    const [importOpen, setImportOpen] = useState(false);
    const [exportOpen, setExportOpen] = useState(false);
    const [exportCode, setExportCode] = useState("");
    const [exportCopied, setExportCopied] = useState(false);
    const [importError, setImportError] = useState(false);
    let importCode = "";
    const handleImportClick = (event) => {
        setImportOpen(true);
        setImportError(false);
        importCode = "";
    }   
    const handleExportClick = (event) => {
        setExportOpen(true);
        setExportCode(TreeUtils.getExportCode(inventory));
        setExportCopied(false);
        console.log(exportCode, TreeUtils.getExportCode(inventory))
    }
    const handleImportClose = () => {
        setImportOpen(false);
    }
    const handleExportClose = () => {
        setExportOpen(false);
    }
    const handleImport = (event) => {
        console.log(importCode);
        setImportError(true);
    }
    const updateImportCode = (event) => {
        importCode = event.target.value;
    }
    const handleExport = (event) => {
        navigator.clipboard.writeText(exportCode).then(() => {
            setExportCopied(true);
        });
    }
    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Archnemesis Tracker
                </h1>
                <div className="io-panel">
                    <Typography variant='body1'>
                        <Button className='io-button' variant="contained" onClick={handleImportClick}>
                            Import
                        </Button>
                        <Button className='io-button' variant="contained" onClick={handleExportClick}>
                            Export
                        </Button>
                    </Typography>
                </div>
            </header>
            <div className="App-body">
                <Grid container spacing={0}>
                    <Grid item xs={12}>
                        <Combos 
                            combos={combos} 
                            activeComboIndex={activeComboIndex} 
                            inventory={inventory} 
                            openTooltip={openTooltip} 
                            updateActiveCombo={updateActiveCombo} 
                            switchActiveCombo={switchActiveCombo}
                            removeActiveCombo={removeActiveCombo}
                            completeActiveCombo = {completeActiveCombo} />  
                    </Grid>
                    <Grid item xs={12}>
                        <Recipes recipes={recipes} update={completeRecipe}/>  
                    </Grid>
                    <Grid item xs={12}>
                        <MissingPieces missing={missing} collectMonster={collectMonster}/>  
                    </Grid>
                    <Grid item xs={12}>
                        <Inventory inventory={inventory} updateInventory={updateInventory} required={required}/>  
                    </Grid>
                </Grid>
                <Backdrop open={tooltipOpen} onClick={closeTooltip}>
                    <Tree tree={tooltipTree} inventory={inventory}/>
                </Backdrop>
                <Dialog open={importOpen} onClose={handleImportClose}>
                    <DialogTitle>Import</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To import your archnemesis inventory, paste in the code below:
                        </DialogContentText>
                        <br/>                
                        <OutlinedInput
                            autoFocus
                            margin="dense"
                            id="import-code"
                            type="text"
                            fullWidth
                            onChange={updateImportCode} 
                            className={importError ? 'io-failure' : 'io-neutral'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title="Import">
                                        <IconButton
                                            aria-label="import code"
                                            onClick={handleImport}
                                            edge="end"
                                        >
                                            <Download />
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                                }
                        />
                        { importError && <Typography variant='title' className='text-failure'>
                        <br/>Error Importing Code</Typography>}
                    </DialogContent>
                </Dialog>
                <Dialog open={exportOpen} onClose={handleExportClose}>
                    <DialogTitle>Export</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To export your archnemesis inventory, copy the code below:
                        </DialogContentText>
                        <br/>
                        <OutlinedInput
                            autoFocus
                            margin="dense"
                            id="export-code"
                            label="Code"
                            type="text"
                            fullWidth
                            value={exportCode}
                            disabled
                            className={exportCopied ? 'io-success' : 'io-neutral'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Tooltip title={exportCopied ? "Copied!" : "Copy to Clipboard"}>
                                        <IconButton
                                            aria-label="export code"
                                            onClick={handleExport}
                                            edge="end"
                                            className={exportCopied ? "success" : "item-neutral"}
                                        >
                                            {exportCopied ? <CheckSquare /> : <Copy />}
                                        </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                                }
                        />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}

export default App;
