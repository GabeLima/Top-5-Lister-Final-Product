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
function AlertModal(props) {
    const { store } = useContext(GlobalStoreContext);
        //FOR DELETE MODAL
        const [open, setOpen] = useState(false);
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
    let errorMessage = "";
    if(store){
        errorMessage = store.errorMessage;
        if(errorMessage !== null && !open){
            handleOpen();
        }
    }
    if(name !== "" && open !== true){
        handleOpen();
    }
    
    function handleCloseModal(event) {
        event.stopPropagation();
        store.setErrorMessage(null);
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
                {errorMessage}
                <Box style={{  justifyContent: "space-between", position: "relative"}}>
                <Button variant="contained" onClick={handleCloseModal} align="right">Ok</Button>
                </Box>
                </Typography>
                
            </Box>
            </Modal>
        </div>
    );
}

export default AlertModal;