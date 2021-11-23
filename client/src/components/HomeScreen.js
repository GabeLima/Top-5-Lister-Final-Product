import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import Home from '@mui/icons-material/Home';
import Groups from '@mui/icons-material/Groups';
import Person from '@mui/icons-material/Person';
import Functions from '@mui/icons-material/Functions';
import Menu from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import { DeleteModal} from '.';
import AlertModal from './AlertModal';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function yourListsView(){
        store.setYourListsView();
    }
    function allListsView(){
        store.setAllListsView();
    }
    function userListsView(){
        store.setUserListsView();
    }
    function communityListsView(){
        store.setCommunityListsView();
    }
    function handleChange(event){
        store.setLocalSearchText(event.target.value);
    }

    let defaultBackgroundColor = "#c8c4c4";
    let selectedBackgroundColor = "#2074d4"


    let listCard = "";
    let isOpen = false;
    if (store) {
        if(store.listMarkedForDeletion && store.listMarkedForDeletion != null){
            console.log("isOpen is marked to TRUE after render");
            isOpen = true;
        }else{
            console.log("isOpen is marked to FALSE after render");
            isOpen = false;
        }
        console.log("isOpen value: ", isOpen);
        listCard = 
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
            {
                store.idNamePairs.map((pair) => (
                    <ListCard
                        key={pair._id}
                        idNamePair={pair}
                        selected={false}
                    />
                ))
            }
            <DeleteModal open={isOpen} ></DeleteModal>
            <AlertModal></AlertModal>
            </List>;
    }
    // old delete modal went above the /list here

    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading-buttons">
            {/* <Fab 
                color="primary" 
                aria-label="add"
                id="add-list-button"
                onClick={handleCreateNewList}
            >
                <AddIcon />
            </Fab> */}
            <Fab 
                color="primary" 
                aria-label="Your Lists"
                onClick={yourListsView}
                style={store != null && store.onYourListsPage === true ? {backgroundColor: selectedBackgroundColor, color:"white"} : {backgroundColor: defaultBackgroundColor, color:"black"}}
            >
                <Home />
            </Fab>
            <Fab 
                color="primary" 
                aria-label="All Lists"
                onClick={allListsView}
                style={store != null && store.onAllListsPage === true ? {backgroundColor: selectedBackgroundColor, color:"white"} : {backgroundColor: defaultBackgroundColor, color:"black"}}
            >
                <Groups />
            </Fab>
            <Fab 
                color="primary" 
                aria-label="User Lists"
                onClick={userListsView}
                style={store != null && store.onUserListsPage === true ? {backgroundColor: selectedBackgroundColor, color:"white"} : {backgroundColor: defaultBackgroundColor, color:"black"}}
            >
                <Person />
            </Fab>
            <Fab 
                color="primary" 
                aria-label="Community Lists"
                onClick={communityListsView}
                style={store != null && store.onCommunityListsPage === true ? {backgroundColor: selectedBackgroundColor, color:"white"} : {backgroundColor: defaultBackgroundColor, color:"black"}}
            >
                <Functions />
            </Fab>
            <input
                type="text"
                placeholder={"Search"}
                style={{width: "50%", height:"70%"}}
                onChange={handleChange}
            />
            <span id="list-selector-heading-sort">
                <Typography variant="h4" fontWeight='bold'>Sort By</Typography>
                    <Fab 
                        color="primary" 
                        aria-label="sort"
                        style={{backgroundColor: defaultBackgroundColor, color:"black"}}
                        // id="add-list-button"
                        // onClick={handleCreateNewList}
                    >
                        <Menu />
                    </Fab>
            </span>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
        </div>)
}

export default HomeScreen;