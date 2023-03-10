import * as React from 'react';

import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { SyntheticEvent } from 'react';
import Typography from '@mui/joy/Typography';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { deleteListing } from '$utils/firebase';
import useCheckIfUserAdmin from '$hooks/useCheckIfUserAdmin';

export default function DeleteListingDialog({ listingId }: { listingId: string }) {
  const [open, setOpen] = React.useState(false);
  const userIsAdmin = useCheckIfUserAdmin();


  const onDeleteClicked = (_event: SyntheticEvent) => {
    deleteListing(listingId)
    setOpen(false);
  };

  return (
    <React.Fragment>
      {userIsAdmin && <Button
        variant="plain"
        color="danger"
        onClick={() => setOpen(true)}
      >
        Discard
      </Button>}
      <Modal
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
        open={open}
        onClose={() => setOpen(false)}
      >
        <ModalDialog variant="outlined" role="alertdialog">
          <Typography
            id="alert-dialog-modal-title"
            component="h2"
            level="inherit"
            fontSize="1.25em"
            mb="0.25em"
            startDecorator={<WarningRoundedIcon />}
          >
            Confirmation
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography
            id="alert-dialog-modal-description"
            textColor="text.tertiary"
            mb={3}
          >
            Are you sure you want to delete this listing?
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button variant="plain" color="neutral" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={onDeleteClicked}>
              Delete
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}