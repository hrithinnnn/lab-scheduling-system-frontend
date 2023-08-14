import React, { useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
export default function TestSnackbar(props){
    const [open, setOpen] = React.useState(false);

    const handleToClose = (event, reason) => {
        if ("clickaway" === reason) return;
        setOpen(false);
    };
 
    const handleClickEvent = () => {
        setOpen(props.bool);
    };

    useEffect(()=>{
        handleClickEvent();
    },[props.bool])

    return (<>
    
            <Snackbar
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom",
                }}
                open={open}
                autoHideDuration={1000}
                message={props.message}
                onClose={handleToClose}
                action={
                    <React.Fragment>
                        <IconButton
                            size="small"
                            aria-label="close"
                            color="inherit"
                            onClick={handleToClose}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />

    </>)
}