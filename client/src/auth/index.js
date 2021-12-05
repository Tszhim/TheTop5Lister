import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from 'react-router-dom'
import api from './auth-request-api'
import {GlobalStoreContext} from '../store'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    ACC_ERR: "ACC_ERR",
    CLEAR_ERR: "CLEAR_ERR",
    LOGIN_USER_AS_GUEST: "LOGIN_USER_AS_GUEST"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        accError: null,
        loggedInAsGuest: false
    });
    const history = useHistory();
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        auth.getLoggedIn();
    }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    accError: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    accError: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    accError: null,
                    loggedInAsGuest: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    accError: null
                })
            }
            case AuthActionType.ACC_ERR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    accError: payload.accError
                }) 
            }
            case AuthActionType.CLEAR_ERR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    accError: null
                })
            }
            case AuthActionType.LOGIN_USER_AS_GUEST: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    accError: null,
                    loggedInAsGuest: true
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        /*
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
        */
        
        console.log('AUTH auth.getLoggedIn');
        try{
            const response = await api.getLoggedIn();
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user
                    }
                });
            } 
        }
        catch(err){
            console.log(err);
        }
    }

    auth.registerUser = async function(firstName, lastName, email, password, passwordVerify) {
        /*
        const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);      
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/login");
        }*/

        try {
            const response = await api.registerUser(firstName, lastName, email, password, passwordVerify);      
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
                //store.loadIdNamePairs();
            }
        }
        catch(error) {
            authReducer({
                type: AuthActionType.ACC_ERR,
                payload: {
                    accError: error.response.data.errorMessage
                }
            })
        }
    }

    auth.loginUser = async function(email, password) {
        /*
        const response = await api.loginUser(email, password);
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            history.push("/");
        }*/
        
        try {
            const response = await api.loginUser(email, password);
            if(response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        user: response.data.user
                    }
                })
                history.push("/");
            }
        }
        catch(error) {
            authReducer({
                type: AuthActionType.ACC_ERR,   
                payload: {
                    accError: error.response.data.errorMessage
                }
            })
        }
    }

    auth.logoutUser = async function() {
        /*
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer( {
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            history.push("/");
        }*/
  
        try{
            const response = await api.logoutUser();
            if(response.status === 200) {
                authReducer({
                    type: AuthActionType.LOGOUT_USER
                })
                //store.logoutClear();
            }
        }
        catch(err) {
        }
       
    }

    auth.getUserInitials = function() {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        console.log("user initials: " + initials);
        return initials;
    }

    auth.clearError = async function() {
        authReducer({
            type: AuthActionType.CLEAR_ERR
        });
    }

    auth.loginAsGuest = async function() {
        console.log('auth.loginAsGuest');
        authReducer({
            type: AuthActionType.LOGIN_USER_AS_GUEST
        });
        history.push("/");
        
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };