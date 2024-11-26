import { Modal, Box, Typography, Button, Divider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const COLOR = "#282828";
const VIOLET_PRIMARY = "#a757e4";

const ModalNotLogged = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: COLOR,
            border: "2px solid #000",
            borderColor: VIOLET_PRIMARY,
            color: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: "20px",
          }}
        >
          <Typography id="modal-modal-title" sx={{ textAlign: "center", mt: 2, fontSize: "30px" }} variant="h5" component="h2">
            Tienes que iniciar sesión
          </Typography>
          <Typography id="modal-modal-description" sx={{ textAlign: "center", mt: 2 }}>
            No puedes acceder sin iniciar sesión
          </Typography>
          <br />
          <Divider />
          <br />

          <Button fullWidth variant="contained" onClick={() => navigate("/login")}>
            Iniciar Sesión
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ModalNotLogged;
