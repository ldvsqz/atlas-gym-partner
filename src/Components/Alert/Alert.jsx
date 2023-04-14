import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

function Alert(props) {
    const { buttonName= '', title= '', message = '', onResponse } = props;
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const handleAccept = () => {
        setOpen(false);
        onResponse(true)
    };

    return (
        <div>
            <Button onClick={handleClickOpen}>
                {buttonName}
            </Button>
            <Dialog
                open={open}
                onClose={handleCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel}>Cancelar</Button>
                    <Button onClick={handleAccept} autoFocus>
                        Aceptar
                    </Button>
                </DialogActions>



            </Dialog>
        </div>
    );
}

export default Alert