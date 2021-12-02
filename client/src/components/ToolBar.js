import { useContext, useState } from 'react';
import { Link } from 'react-router-dom'
import AuthContext from '../auth';
import { GlobalStoreContext } from '../store'

import EditToolbar from './EditToolbar'
import MenuListComposition from './MenuListComposition'

import AccountCircle from '@mui/icons-material/AccountCircle';
import Home from '@mui/icons-material/Home';
import People from '@mui/icons-material/People';
import Person from '@mui/icons-material/Person';
import ArrowUpward from '@mui/icons-material/ArrowUpward';
import Sort from '@mui/icons-material/Sort';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';


export default function ToolBar() {
    const theme = createTheme({
        palette: {
          primary: {
            main: '#4192a1',
          },
          secondary: {
            main: '#11cb5f',
          },
        },
      });

    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    
    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        auth.logoutUser();
    }
    
    const menuId = 'primary-search-account-menu';
    const loggedOutMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleMenuClose}><Link to='/login/'>Login</Link></MenuItem>
            <MenuItem onClick={handleMenuClose}><Link to='/register/'>Create New Account</Link></MenuItem>
        </Menu>
    );
    const loggedInMenu = 
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>        

    let editToolbar = "";
    let menu = loggedOutMenu;
    if (auth.loggedIn) {
        menu = loggedInMenu;
        if (store.currentList) {
            editToolbar = <EditToolbar />;
        }
    }
    
    function getAccountMenu(loggedIn) {
        let userInitials = auth.getUserInitials();
        console.log("userInitials: " + userInitials);
        if (loggedIn) 
            return <div>{userInitials}</div>;
        else
            return <AccountCircle />;
    }

    function handleLoadHomeList(event) {
        //store.loadHomeLists("");
        //alert(store.filteredString);
        //alert(store.sortedOption);
        if(auth.loggedIn) {
            store.loadHomeLists(store.filteredString, store.sortedOption); 
        }
    }

    function handleLoadAllList(event) {
        //store.loadAllLists("");
        //alert(store.filteredString);
        //alert(store.sortedOption);
        store.loadAllLists(store.filteredString, store.sortedOption); 
    }

    function handleLoadUserList(event) {
        //store.loadUserLists("");
        store.loadUserLists(store.filteredString, store.sortedOption);
    }

    function handleLoadCommList(event) {
        //store.loadCommLists("");
        store.loadCommLists(store.filteredString, store.sortedOption);
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let text = event.target.value;
            //alert(store.mode);
            //alert(text);
            //alert(store.sortedOption);
            if(store.mode == 0) {
                store.loadHomeLists(text, store.sortedOption);        
            }
            else if(store.mode == 1) {
                store.loadAllLists(text, store.sortedOption);
            }
            else if(store.mode == 2) {
                store.loadUserLists(text, store.sortedOption);
            }
            else if(store.mode == 3) {
                store.loadCommLists(text, store.sortedOption);
            }
            else {
                console.log("store mode issue");
            }
        }
    }

    return (
        <Box sx={{ flexGrow: 1}}> 
            <AppBar position="static" style={{background:'#3c80a4' }}>
                <ThemeProvider theme={theme}>
                    <Toolbar>
                        <div style= {{width: '25%'}}>
                            <Button 
                                id='undo-button'
                                onClick={handleLoadHomeList}
                                variant="contained"
                                disabled={store.isItemEditActive}>
                                <Home />
                            </Button>
                            <Button 
                                id='undo-button'
                                onClick={handleLoadAllList}
                                variant="contained"
                                disabled={store.isItemEditActive}>
                                <People />
                            </Button>
                            <Button 
                                id='undo-button'
                                onClick={handleLoadUserList}
                                variant="contained"
                                disabled={store.isItemEditActive}>
                                <Person />
                            </Button>
                            <Button
                                id='undo-button'
                                onClick={handleLoadCommList}
                                variant="contained"
                                disabled={store.isItemEditActive}>
                                <ArrowUpward />
                            </Button> 
                        </div>
                        <div style={{paddingLeft: '10px', width: '40%'}}>
                            <TextField fullWidth id="outlined-basic" size='small' color= 'primary' inputProps={{style: {color: 'white'}}} InputLabelProps={{style: {color: 'white'}}}label="Search" variant="outlined" onKeyPress={handleKeyPress}/>     
                        </div>
                        <div style={{paddingLeft: '230px'}}>
                            <MenuListComposition></MenuListComposition>
                        </div>
                    </Toolbar>
                </ThemeProvider>
            </AppBar>
            {
                menu
            }
        </Box>
    );
}