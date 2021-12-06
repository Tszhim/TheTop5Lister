import { createContext, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import api from './store-request-api'
import AuthContext from '../auth'
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author Tszhim Chan
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETION",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    FINALIZE_CURRENT_LIST: "FINALIZE_CURRENT_LIST",
    SET_ITEM_EDIT_ACTIVE: "SET_ITEM_EDIT_ACTIVE",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    LOAD_HOME_LISTS: "LOAD_HOME_LISTS",
    LOAD_ALL_LISTS: "LOAD_ALL_LISTS",
    LOAD_USER_LISTS: "LOAD_USER_LISTS",
    LOAD_COMM_LISTS: "LOAD_COMM_LISTS",
    SET_SORT_NEWEST: "SET_SORT_NEWEST",
    SET_SORT_OLDEST: "SET_SORT_OLDEST",
    SET_SORT_VIEWS: "SET_SORT_VIEWS",
    SET_SORT_LIKES: "SET_SORT_LIKES",
    SET_SORT_DISLIKES: "SET_SORT_DISLIKES",
    PROCESS_ERR: "PROCESS_ERR",
    CLEAR_ERR: "CLEAR_ERR",
    FILTER_LISTS: "FILTER_LISTS",
    SORT_LISTS: "SORT_LISTS",
    EDIT_LIST: "EDIT_LIST",
    LIKE_LIST: "LIKE_LIST",
    DISLIKE_LIST: "DISLIKE_LIST",
    EXPAND_LIST: "EXPAND_LIST",
    COLLAPSE_LIST: "COLLAPSE_LIST",
    SAVE_CURRENT_LIST: "SAVE_CURRENT_LIST",
    PUBLISH_CURRENT_LIST: "PUBLISH_CURRENT_LIST",
    ADD_COMMENT: "ADD_COMMENT",
    LOGOUT_CLEAR: "LOGOUT_CLEAR"
}

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameEditActive: false,
        itemEditActive: false,
        listMarkedForDeletion: null,
        mode: 0,  // 0 - Home, 1 - All, 2 - User, 3 - Community
        filteredString: "",
        sortedOption: {publishedDate: -1}, // 0 - Publish Date (Newest), 1 - Publish Date (Oldest), 2 - Views, 3 - Likes, 4 Dislikes
        idCommentListPairs: [],
        idLikePairs: [],
        processError: null,
        itemPublishActive: false,
        PublishListNameExist: false
    });

    const history = useHistory();

    // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
    const { auth } = useContext(AuthContext);
    console.log("auth: " + auth);

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.top5List,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false                 
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: payload.mode,
                    sortedOption: payload.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: payload,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: payload.itemPublishActive,
                    PublishListNameExist: payload.PublishListNameExist
                });
            }
            // FOR PUBLISHING
            case GlobalStoreActionType.FINALIZE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: store.itemPublishActive,
                    PublishListNameExist: store.PublishListNameExist
                });
            }
            // START EDITING A LIST ITEM
            case GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // LOAD HOME LISTS (MODE 0)
            case GlobalStoreActionType.LOAD_HOME_LISTS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: payload.mode,
                    sortedOption: payload.sortedOption,
                    filteredString: payload.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // LOAD ALL LISTS (MODE 1)
            case GlobalStoreActionType.LOAD_ALL_LISTS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: payload.mode,
                    sortedOption: payload.sortedOption,
                    filteredString: payload.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // LOAD USER LISTS (MODE 2)
            case GlobalStoreActionType.LOAD_USER_LISTS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: payload.mode,
                    sortedOption: payload.sortedOption,
                    filteredString: payload.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // LOAD COMMUNITY LISTS (MODE 3)
            case GlobalStoreActionType.LOAD_COMM_LISTS: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: payload.mode,
                    sortedOption: payload.sortedOption,
                    filteredString: payload.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // LIKING A LIST
            case GlobalStoreActionType.LIKE_LIST: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // ADDING A COMMENT TO A LIST
            case GlobalStoreActionType.ADD_COMMENT: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // CLEARING STATE ON LOGOUT
            case GlobalStoreActionType.LOGOUT_CLEAR: {
                return setStore({
                    idNamePairs: null,
                    currentList: null,
                    newListCounter: null,
                    isListNameEditActive: false,
                    isItemEditActive: false,
                    listMarkedForDeletion: null,
                    mode: 0,
                    sortedOption: null,
                    filteredString: null,
                    processError : null,
                    itemPublishActive: false,
                    PublishListNameExist: false
                });
            }
            // ERROR WITH PUBLISHING
            case GlobalStoreActionType.PROCESS_ERR: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : payload.processError,
                    itemPublishActive: store.itemPublishActive,
                    PublishListNameExist: store.PublishListNameExist
                });
            }
            // CLEARRING ERROR WITH PUBLISHING
            case GlobalStoreActionType.CLEAR_ERR: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    isListNameEditActive: true,
                    isItemEditActive: true,
                    listMarkedForDeletion: null,
                    mode: store.mode,
                    sortedOption: store.sortedOption,
                    filteredString: store.filteredString,
                    processError : null,
                    itemPublishActive: store.itemPublishActive,
                    PublishListNameExist: store.PublishListNameExist
                });
            }
            // SORT LISTS BY NEWEST
            case GlobalStoreActionType.SET_SORT_NEWEST: {
                return setStore({
                    sortedOption: {publishedDate: -1}
                });
            }
            // SORT LISTS BY OLDEST
            case GlobalStoreActionType.SET_SORT_OLDEST: {
                return setStore({
                    sortedOption: {publishedDate: 1}
                });
            }
            // SORT LISTS BY VIEWS
            case GlobalStoreActionType.SET_SORT_VIEWS: {
                return setStore({
                    sortedOption: {views: -1}
                });
            }
            // SORT LISTS BY LIKES
            case GlobalStoreActionType.SET_SORT_LIKES: {
                return setStore({
                    sortedOption: {likes: -1}
                });
            }
            // SORT LISTS BY DISLIKES
            case GlobalStoreActionType.SET_SORT_DISLIKES: {
                return setStore({
                    sortedOption: {dislikes: -1}
                });
            }

            default:
                return store;
        }
    }

    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = async function (id, newName) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            top5List.name = newName;
            async function updateList(top5List) {
                response = await api.updateTop5ListById(top5List._id, top5List);
                if (response.status === 200) {
                    async function getListPairs(top5List) {
                        response = await api.getTop5ListPairs();
                        if (response.status === 200) {
                            let pairsArray = response.data.idNamePairs;
                            storeReducer({
                                type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                payload: {
                                    idNamePairs: pairsArray,
                                    top5List: top5List
                                }
                            });
                        }
                    }
                    getListPairs(top5List);
                }
            }
            updateList(top5List);
        }
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
        store.loadHomeLists(store.filteredString, store.sortedOption);
    }

    // THIS FUNCTION CREATES A NEW LIST
    store.createNewList = async function () {
        console.log('store.createNewList: ' + auth.user.email + '*' + auth.user.userName);
        let newListName = "Untitled" + store.newListCounter;
        const response = await api.createTop5List(newListName, 
                                                ["", "", "", "", ""], 
                                                auth.user.email, 
                                                auth.user.userName,
                                                false,
                                                0,
                                                0,
                                                false,
                                                0);
        if (response.status === 201) {
            let newList = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.CREATE_NEW_LIST,
                payload: newList
            }
            );

            // IF IT'S A VALID LIST THEN LET'S START EDITING IT
            history.push("/top5list/" + newList._id);
        }
        else {
            console.log("API FAILED TO CREATE A NEW LIST");
        }
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = async function () {
        console.log("store.loadIdNamePairs" + '*' + store.mode + '*' + store.sortedOption);
        
        let mode = store.mode;
        if (mode === undefined) {
            mode = 0;
        }
        let sortedOption = store.sortedOption;
        if (sortedOption === undefined) {
            sortedOption = 0;
        }

        const response = await api.getTop5ListPairs();
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                payload: {idNamePairs: pairsArray,
                          mode: mode,
                          sortedOption: sortedOption
                }
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
    // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
    // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
    // showDeleteListModal, and hideDeleteListModal
    store.markListForDeletion = async function (id) {
        // GET THE LIST
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            storeReducer({
                type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
                payload: top5List
            });
        }
    }
    
    // THIS FUNCTION BEGINS THE PROCESS OF DELETING A LIST
    store.deleteList = async function (listToDelete) {
        let response = await api.deleteTop5ListById(listToDelete._id);
        if (response.status === 200) {
            console.log('store.deleteList ' + store.mode)
            store.loadHomeLists(store.filteredString, store.sortedOption);
        }
    }

    // THIS FUNCTION DELETES A MARKED LIST
    store.deleteMarkedList = function () {
        store.deleteList(store.listMarkedForDeletion);
    }

    // THIS FUNCTION UNMARKS A LIST FOR DELETION
    store.unmarkListForDeletion = function () {
        storeReducer({
            type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
            payload: null
        });
    }

    // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
    // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
    // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
    // moveItem, updateItem, updateCurrentList, undo, and redo
    store.setCurrentList = async function (id) {
        let response = await api.getTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;

            let isItemPublishActive = false;
            if (top5List.name != '' &&
                top5List.items[0] != '' && 
                top5List.items[1] != '' &&
                top5List.items[2] != '' &&
                top5List.items[3] != '' &&
                top5List.items[4] != '')
                isItemPublishActive = true;

            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {
                    currentList: top5List,
                    itemPublishActive: isItemPublishActive,
                    PublishListNameExist: store.PublishListNameExist
                }
            });
            history.push("/top5list/" + top5List._id);
        }
    }

    // THIS FUNCTION CHECKS IF THE ITEMS ARE VALID FOR PUBLISH
    store.setItemPublishActive = async function (name, items) {
        let isItemPublishActive = false;
        console.log('store.setItemPublishActive: ' + name + '*' + items);
        if (name != '' &&  items[0] != '' && items[1] != '' && items[2] != '' && items[3] != '' && items[4] != '')
        {
            let listInsensitive = [];
            listInsensitive[0] = (items[0] + "").toUpperCase();
            listInsensitive[1] = (items[1] + "").toUpperCase();
            listInsensitive[2] = (items[2] + "").toUpperCase();
            listInsensitive[3] = (items[3] + "").toUpperCase();
            listInsensitive[4] = (items[4] + "").toUpperCase();

            let listWithoutDups = new Set(listInsensitive);
            if (listWithoutDups.size == items.length) {
                isItemPublishActive = true;
            }    
        }

        storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: {
                currentList: store.currentList,
                itemPublishActive: isItemPublishActive,
                PublishListNameExist: store.PublishListNameExist
            }
        });       
    }

    // THIS FUNCTION UPDATES THE CURRENT LIST'S NAME AND ITEMS
    store.updateCurrentList = async function () {
        const response = await api.updateTop5ListById(store.currentList._id, store.currentList);
        if (response.status === 200) {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: store.currentList
            });
        }
    }

    // THIS FUNCTION PUBLISHES THE CURRENT LIST
    store.publishCurrentList = async function () {

        try {
            const response = await api.publishTop5ListById(store.currentList._id, store.currentList);
            if (response.status === 200) {
                storeReducer({
                    type: GlobalStoreActionType.FINALIZE_CURRENT_LIST,
                    payload: store.currentList
                });
            }

            store.closeCurrentList();
        }
        catch(error) {
            storeReducer({
                type: GlobalStoreActionType.PROCESS_ERR,
                payload: {
                    processError: error.response.data.errorMessage
                }
            })
        }

    }

    // THIS FUNCTION CLEARS THE ERR TO CLOSE MODAL
    store.clearError = async function() {
        storeReducer({
            type: GlobalStoreActionType.CLEAR_ERR
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING AN ITEM
    store.setIsItemEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_ITEM_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS FUNCTION PROCESSES LOAD HOME LIST
    store.loadHomeLists = async function (filteredString, sortedOption) {
        if (filteredString === undefined) {
            filteredString = '';        
        }

        const response = await api.getTop5ListPairs(auth.user.email, false, filteredString, sortedOption, undefined);
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_HOME_LISTS,
                payload: {
                    idNamePairs: pairsArray,
                    mode: 0,
                    sortedOption: sortedOption,
                    filteredString: filteredString 
                }          
            });
            history.push('/');
        }
        else { 
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THIS FUNCTION PROCESSES LOAD ALL LIST
    store.loadAllLists = async function (filteredString, sortedOption) {
        if (filteredString === undefined) {
            filteredString = '';        
        }

        const response = await api.getTop5ListPairsAll("", false, filteredString, sortedOption, true);
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_ALL_LISTS,
                payload: {
                    idNamePairs: pairsArray,
                    mode: 1,
                    sortedOption: sortedOption,
                    filteredString: filteredString 
                }          
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THIS FUNCTION PROCESSES LOAD USER LIST
    store.loadUserLists = async function (filteredString, sortedOption) {
        if (filteredString === undefined) {
            filteredString = '';        
        }

        const response = await api.getTop5ListPairsUser("", false, filteredString, sortedOption, true);
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_USER_LISTS,
                payload: {
                    idNamePairs: pairsArray,
                    mode: 2,
                    sortedOption: sortedOption,
                    filteredString: filteredString 
                }          
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }

    // THIS FUNCTION PROCESSES LOAD COMMUNITY LIST
    store.loadCommLists = async function (filteredString, sortedOption) {
        if (filteredString === undefined) {
            filteredString = '';        
        }
        
        const response = await api.getTop5ListPairsComm("", true, filteredString, sortedOption, true);
        if (response.status === 200) {
            let pairsArray = response.data.idNamePairs;
            storeReducer({
                type: GlobalStoreActionType.LOAD_COMM_LISTS,
                payload: {
                    idNamePairs: pairsArray,
                    mode: 3,
                    sortedOption: sortedOption,
                    filteredString: filteredString 
                }          
            });
        }
        else {
            console.log("API FAILED TO GET THE LIST PAIRS");
        }
    }
    
    // THIS FUNCTION PROCESSES LIKING A LIST
    store.LikeTop5ListById = async function (id) {
        let response = await api.LikeTop5ListById(id);

        if (response.status === 200) {
            let top5List = response.data.top5List;
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LIKE_LIST,
                payload: {
                    idNamePairs: store.idNamePairs
                }  
            });
        }
    }

    // THIS FUNCTION PROCESSES UNDOING LIKING A LIST
    store.UndoLikeTop5ListById = async function (id) {
        let response = await api.UndoLikeTop5ListById(id);

        if (response.status === 200) {
            let top5List = response.data.top5List;
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LIKE_LIST,
                payload: {
                    idNamePairs: store.idNamePairs
                }  
            });
        }
    }

    // THIS FUNCTION PROCESSES DISLIKING A LIST
    store.DislikeTop5ListById = async function (id) {
        console.log('store.DislikeTop5ListById');
        let response = await api.DislikeTop5ListById(id);
        console.log('store.DislikeTop5ListById ' +response.status);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            
            console.log(store.idNamePairs.length);
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LIKE_LIST,
                payload: {
                    idNamePairs: store.idNamePairs
                }  
            });
        }
    }

    // THIS FUNCTION PROCESSES UNDOING DISLIKING A LIST
    store.UndoDislikeTop5ListById = async function (id) {
        let response = await api.UndoDislikeTop5ListById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }

            storeReducer({
                type: GlobalStoreActionType.LIKE_LIST,
                payload: {
                    idNamePairs: store.idNamePairs
                }  
            });
        }
    }

    // THIS FUNCTION PROCESSES FLIPPING A LIKE TO DISLIKE
    store.flipLikeToDislike = async function (id) {
        await store.UndoLikeTop5ListById(id);
        store.DislikeTop5ListById(id);
    }

    // THIS FUNCTION PROCESSES FLIPPING A DISLIKE TO LIKE
    store.flipDislikeToLike = async function (id) {
        await store.UndoDislikeTop5ListById(id);
        store.LikeTop5ListById(id);
    }

    // THIS FUNCTION PROCESSES ADDING A COMMENT
    store.addTop5ListCommentById = async function (id, commentText) {
        const response = await api.addTop5ListCommentById(id, commentText);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }

            storeReducer({
                type: GlobalStoreActionType.ADD_COMMENT,
                payload: {
                        idNamePairs: store.idNamePairs
                }
            });
        }
    }

    // THIS FUNCTION PROCESSSES ADDING A VIEW
    store.addTop5ListViewById = async function (id) {
        let response = await api.addTop5ListViewById(id);
        if (response.status === 200) {
            let top5List = response.data.top5List;
            for(let i = 0; i < store.idNamePairs.length; i++) {
                console.log(store.idNamePairs[i]._id);    
                if (store.idNamePairs[i]._id == top5List._id) {
                    store.idNamePairs[i].top5List = top5List;    
                }
            }
            storeReducer({
                type: GlobalStoreActionType.LIKE_LIST,
                payload: {
                    idNamePairs: store.idNamePairs
                }  
            });
        }
    }

    // THIS FUNCTION CHECKS IF A LIST NAME ALREADY EXISTS
    store.checkPublishListNameExist = async function (listName) {
        if (listName != '') {
            const response = await api.checkPublishListNameExist(listName, auth.user.email);
            if (response.status === 200) {
                let result = response.data.PublishListNameExist;
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {
                        currentList: store.currentList,
                        itemPublishActive: store.itemPublishActive,
                        PublishListNameExist: result
                    }
                }); 
            }
            else {
                console.log("API FAILED TO CHECK PUBLISH LIST NAME EXIST");
            }
        }
        else
        {
            storeReducer({
                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: {
                    currentList: store.currentList,
                    itemPublishActive: store.itemPublishActive,
                    PublishListNameExist: true
                }
            }); 

        }
    }

    // THIS FUNCTION CLEARS STATE ON LOGOUT
    store.logoutClear = async function () {
        storeReducer({
            type: GlobalStoreActionType.LOGOUT_CLEAR,
            payload: null
        });
    }

    // THIS FUNCTION CHANGES SORT TO NEWEST
    store.setSortNewest = function() {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_NEWEST
        });
        store.refreshAfterSort();
    }

    // THIS FUNCTION CHANGES SORT TO OLDEST
    store.setSortOldest = function() {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_OLDEST
        });
        store.refreshAfterSort();
    }

    // THIS FUNCTION CHANGES SORT TO VIEWS
    store.setSortViews = function() {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_VIEWS
        });
        store.refreshAfterSort();
    }

    // THIS FUNCTION CHANGES SORT TO LIKES
    store.setSortLikes = function() {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_LIKES
        });
        store.refreshAfterSort();
    }

    // THIS FUNCTION CHANGES SORT TO DISLIKES
    store.setSortDislikes = function() {
        storeReducer({
            type: GlobalStoreActionType.SET_SORT_DISLIKES
        });
        store.refreshAfterSort();
    }
    
    // THIS FUNCTION PROCESSES RELOADING LISTS AFTER SORT CHANGE
    store.refreshAfterSort = function() {
        if(store.mode == 0){
            store.loadHomeLists(store.filteredString);
        }
        else if(store.mode == 1){
            store.loadAllLists(store.filteredString);
        }
        else if(store.mode == 2){
            store.loadUserLists(store.filteredString);
        }
        else if(store.mode == 3){
            store.loadCommLists(store.filteredString);
        }
        else{
            console.log("unexpected mode error");
        }
    }

    return (
        <GlobalStoreContext.Provider value={{
            store
        }}>
            {props.children}
        </GlobalStoreContext.Provider>
    );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };