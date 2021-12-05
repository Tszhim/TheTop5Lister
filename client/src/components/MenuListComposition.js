import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';

import { useContext, useState } from 'react';
import { GlobalStoreContext } from '../store'
import { gridClasses } from '@mui/material';

export default function MenuListComposition() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { store } = useContext(GlobalStoreContext);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortNewest = (event) => {
    //store.setSortNewest();
    
    let sortedOption = {publishedDate: -1};
    if(store.mode == 0) {
        store.loadHomeLists(store.filteredString, sortedOption);        
    }
    else if(store.mode == 1) {
        store.loadAllLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 2) {
        store.loadUserLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 3) {
        store.loadCommLists(store.filteredString, sortedOption);
    }
    else {
        console.log("store mode issue");
    }

    let item = document.getElementById("sortName");
    item.innerText = 'Newest';

    handleClose();
  }

  const handleSortOldest = (event) => {
    //store.setSortOldest();

    let sortedOption = {publishedDate: 1};
    if(store.mode == 0) {
        store.loadHomeLists(store.filteredString, sortedOption);        
    }
    else if(store.mode == 1) {
        store.loadAllLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 2) {
        store.loadUserLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 3) {
        store.loadCommLists(store.filteredString, sortedOption);
    }
    else {
        console.log("store mode issue");
    }

    let item = document.getElementById("sortName");
    item.innerText = 'Oldest';

    handleClose();
  }

  const handleSortViews = (event) => {
    //store.setSortViews();

    let sortedOption = {viewCount: -1};
    if(store.mode == 0) {
        store.loadHomeLists(store.filteredString, sortedOption);        
    }
    else if(store.mode == 1) {
        store.loadAllLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 2) {
        store.loadUserLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 3) {
        store.loadCommLists(store.filteredString, sortedOption);
    }
    else {
        console.log("store mode issue");
    }

    let item = document.getElementById("sortName");
    item.innerText = 'Views';

    handleClose();
  }

  const handleSortLikes = (event) => {
    //store.setSortLikes();

    let sortedOption = {likeCount: -1};
    if(store.mode == 0) {
        store.loadHomeLists(store.filteredString, sortedOption);        
    }
    else if(store.mode == 1) {
        store.loadAllLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 2) {
        store.loadUserLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 3) {
        store.loadCommLists(store.filteredString, sortedOption);
    }
    else {
        console.log("store mode issue");
    }

    let item = document.getElementById("sortName");
    item.innerText = 'Likes';

    handleClose();
  }

  const handleSortDislikes = (event) => {
    //store.setSortDislikes();

    let sortedOption = {dislikeCount: -1};
    if(store.mode == 0) {
        store.loadHomeLists(store.filteredString, sortedOption);        
    }
    else if(store.mode == 1) {
        store.loadAllLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 2) {
        store.loadUserLists(store.filteredString, sortedOption);
    }
    else if(store.mode == 3) {
        store.loadCommLists(store.filteredString, sortedOption);
    }
    else {
        console.log("store mode issue");
    }

    let item = document.getElementById("sortName");
    item.innerText = 'Dislikes';

    handleClose();
  }


  return (
    <div style={{display: 'grid', gridTemplateColumns: '2fr 0.5fr 1fr'}}>
      <Typography variant="h6">SORT BY</Typography> 
      <Button
        id="fade-button"
        aria-controls="fade-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        color="inherit"
      >
        <FilterListIcon/>
      </Button>  
      <Typography id="sortName" variant="h6">Newest</Typography>   
      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={handleSortNewest}>Newest</MenuItem>
        <MenuItem onClick={handleSortOldest}>Oldest</MenuItem>
        <MenuItem onClick={handleSortViews}>Views</MenuItem>
        <MenuItem onClick={handleSortLikes}>Likes</MenuItem>
        <MenuItem onClick={handleSortDislikes}>Dislikes</MenuItem>
      </Menu>    
    </div>
  );
}
