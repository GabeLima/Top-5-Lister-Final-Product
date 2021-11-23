import { useContext, useState } from 'react'
import Top5Item from './Top5Item.js'
import List from '@mui/material/List';
import { Typography } from '@mui/material'
import { GlobalStoreContext } from '../store/index.js'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
    const { store } = useContext(GlobalStoreContext);
    const [text, setText] = useState("");
    function toggleEdit() {
        document.getElementById("list-" + store.currentList._id).blur();
    }
    function handleKeyPress(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            // if(text !== ""){
                // let id = event.target.id.substring("list-".length);
                // store.changeListName(id, text);
            // }
            handleUpdateText(event);
            toggleEdit();
        }
    }

    function handleOnBlur(event) {
        if(text !== ""){
            let id = event.target.id.substring("list-".length);
            console.log("Onblur called, text: ", text);
            handleUpdateText(event);
            // store.changeListName(id, text);
        }
        toggleEdit();
    }
    function handleUpdateText(event) {
        if(event.target.value !== "" && event.target.value !== store.currentList.name){
            store.listHasBeenEdited = true;
        }
        setText(event.target.value);
    }
    function handleClose() {
        store.closeCurrentList();
    }
    function onSave(){
        if(text!=""){
            store.currentList.name = text;
        }
        //update the list
        store.updateCurrentList();
        //And then exit back to the home screen
        handleClose();
    }

    function onPublish(){
        if(text!=""){
            store.currentList.name = text;
        }
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth()).padStart(2, '0');
        var yyyy = today.getFullYear();
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];
        today = monthNames[mm] + " " + dd + ", " + yyyy;
        store.currentList.published = String(today);
        console.log("currentList after setting published date: " + store.currentList.published);
        store.updateCurrentList();
        handleClose();
    }

    function haveChangesBeenMade(){
        return !store.listHasBeenEdited;
    }

    function canWePublish(){
        if(store.currentList === null){
            return true;
        }
        let items = store.currentList.items;
        for(let i = 0; i < items.length; i ++){
            if(items[i] === ""){
                return true;
            }
        }
        if(store.currentList.name === ""){
            return true;
        }
        //Otherwise do any of our published lists match our currentLists name?
        return false;
    }


    let cardElement = undefined;
    if(store.currentList != null){
        cardElement =
        <TextField
            margin="normal"
            required
            fullWidth
            id={"list-" + store.currentList._id} //not sure if currentList has an id
            label="Top 5 List Name"
            name="name"
            autoComplete="Top 5 List Name"
            className='list-card'
            onKeyPress={handleKeyPress}
            onChange={handleUpdateText}
            onBlur = {handleOnBlur}
            defaultValue={store.currentList !== null? store.currentList.name : " "}
            inputProps={{style: {fontSize: 24}}}
            InputLabelProps={{style: {fontSize: 24}}}
        />
    }

    let editItems = "";
    if (store.currentList) {
        editItems = 
            <List id="edit-items" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {
                    store.currentList.items.map((item, index) => (
                        <Top5Item 
                            key={'top5-item-' + (index+1)}
                            text={store.currentList.items[index]}
                            index={index} 
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-workspace">
                <div id="workspace-edit">
                <div id="edit-list-name">{cardElement}</div>
               {/* <div id="edit-list-name">{" ."}</div> */}
                    <div id="edit-numbering">
                        <div className="item-number"><Typography variant="h3">1.</Typography></div>
                        <div className="item-number"><Typography variant="h3">2.</Typography></div>
                        <div className="item-number"><Typography variant="h3">3.</Typography></div>
                        <div className="item-number"><Typography variant="h3">4.</Typography></div>
                        <div className="item-number"><Typography variant="h3">5.</Typography></div>
                    </div>
                    {editItems}
                </div>
                <div id="save-publish">
                    <div id="save-publish-buttons">
                        <Button 
                            id='save-button'
                            size="large"
                            disabled = {haveChangesBeenMade()}
                            onClick={onSave}
                            variant="outlined">
                            Save
                        </Button>
                        <Button 
                            id='publish-button'
                            size="large"
                            disabled = {canWePublish()}
                            onClick={onPublish}
                            variant="outlined">
                            Publish
                        </Button>
                    </div>
                    </div>
        </div>
    )
}

export default WorkspaceScreen;