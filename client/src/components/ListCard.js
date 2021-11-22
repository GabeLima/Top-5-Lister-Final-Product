import { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
    const { store } = useContext(GlobalStoreContext);
    const [editActive, setEditActive] = useState(false);
    const [text, setText] = useState("");
    const { idNamePair } = props;

    function handleLoadList(event, id) {
        if (!event.target.disabled) {
            // CHANGE THE CURRENT LIST
            store.setCurrentList(id);
        }
    }

    function handleToggleEdit(event) {
        event.stopPropagation();
        toggleEdit();
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

    function handleKeyPress(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            if(text !== ""){
                let id = event.target.id.substring("list-".length);
                store.changeListName(id, text);
            }
            toggleEdit();
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

    function handleSelectUser() {
        console.log("HAVE TO IMPLEMENT THIS- SELECTING A USER FROM LISTS");
    }

    function handleUpdateText(event) {
        setText(event.target.value);
    }
    let isPublished = idNamePair.published;
    if(isPublished !== "false"){
        isPublished = true;
    }
    else{
        isPublished = false;
    }

    let cardElement =
        <ListItem
            id={idNamePair._id}
            key={idNamePair._id}
            sx={{ marginTop: '-15px', display: 'flex', p: 1 }}
            //button
            // onClick={(event) => {
            //     handleLoadList(event, idNamePair._id)
            // }
            // }
            style={{
                fontSize: '20pt',
                width: '100%',
                top:"0px"
                //marginTop:'0%'
            }}
        > 
                <Box sx={{ p: 2, flexGrow: 1, marginTop:'-0%' }}>
                    {idNamePair.name}
                    <div id="list-card-by-text">
                        {"By: "}
                        <span id="list-card-by-text-colored" onClick = {handleSelectUser}>
                             {idNamePair.ownerEmail}
                        </span> 
                    </div>
                    {isPublished ?
                        
                        <span id="list-card-by-text">
                            {"Published: "}
                            <span id="list-card-published-color">
                                {idNamePair.published}
                            </span>
                        </span> 
                            : 
                            <span id="list-card-not-published-color" onClick={(event) => {handleLoadList(event, idNamePair._id)}}>
                                {"Edit"}
                            </span>
                            }

                </Box>
                <Box sx={{ p: 1 }}>
                    <IconButton onClick={(event) => {
                        handleDeleteList(event, idNamePair._id)
                    }} aria-label='delete'>
                        <DeleteIcon style={{fontSize:'48pt'}} />
                    </IconButton>
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
                onKeyPress={handleKeyPress}
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