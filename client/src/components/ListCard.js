import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';

import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarBorder from '@mui/icons-material/StarBorder';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';


/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair, selected } = props;

    const [open, setOpen] = useState(false);

    //console.log(idNamePair.top5List.likeList);
    //console.log(idNamePair.top5List.dislikeList);
    //console.log(idNamePair.top5List.likeList.indexOf(auth.user.email));
    /*
    console.log(idNamePair.top5List.dislikeList.indexOf(auth.user.email));
    let likedbool = false;
    if(idNamePair.top5List.likeList.indexOf(auth.user.email) >= 0) {
        likedbool = true;
    }

    let dislikedbool = false;
    if(idNamePair.top5List.dislikeList.indexOf(auth.user.email) >= 0) {
        dislikedbool = true;
    }

    const [liked, setLiked] = useState(likedbool);
    const [disliked, setDisliked] = useState(dislikedbool);
    */
    //console.log('ListCard: ' + liked + '*' + disliked);
    //console.log('ListCard: ' + disliked + '*' + dislikedbool);

    const handleClick = (event, id) => {
        console.log('handleClick: ' + event.target.id);
        if(!open) {
            //alert('store.addTop5ListViewById');
            store.addTop5ListViewById(id);

        }
        setOpen(!open);
    };

    function handleLoadList(event, id) {
        console.log("handleLoadList for " + id);
        //if (!event.target.disabled) {
        //    let _id = event.target.id;
        //    if (_id.indexOf('list-card-text-') >= 0)
        //        _id = ("" + _id).substring("list-card-text-".length);

        //    console.log("load " + event.target.id);

            // CHANGE THE CURRENT LIST
        //    store.setCurrentList(id);
        //}
    }

    function handleToggleEdit(event, id) {
        // >> modified
        //event.stopPropagation();
        //toggleEdit();
        if(auth.loggedIn) {
            if(!idNamePair.top5List.published) {
                store.setCurrentList(id);
            }
        }
        // << modified
    }

    function handleLikeList(event, id) {
        // >> modified
        //alert('Like: ' + id);
        //store.LikeTop5ListById(id);
        if(auth.loggedIn) {
            if(idNamePair.top5List.dislikeList.indexOf(auth.user.email) < 0) {
                if(idNamePair.top5List.likeList.indexOf(auth.user.email) >= 0) {
                    store.UndoLikeTop5ListById(id);
                }
                else {
                    store.LikeTop5ListById(id); 
                }
            }
        }
        // << modified
    }

    function handleDisLikeList(event, id) {
        // >> modified
        //alert('DisLike: ' + id);
        if(auth.loggedIn) {
            if(idNamePair.top5List.likeList.indexOf(auth.user.email) < 0) {
                if(idNamePair.top5List.dislikeList.indexOf(auth.user.email) >= 0) {
                    store.UndoDislikeTop5ListById(id);
                }
                else {
                    store.DislikeTop5ListById(id); 
                }
            }
        }
        // << modified
    }

    function toggleEdit() {
        let newActive = !editActive;
        console.log("a");
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        let _id = event.target.id;
        _id = ("" + _id).substring("delete-list-".length);

        if(auth.loggedIn) {
            //if(idNamePair.top5List.ownerEmail == auth.user.email) {
            if(store.mode == 0) {
                store.markListForDeletion(id);
            }
        }
    }

    function handleKeyPress(event) {
        if (event.code === "Enter") {
            let id = event.target.id.substring("list-".length);
            store.changeListName(id, text);
            toggleEdit();
        }
    }
    function handleUpdateText(event) {
        setText(event.target.value);
    }

    function handleCommentKeyPress(event,id) {
        if (event.code === "Enter") {
            //alert('handleCommentKeyPress ' + auth.loggedIn);
            let text = event.target.value;
            
            if(auth.loggedIn) {
                store.addTop5ListCommentById(id,text);
                event.target.value = '';
            }  
        }
    }

    let selectClass = "unselected-list-card";
    if (selected) {
        selectClass = "selected-list-card";
    }
    let cardStatus = false;
    if (store.isListNameEditActive) {
        cardStatus = true;
    }

    console.log(idNamePair);
    let cardElement =
    <List>
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '0px', display: 'flex', p: 1, fontFamily: 'Arial, Helvetica, sans-serif'}}
            style={{ width: '100%'}}            
            style={{
                fontSize: '20pt'
            }}
        >       <div style={{width: '50%', paddingLeft: '1%'}}>
                    <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize:'18pt', fontWeight: 'bold'}}>{idNamePair.top5List.name}</Box>
                    <Box sx={{ p: 1, flexGrow: 1 }} style={{fontSize:'12pt', fontWeight: 'bold'}}>By: {idNamePair.top5List.userName}</Box>
                    <Box sx={{ p: 1 }} style={{fontSize: '12pt'}}>
                        <a href='#' onClick= {(event) => handleToggleEdit(event, idNamePair._id)}> Edit </a>
                    </Box>
                </div>

                <div style={{flexGrow: '1'}}>
                    <Box sx={{ p: 1 }}>
                        <IconButton onClick={(event) => {
                            handleLikeList(event, idNamePair._id)
                        }} aria-label='like' style={{marginLeft: '30%'}}>
                            <ThumbUp style={{fontSize:'24pt'}} />
                        </IconButton>
                        {idNamePair.top5List.likeCount}

                        <IconButton onClick={(event) => {
                            handleDisLikeList(event, idNamePair._id)
                        }} aria-label='dislike' style={{marginLeft: '10%'}}>
                            <ThumbDown style={{fontSize:'24pt'}} />
                        </IconButton>
                        {idNamePair.top5List.dislikeCount}

                        <IconButton onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} aria-label='delete' style={{marginLeft: '10%'}}>
                            <DeleteIcon style={{fontSize:'24pt'}} />
                        </IconButton>
                    </Box>

                    <Box sx={{ p: 1, flexGrow: 1 }}  style={{marginLeft: '30%', fontSize:'13pt', fontWeight: 'bold'}}> 
                        <div style={{width: '50%'}}>
                            Views: {idNamePair.top5List.viewCount}
                        </div>
                        <div style={{width: '30%', float: 'right'}}>
                            <Button
                                style={{marginLeft: '53%', position: "static"}}
                                onClick={(event) => {
                                handleClick(event, idNamePair._id)
                                }
                                } 
                            >
                            {open ? <ExpandLess /> : <ExpandMore />}    
                            </Button> 
                        </div>
                    </Box> 
                    <Box sx={{ p: 1, flexGrow: 1 }}>{idNamePair.top5List.updatedDate}</Box> 
                </div>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>  
            <div style={{width: '50%', float: 'left', marginLeft: '1.5%', backgroundColor: '#62a5b2', border: '1px solid black', borderRadius: '10px', fontSize: '26px'}}>
            {
                idNamePair.top5List.items.map((item, index) => (                                               
                    <Box sx={{ p: 1, flexGrow: 1 }}>{(index+1) + ". " + item}</Box>                           
                ))  
            }
            </div>
            <div style={{marginLeft: '54%'}} >
                <List sx= {{ width: '100%', maxHeight: 170, overflow: 'auto'}}>
                    {
                        idNamePair.top5List.comment.map((comment) => (                                               
                            <ListItem sx={{width: '95%', marginBottom: '1%', backgroundColor: '#387ca3', borderColor: '#387ca3', border: '0.25px solid', borderRadius: '10px'}}>
                                <div style={{width: '100%', fontWeight: 'bold'}}>
                                    {comment.userName}
                                    <div style={{ fontWeight: 'normal'}}>
                                        {comment.commentText} 
                                     </div>
                                </div>
                            </ListItem>                           
                        ))  
                    } 
                </List>
                <TextField id="outlined-basic" sx={{width: '93%', marginLeft: '0%', marginTop: '0.8%'}} label="Add Comment" variant="outlined" size='small' onKeyPress={(event) => {
                            handleCommentKeyPress(event, idNamePair._id)
                        }} /> 
            </div>
            </List>
        </Collapse>
    </List>    
    if (editActive) {
        cardElement =
            <TextField
                margin="normal"
                required
                fullWidth
                id={"list-" + idNamePair._id}
                label="Top 5 List Name"
                name="name"
                autoComplete="Top 5 List Name"
                className='list-card'
                onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                defaultValue={idNamePair.name}
                inputProps={{style: {fontSize: 48}}}
                InputLabelProps={{style: {fontSize: 24}}}
                autoFocus
            />
    }
    return (
        cardElement
    );
}

export default ListCard;