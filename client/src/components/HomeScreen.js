import React, { useContext, useEffect, useState } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import Home from '@mui/icons-material/Home';
import Groups from '@mui/icons-material/Groups';
import Person from '@mui/icons-material/Person';
import Functions from '@mui/icons-material/Functions';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import List from '@mui/material/List';
import { DeleteModal} from '.';
import AlertModal from './AlertModal';
import MenuItem from '@mui/material/MenuItem';
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
        store.resetLocalSearchtext();
        document.getElementById("search-bar").value = "";
    }
    function allListsView(){
        store.setAllListsView();
        store.resetLocalSearchtext();
        document.getElementById("search-bar").value = "";
    }
    function userListsView(){
        store.setUserListsView();
        store.resetLocalSearchtext();
        document.getElementById("search-bar").value = "";
    }
    function communityListsView(){
        store.setCommunityListsView();
        store.resetLocalSearchtext();
        document.getElementById("search-bar").value = "";
    }
    function handleChange(event){
        store.setLocalSearchText(event.target.value);
    }

    function sortByPublishDateNewest(){
        let idNamePairs = store.idNamePairs;
        idNamePairs.sort(function(pair1, pair2){
            if(determineDateValue(pair1.published) > determineDateValue(pair2.published)) return -1;
            if(determineDateValue(pair1.published) == determineDateValue(pair2.published)) return 0;
            if(determineDateValue(pair1.published) <  determineDateValue(pair2.published)) return 1;
        });
        store.loadCustomIDNamePairs(idNamePairs);
    }

    
    function sortByPublishDateOldest(){
        let idNamePairs = store.idNamePairs;
        idNamePairs.sort(function(pair1, pair2){
            if(determineDateValue(pair1.published) < determineDateValue(pair2.published)) return -1;
            if(determineDateValue(pair1.published) == determineDateValue(pair2.published)) return 0;
            if(determineDateValue(pair1.published) >  determineDateValue(pair2.published)) return 1;
        });
        store.loadCustomIDNamePairs(idNamePairs);
    }

    function determineDateValue(date){
        if(date==="false") return -1;
        //let date = 0;
        let firstSpace = date.indexOf(" ");
        let month = date.substring(0, firstSpace);
        var monthValues = {"January":0, "February":1, "March":2, "April":3, "May":4, "June":5,
        "July":6, "August":7, "September":8, "October":9, "November":10, "December":11
        };
        let monthValue = monthValues[month] * 10;
        //console.log("month: ", monthValue);
        let secondSpace = date.indexOf(" ", firstSpace+1);
        let day = date.substring(firstSpace+1, secondSpace);
        //console.log("day: ", day);
        let year = date.substring(secondSpace);
        //console.log("year: ", year);
        let finalValue = year + monthValue + day;
        //console.log("Final Value: ", parseInt(finalValue));
        return parseInt(finalValue);
        //if(date.indexOf(" "))
    }

    function sortByViews(){

    }

    function sortByLikes(){
        let idNamePairs = store.idNamePairs;
        idNamePairs.sort(function(pair1, pair2){
            if(pair1.likedBy.length > pair2.likedBy.length) return -1;
            if(pair1.likedBy.length == pair2.likedBy.length) return 0;
            if(pair1.likedBy.length <  pair2.likedBy.length) return 1;
        });
        store.loadCustomIDNamePairs(idNamePairs);
    }

    function sortByDislikes(){
        let idNamePairs = store.idNamePairs;
        idNamePairs.sort(function(pair1, pair2){
            if(pair1.dislikedBy.length > pair2.dislikedBy.length) return -1;
            if(pair1.dislikedBy.length == pair2.dislikedBy.length) return 0;
            if(pair1.dislikedBy.length <  pair2.dislikedBy.length) return 1;
        });
        store.loadCustomIDNamePairs(idNamePairs);
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
                        comments ={pair.comments}
                    />
                ))
            }
            <DeleteModal open={isOpen} ></DeleteModal>
            <AlertModal></AlertModal>
            </List>;
    }
    //Something about the menu idk
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const handleSortMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    const menuId = 'primary-search-account-menu';
    const menu = 
    <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
            vertical: 'bottom',
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
        <MenuItem onClick={sortByPublishDateNewest}>Publish Date (Newest)</MenuItem>
        <MenuItem onClick={sortByPublishDateOldest}>Publish Date (Oldest)</MenuItem>
        <MenuItem onClick={sortByViews}>Views</MenuItem>
        <MenuItem onClick={sortByLikes}>Likes</MenuItem>
        <MenuItem onClick={sortByDislikes}>Dislikes</MenuItem>
    </Menu>  

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
                id="search-bar"
                placeholder={"Search"}
                style={{width: "50%", height:"70%"}}
                onChange={handleChange}
                onLoad={handleChange}
            />
            <span id="list-selector-heading-sort">
                <Typography variant="h4" fontWeight='bold'>Sort By</Typography>
                        <Menu>
                            <MenuItem >Login</MenuItem>
                            </Menu>
                    <Fab 
                        color="primary" 
                        aria-label="sort"
                        style={{backgroundColor: defaultBackgroundColor, color:"black"}}
                        // id="add-list-button"
                        // onClick={handleCreateNewList}
                        onClick={handleSortMenuOpen}
                    >
                        
                        {/* <MenuItem >Login</MenuItem> */}
                        
                            <MenuIcon />
                    </Fab>
                    {
                        menu
                    }
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