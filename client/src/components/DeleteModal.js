import { useContext, useState } from 'react'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { GlobalStoreContext } from '../store'
/*
    This modal is shown when the user asks to delete a list. Note 
    that before this is shown a list has to be marked for deletion,
    which means its id has to be known so that we can retrieve its
    information and display its name in this modal. If the user presses
    confirm, it will be deleted.
    
    @author McKilla Gorilla
*/
function DeleteModal(props) {
    const { store } = useContext(GlobalStoreContext);
        //FOR DELETE MODAL
        const [open, setOpen] = useState(props.open);
        //var myOpen = false;

        const handleOpen = () => {
          setOpen(true);
        };
    
        const handleClose = () => {
            console.log("handle close called");
            setOpen(false);
            //DeleteModal.setClosed(false);
        };
    let name = "";
    console.log("currentList: ", store.listMarkedForDeletion);
    if (store.listMarkedForDeletion) {
        name = store.listMarkedForDeletion.name;
    }
    if(name !== "" && open !== true){
        handleOpen();
    }
    // else{
    //     handleClose();
    // }
    
    function handleDeleteList(event) {
        event.stopPropagation();
        store.deleteMarkedList();
        handleCloseModal(event);
    }
    function handleCloseModal(event) {
        event.stopPropagation();
        console.log("Waiting to hide deleteListModal");
        store.hideDeleteListModal();
        handleClose();
    }
    console.log("value of open passed from props: ", props.open);
    const style = {
        display: "flex",
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };
    return (
        //<Button onClick={handleOpen}>Open modal</Button>
        <div>
            <Modal
            open = {open}
            onClose={handleCloseModal}
            //{...props}
            //open={open}
            //onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" align="center" width='100%'>
                Delete the {name} Top 5 List?
                <Box style={{  justifyContent: "space-between", position: "relative"}}>
                <Button  variant="contained" onClick={handleDeleteList} align="left">Delete List</Button>
                    <Button variant="contained" onClick={handleCloseModal} align="right">Cancel</Button>
                </Box>
                </Typography>
                
            </Box>
            </Modal>
        </div>
    );
}

export default DeleteModal;