import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    let text ="";
    if (store.mode === 1 || store.mode === 2) {
        text = store.filteredString + ' Lists';
    }
    else if (store.mode === 3) {
        text = 'Community Lists';
    }
    console.log('Status bar');
    return (
        <div id="list-selector-list2">
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;