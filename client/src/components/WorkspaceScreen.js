import { useContext } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
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
        //store.currentList.published = true;
        //store.currentList.publishedDate = new Date();
        store.publishCurrentList();
        store.closeCurrentList();
    }

    const { store } = useContext(GlobalStoreContext);

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>                
                <TextField
                    margin="normal"                            
                    required
                    fullWidth
                    id={"name"}
                    label={"name"}
                    name="name"
                    autoComplete="Top 5 List Item"
                    className='name'                           
                    defaultValue={store.currentList.name}
                    inputProps={{style: {fontSize: 24}}}
                    InputLabelProps={{style: {fontSize: 24}}}
                    autoFocus
                /> 
                {
                    store.currentList.items.map((item, index) => (                       
                        <TextField
                            margin="normal"                            
                            required
                            fullWidth
                            id={"item-" + (index+1)}
                            label={"Item #" + (index+1)}
                            name="item"
                            autoComplete="Top 5 List Item"
                            className='top5-item'                           
                            defaultValue={item}
                            inputProps={{style: {fontSize: 24}}}
                            InputLabelProps={{style: {fontSize: 24}}}
                            autoFocus
                        />                             
                    ))                        
                }
                <div>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleSave}
                        >
                            Save
                        </Button>

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handlePublish}
                        >
                            Publish
                        </Button>
                </div>
            </List>;
    }
    return (
        <div id="top5-workspace">
            <div id="workspace-edit">
                <div id="edit-numbering">
                    <div className="item-number"><Typography variant="h3">Name</Typography></div>
                    <div className="item-number"><Typography variant="h3">1.</Typography></div>
                    <div className="item-number"><Typography variant="h3">2.</Typography></div>
                    <div className="item-number"><Typography variant="h3">3.</Typography></div>
                    <div className="item-number"><Typography variant="h3">4.</Typography></div>
                    <div className="item-number"><Typography variant="h3">5.</Typography></div>
                </div>
                {editItems}
            </div>
        </div>
    )
}

export default WorkspaceScreen;