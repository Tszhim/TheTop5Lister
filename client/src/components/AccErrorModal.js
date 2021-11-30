import * as React from 'react';
import { useContext } from 'react';
import AuthContext from '../auth'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Modal from '@mui/material/Modal';


const style = {
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

export default function AccErrorModal() {
  const { auth } = useContext(AuthContext);
  const handleClose = () => auth.clearError();

  return (    
    <div>
      <Modal
        open={auth.accError != null}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <Alert severity="warning" id="modal-modal-description">
                <AlertTitle id="modal-modal-title">Warning</AlertTitle>
                {auth.accError}
            </Alert>
            <Button style={{margin: '0 auto', display: "flex"}} variant="contained" onClick={handleClose}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}
