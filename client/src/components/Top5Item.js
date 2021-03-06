import { React, useContext, useState } from "react";
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
/*
    This React component represents a single item in our
    Top 5 List, which can be edited or moved around.
    
    @author McKilla Gorilla
*/
function Top5Item(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
    }

    function toggleEdit() {
        console.log("Inside toggle edit");
        let newActive = !editActive;
        if (newActive) {
            store.setIsItemEditActive();
        }
        setEditActive(newActive);
    }
    function handleKeyPress(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            var text = event.target.value;
            if(text !== ""){
                let id = event.target.id.substring("list-".length);
                if(store.currentList.items[id-1] !== text){
                    store.updateItem(id-1, text);
                }
            }
            toggleEdit();
        }
    }

    function handleOnBlur(event) {
        //console.log(store.currentList);
            var text = event.target.value;
            if(text !== ""){
                let id = event.target.id.substring("list-".length);
                if(store.currentList.items[id-1] !== text){
                    store.updateItem(id-1, text);
                }
            }
            toggleEdit();
    }

    let { index } = props;

    let itemClass = "top5-item";

    let itemElement = 
        <ListItem
        id={'item-' + (index+1)}
        //key={props.key}
        className={itemClass}
        draggable="false"
        sx={{ display: 'flex', p: 1 }}
        style={{
            fontSize: '48pt',
            width: '100%'
        }}
    >
    <Box sx={{ p: 1 }}>
        <IconButton onClick={handleToggleEdit} aria-label='edit'>
            <EditIcon style={{fontSize:'48pt'}} />
        </IconButton>
    </Box>
        <Box sx={{ p: 1, flexGrow: 1 }}>{props.text}</Box>
    </ListItem>
    if(editActive){
        itemElement = 
        <TextField
            margin="normal"
            required
            fullWidth
            id={"item-" + (index + 1)}
            label={"item " + (index + 1)}
            name="name"
            autoComplete={itemClass}
            className={itemClass}
            onKeyPress={handleKeyPress}
            onBlur = {handleOnBlur}
            defaultValue={store.currentList.items[index]}
            inputProps={{style: {fontSize: 48}}}
            InputLabelProps={{style: {fontSize: 24}}}
            autoFocus
        />
    }


    return (
        itemElement
    )
}

export default Top5Item;