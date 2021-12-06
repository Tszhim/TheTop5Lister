import * as React from 'react';
import Button from '@mui/material/Button';
import { useContext } from 'react';
import AuthContext from '../auth'
import { GlobalStoreContext } from '../store'

export default function SplashScreen() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);

    const handleRegister = () => {
        //alert('handleRegister');
        window.location.href='/register/';
    };
    
    const handleLogin = () => {
        //alert('handlelogin');
        window.location.href='/login/';
    };
    
    const handleLoginAsGuest = () => {
        auth.loginAsGuest();
    };

    return (
        <div id="splash-screen">    
           <div id="splash-title-wrapper">
                <div id="splash-title-left">
                     The Top Five Lister
                </div>
                <div id="splash-title-info">
                    Share your favorite things with the world.
               </div>
               <div id="splash-title-right">
                    Developed by Tszhim Chan 
               </div>
           </div>
           <div id="splash-buttons-wrapper">
                <div id="splash-button-left">
                    New user? Sign up with a new account.
                    <div style = {{paddingTop: '15%'}}>
                        <Button id="splash-button" onClick={handleRegister}>
                            Register
                        </Button>
                    </div>
                </div>
                <div id="splash-button-middle">
                    For existing users: Sign in.
                    <div style = {{paddingTop: '12%'}}>
                        <Button id="splash-button" onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </div>
                <div id="splash-button-right">
                    Don't want to sign up yet? Check out the site as a guest.
                    <div style = {{paddingTop: '7%'}}>
                        <Button id="splash-button" onClick={handleLoginAsGuest}>
                            Continue as guest
                        </Button>
                    </div>
                </div>
           </div>
           <div id="splash-description-wrapper">
               <div id="splash-description-box-left">
                    Customize personal lists to your liking
                    <div id="splash-description-text">
                        Publish your own top five lists on any topic of your choosing. Lists can be saved and edited again later.
                    </div>
               </div>
               <div id="splash-description-box-middle">
                    Contribute to aggregated community lists
                    <div id="splash-description-text">
                        Published lists with the same name will be entered into a voting system, where the highest voted entries are displayed as a community list.
                    </div>
               </div>
               <div id="splash-description-box-right">
                    Interact with other users and their lists
                    <div id="splash-description-text">
                        All lists can be viewed publicly. Don't like a list? Leave a dislike and a comment about your opinion. Like a list? Leave a like and view the other lists published by that user.
                    </div>
               </div>
           </div>
        </div>
    )
}