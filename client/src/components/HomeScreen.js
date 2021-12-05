import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import MUIDeleteModal from './MUIDeleteModal'

import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab'
import List from '@mui/material/List';
import Typography from '@mui/material/Typography'

import ToolBar from './ToolBar'

import AuthContext from '../auth'
import Statusbar from './Statusbar.js'


/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);
    const { auth } = useContext(AuthContext);

    useEffect(() => {   
        if (auth.loggedIn)
            store.loadHomeLists(store.filteredString, store.sortedOption); 
        else if (auth.loggedInAsGuest)
            store.loadCommLists(store.filteredString, store.sortedOption); 
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    let listCard = "";
    if (store) {
        listCard = 
            <List sx={{ width: '95%', left: '3%', backgroundColor: 'rgb(98, 165, 178)', marginTop: '1%'}}>
            {
                store.idNamePairs.map((pair) => (
                    <div style = {{backgroundColor: '#c1d4e6', borderRadius: '20px', marginBottom: '10px'}}>
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    </div>
                ))
            }
            </List>;
    }

    let addListBar = "";
    if(store.mode === 0) {
        addListBar = 
        <div id="list-selector-list2">
                <Fab 
                    color="primary" 
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                    style={{background:'#4192a1'}}
                    size='small'

                >
                    <AddIcon />
                </Fab>
                <Typography variant="h4" color='#9ac9d9'>Your Lists</Typography>
            </div>;
    } else {
        addListBar = <Statusbar />;
    }

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <ToolBar />
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
                <MUIDeleteModal />
            </div>
            {
                addListBar
            }
            
        </div>)
}

export default HomeScreen;