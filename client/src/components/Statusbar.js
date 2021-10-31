import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { Typography } from '@mui/material'
import { useHistory } from 'react-router-dom'

/*
    Our Status bar React component goes at the bottom of our UI.
    
    @author McKilla Gorilla
*/
function Statusbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();
    let text ="";
    let pathName = history.location.pathname;
    console.log(pathName);
    if (store.currentList && store.listOpen)
        text = store.currentList.name;
    return (
        <div id="top5-statusbar">
            <Typography variant="h4">{text}</Typography>
        </div>
    );
}

export default Statusbar;