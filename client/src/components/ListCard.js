import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AuthContext from '../auth';
import ThumbUp from '@mui/icons-material/ThumbUp'
import ThumbDown from '@mui/icons-material/ThumbDown'

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
    const { idNamePair, comments } = props;
    //let idNamePair = store.idNamePairs;

    function handleLoadList(event, id) {
        event.stopPropagation();
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function toggleEdit() {
        let newActive = !editActive;
        if (newActive) {
            store.setIsListNameEditActive();
        }
        setEditActive(newActive);
    }

    async function handleDeleteList(event, id) {
        event.stopPropagation();
        store.markListForDeletion(id);
        console.log("Marking list for deletion: ", id);
    }
    //FOR THE COMMENTS
    function handleKeyPress(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            if(event.target.value !== ""){
                if(auth.user.userName === "Guest"){
                    store.setErrorMessage("You need to register an account to comment on a list!");
                    return;
                }
                let newComment = [auth.user.userName, event.target.value];

                store.currentList.comments.push(newComment);
                console.log("Creating a comment for comment: " + event.target.value);
                document.getElementById("comment-bar").value = "";
                //store.updateCurrentList();
                //store.setAllListsView();
                
                store.loadIdNamePairsAfterPushingComment();
                //setNewListCardId();
                //store.currentList = 
                //store.loadIdNamePairs();
                // let id = event.target.id.substring("list-".length);
                // store.changeListName(id, text);
            }
            // toggleEdit();
        }
    }

    function handleOnBlur(event) {
        if(text !== ""){
            let id = event.target.id.substring("list-".length);
            console.log("Onblur called, text: ", text);
            store.changeListName(id, text);
        }
        toggleEdit();
    }

    function handleSelectUser(event, userName) {
        event.stopPropagation();
        //alert(event.target);
        //store.setUserListsView();
        store.setLocalSearchText(userName);
        document.getElementById("search-bar").value = userName;
        store.setUserListsView();
        //store.resetLocalListCardId();
    }

    function handleLike(){
        if(auth.user.userName ==="Guest"){
            store.setErrorMessage("You must create an account to like a list!");
            return;
        }
        let likedByList = idNamePair.likedBy;
        
        for(let i = 0; i < likedByList.length; i++){
            if(likedByList[i] === auth.user.userName){ //If its already liked, remove the like and return
                likedByList.splice(i, 1);
                idNamePair.likedBy = likedByList;
                store.updateListLikesAndDislikes(idNamePair._id, idNamePair.likedBy, idNamePair.dislikedBy);
                return;
            }
        }
        //If we made it here, lets check the disliked list and remove from there
        let dislikedByList = idNamePair.dislikedBy;
        
        for(let i = 0; i < dislikedByList.length; i++){
            if(dislikedByList[i] === auth.user.userName){ //If its disliked, remove the dislike
                dislikedByList.splice(i, 1);
                idNamePair.dislikedBy = dislikedByList;
                break;
            }
        }
        //Finally add the like
        idNamePair.likedBy.push(auth.user.userName);
        store.updateListLikesAndDislikes(idNamePair._id, idNamePair.likedBy, idNamePair.dislikedBy);
    }


    function handleDislike(){
        if(auth.user.userName ==="Guest"){
            store.setErrorMessage("You must create an account to dislike a list!");
            return;
        }
        let dislikedByList = idNamePair.dislikedBy;
        
        for(let i = 0; i < dislikedByList.length; i++){
            if(dislikedByList[i] === auth.user.userName){ //If its disliked, remove the dislike and reurn
                dislikedByList.splice(i, 1);
                idNamePair.dislikedBy = dislikedByList;
                store.updateListLikesAndDislikes(idNamePair._id, idNamePair.likedBy, idNamePair.dislikedBy);
                //store.currentList.dislikedBy = idNamePair.dislikedBy; 
                //store.updateCurrentList();
                return;
            }
        }

        let likedByList = idNamePair.likedBy;
        
        for(let i = 0; i < likedByList.length; i++){
            if(likedByList[i] === auth.user.userName){ //If its already liked, remove the like
                likedByList.splice(i, 1);
                idNamePair.likedBy = likedByList;
                
                //store.currentList.likedBy = idNamePair.likedBy; 
                break;
            }
        }
        //If we made it here, lets check the disliked list and remove from there
        //Finally add the like
        idNamePair.dislikedBy.push(auth.user.userName);
        store.updateListLikesAndDislikes(idNamePair._id, idNamePair.likedBy, idNamePair.dislikedBy);
    }

    function isLikedByThisUser(){
        let likedByList = idNamePair.likedBy;
        
        for(let i = 0; i < likedByList.length; i++){
            if(likedByList[i] === auth.user.userName){ //If its liked, return true
                return true;
            }
        }
        return false;
    }

    function isDislikedByThisUser(){
        let dislikedByList = idNamePair.dislikedBy;
        
        for(let i = 0; i < dislikedByList.length; i++){
            if(dislikedByList[i] === auth.user.userName){ //If its liked, return true
                return true;
            }
        }
        return false;
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }
    function derivePublishedOrUpdated(){
        if(idNamePair.isCommunityList === "true"){
            return "Updated: ";
        }
        return "Published: ";
    }

    function setNewListCardId(event) {
        if(store.listcardExpanded !== idNamePair._id){
            //store.setListCardExpanded(idNamePair._id);
            store.updateListViewsById(idNamePair._id);
        }
        console.log("Setting new id to: ", idNamePair._id);
        store.setCurrentListWithoutChangingPage(idNamePair._id);
        //if(idNamePair.published !== "false")
        store.setListCardExpanded(idNamePair._id);
        //store.updateCurrentList();
    }
    
    let isPublished = idNamePair.published;
    if(isPublished !== "false"){
        isPublished = true;
    }
    else{
        isPublished = false;
    }
    // let comments = <ul></ul>;
    // if(store.idNamePairs.comments.length > 0){

    // }
    let reversedComments = comments.slice(0).reverse();

    let cardBackgroundColor = "#e6bbad"; //#e6bbad
    if(isPublished){
        cardBackgroundColor = "#ADD8E6";
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '-15px', display: 'flex', p: 1}}
            //button
            onClick={setNewListCardId}
            //backgroundColor="black"
            // onClick={(event) => {
            //     handleLoadList(event, idNamePair._id)
            // }
            // }
            style={{
                fontSize: '20pt',
                width: '100%',
                top:"0px",
                padding:"20px",
                backgroundColor: cardBackgroundColor,
                border:"20px solid white"
                // background-clip: "content-box"
                //marginTop:'0%'
            }}
        > 
                <Box sx={{ p: 2, flexGrow: 1, marginTop:'-0%' }}>
                    {idNamePair.name}
                    {isPublished ?
                    <span id="list-card-likes-and-dislikes">
                        <IconButton id={isLikedByThisUser() ? "list-card-liked-or-disliked-color" : ""} onClick={(event) => {
                                event.stopPropagation();
                                handleLike();
                            }} aria-label='Thumbs up'>
                                <ThumbUp style={{fontSize:'24pt'}} />
                                {idNamePair.likedBy.length}
                            </IconButton>
                            <IconButton id={isDislikedByThisUser() ? "list-card-liked-or-disliked-color" : ""} onClick={(event) => {
                                event.stopPropagation();
                                handleDislike();
                            }} aria-label='Thumbs Down'>
                                <ThumbDown style={{fontSize:'24pt'}} />
                                {idNamePair.dislikedBy.length}
                            </IconButton>
                    </span>
                    :
                    <span></span>
                    }
                    {idNamePair.isCommunityList==="false"?
                    <div id="list-card-by-text">
                        {"By: "}
                        <span id="list-card-by-text-colored" onClick = {(event)=> handleSelectUser(event, idNamePair.userName)}>
                             {idNamePair.userName}
                        </span> 
                    </div>
                    :
                    <div id="list-card-by-text"><span> <br></br></span></div> //Don't load the by-user text
                    }
                    {store.listcardExpanded!= null && store.listcardExpanded === idNamePair._id? 
                    <div className="items-and-comments-container">
                        <ol id="list-card-items">
                           <li >{idNamePair.items[0]}</li>
                           <li>{idNamePair.items[1]}</li>
                           <li>{idNamePair.items[2]}</li>
                           <li>{idNamePair.items[3]}</li>
                           <li>{idNamePair.items[4]}</li>
                        </ol>
                        <div id="list-card-comments-container" >
                            <ul id="list-card-comments"style={{listStyleType:"none", padding: 0, width:"100%", borderLeft:"5px solid #ADD8E6", borderRight:"5px solid #ADD8E6"}}>
                                {reversedComments.map(
                                    p => 
                                    <li style = {{borderBottom:"5px solid #ADD8E6"}}>
                                        <li id="list-card-comments-user" onClick = {(event)=> handleSelectUser(event, p[0])}>
                                        {p[0]}
                                        </li>
                                        <li id="list-card-comments-comment">
                                            {p[1]}
                                        </li>
                                    </li>)
                                    }
                            </ul>
                            <input
                                disabled={!isPublished}
                                type="text"
                                id="comment-bar"
                                placeholder={"Add a comment!"}
                                style={{width: "100%", height:"20%", position:"relative"}}
                                onKeyPress = {handleKeyPress}
                                //onChange={handleChange}
                                //onLoad={handleChange}
                            />
                        </div>
                    </div>
                        :
                    
                    
                    
                        <span></span>
                    }
                    {isPublished ?
                        
                        <span id="list-card-by-text">
                            {derivePublishedOrUpdated()}
                            <span id="list-card-published-color">
                                {idNamePair.published}
                            </span>
                            <span id="list-card-views"> {"Views: "} 
                            <span id="list-card-views-colored"> {idNamePair.views} 
                            </span>
                            </span>

                        </span> 
                            : 
                            <span id="list-card-not-published-color" onClick={(event) => {handleLoadList(event, idNamePair._id)}}>
                                {"Edit"}
                            </span>
                            }

                </Box>
                <Box sx={{ p: 1 }}>
                    {auth.user.userName === idNamePair.userName ?
                        <IconButton onClick={(event) => {
                            handleDeleteList(event, idNamePair._id)
                        }} aria-label='delete'>
                            <DeleteIcon style={{fontSize:'48pt'}} />
                        </IconButton>
                    : 
                    <span></span>}
                </Box>
        </ListItem>

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
                //onKeyPress={handleKeyPress}
                onChange={handleUpdateText}
                onBlur = {handleOnBlur}
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