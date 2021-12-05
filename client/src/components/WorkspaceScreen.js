import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';    
import AddIcon from '@mui/icons-material/Add';

import ToolBar from './ToolBar'

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    
    function handleSave(event) {
        //alert('Save');
        let item = document.getElementById("name");
        //alert(item.value);
        store.currentList.name = item.value;

        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);
            store.currentList.items[i-1] = item.value;
            //alert(item.value);
        }    
        
        store.updateCurrentList();
        store.closeCurrentList();
    }

    function handlePublish(event) {
        //alert('Publish');
        
        let item = document.getElementById("name");
        store.currentList.name = item.value;

        for (let i = 1; i <= 5; i++) {
            let item = document.getElementById("item-" + i);
            store.currentList.items[i-1] = item.value;
        }
        
        //if(store.currentList.name == '' || 
        //   store.currentList.items[1] == '' ||
        //   store.currentList.items[2] == '' ||
        //   store.currentList.items[3] == '' ||
        //   store.currentList.items[4] == '' ||
        //   store.currentList.items[5] == '') {
        //       alert('Please fill all fields when publishing the list.');
        //   }
        //else {
            //store.currentList.published = true;
            //store.currentList.publishedDate = new Date();
            
            // >> modified 120221
            store.publishCurrentList();
            //store.closeCurrentList();
            // << modified 120221
        //}
    }

    // >> modified 120421
    function handleUpdateText(event) {
        //alert('handleUpdateText');
        let item = document.getElementById("name");
        let listname = item.value;
        
        let listItems = []

        item = document.getElementById("item-1");
        listItems[0] = item.value;

        item = document.getElementById("item-2");
        listItems[1] = item.value;

        item = document.getElementById("item-3");
        listItems[2] = item.value;

        item = document.getElementById("item-4");
        listItems[3] = item.value;

        item = document.getElementById("item-5");
        listItems[4] = item.value;  
        

        store.setItemPublishActive(listname, listItems);
    }
    // << modified 120421

    console.log('WorkspaceScreen store.itemPublishActive: ' + store.itemPublishActive);

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ bgcolor: 'background.paper', paddingTop: '2%' }}>                
                <div style={{width: '90%', marginLeft: '5%', backgroundColor: 'white', border: '2px solid white', borderRadius: '30px'}}>
                    <TextField
                        margin="normal"                            
                        required
                        sx={{width: '40%', marginLeft: '3%'}}
                        size="small"
                        id={"name"}
                        label={"name"}
                        name="name"
                        autoComplete="Top 5 List Item"
                        className='name'                           
                        defaultValue={store.currentList.name}
                        inputProps={{style: {fontSize: 20}}}
                        InputLabelProps={{style: {fontSize: 18}}}
                        autoFocus
                        onChange={handleUpdateText}
                    /> 
                    <div style={{width: '90%', marginLeft: '3%'}}>
                        {
                            store.currentList.items.map((item, index) => (                       
                                <TextField
                                    margin="normal"                            
                                    required
                                    fullWidth
                                    sx={{backgroundColor: "white"}}
                                    size="small"
                                    id={"item-" + (index+1)}
                                    label={"Item #" + (index+1)}
                                    name="item"
                                    autoComplete="Top 5 List Item"
                                    className='top5-item'                           
                                    defaultValue={item}
                                    inputProps={{style: {fontSize: 22}}}
                                    InputLabelProps={{style: {fontSize: 20}}}
                                    autoFocus
                                    onChange={handleUpdateText}
                                />                             
                            ))                        
                        }
                    </div>
                    <div style={{marginLeft: '80%'}}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2, marginRight: '5%'}}
                            onClick={handleSave}
                        >
                            Save
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handlePublish}
                            disabled={!store.itemPublishActive}
                        >
                            Publish
                        </Button>
                    </div>
                </div>
            </List>;
    }
    return (
        <div id="top5-workspace">
            <ToolBar />
            <div id="workspace-edit">
                {editItems}
            </div>
            <div id="list-selector-list2" style={{top: '95%'}}>
                <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    disabled={true}
                    style={{background:'#4192a1'}}
                    size='small'

                >
                    <AddIcon />
                </Fab>
                <Typography variant="h4" color='#9ac9d9'>Your Lists</Typography>
            </div>
        </div>
    )
}

export default WorkspaceScreen;