import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'
import AuthContext from '../auth';
import { Fab} from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { auth } = useContext(AuthContext);
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    // let text ="";
    let pathName = history.location.pathname;
    console.log(pathName);
    function handleCreateNewList() {
        store.createNewList();
    }
    function disableStatusBar(){
        if(auth.user.userName === "Guest" || store.listOpen === true){
            console.log("store.listOpen:", store.listOpen);
            return true;
        }
        return false;
    }
    function determineStatusBarText(){
        if(store.onYourListsPage){
            return "Your Lists";
        }
        if(store.onAllListsPage){
            if(store.getLocalSearchText() !== ""){
                return store.getLocalSearchText() + " Lists";
            }
            return "All Lists";
        }
        if(store.onUserListsPage){
            if(store.getLocalSearchText() !== ""){
                return store.getLocalSearchText() + " Lists";
            }
            return "User Lists";
        }
        if(store.onCommunityListsPage){
            if(store.getLocalSearchText() !== ""){
                return store.getLocalSearchText() + " Lists";
            }
            return "Community Lists";
        }
        return "Your Lists";
    }
    function shouldDisplayAddLists(){
        if(store.onYourListsPage){
            console.log("store.onYourListsPage", store.onYourListsPage);
            return true;
        }
        console.log("store.onYourListsPage", store.onYourListsPage);
        return false;
    }
    // if (store.currentList && store.listOpen)
    //     text = "Top 5 " + store.currentList.name;
    //return(<div></div>);
    if(!auth.loggedIn === true  || pathName.includes('/login' || pathName.includes('/register'))){ // or have to make a check that we're in guest mode...
        return(<div></div>);
    }
    
    return (
        <div id="top5-statusbar">
            <div id="new-list-selector-heading">
                {shouldDisplayAddLists() ?
                        <Fab 
                            disabled={disableStatusBar()}
                            color="primary" 
                            aria-label="add"
                            id="add-list-button"
                            onClick={handleCreateNewList}
                        >
                            <AddIcon />
                        </Fab>
                    :
                    <span></span>
                }
                <Typography variant="h2" disabled={disableStatusBar()}>{determineStatusBarText()}</Typography>
            </div>
        </div>
    );
}

export default Statusbar;