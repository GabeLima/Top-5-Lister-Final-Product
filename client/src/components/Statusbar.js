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
    let text ="";
    let pathName = history.location.pathname;
    console.log(pathName);
    function handleCreateNewList() {
        store.createNewList();
    }
    if (store.currentList && store.listOpen)
        text = "Top 5 " + store.currentList.name;
    //return(<div></div>);
    if(!auth.loggedIn === true){ // or have to make a check that we're in guest mode...
        return(<div></div>);
    }
    return (
        <div id="top5-statusbar">
            <div id="new-list-selector-heading">
            <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
        </div>
    );
}

export default Statusbar;