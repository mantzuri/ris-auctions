import * as React from 'react';

import { Box } from '@mui/joy';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { Transition } from 'react-transition-group';
import Typography from '@mui/joy/Typography';

type FadeModalDialogType = {
  open?: boolean,
  setOpen: (open?: boolean) => void,
  message?: string,
  title?: string,
}

const FadeModalDialog = ({ open, setOpen, title, message }: FadeModalDialogType) => {

  const nodeRef = React.useRef(null);

  return (
    <React.Fragment>
      <Transition in={open} timeout={400} nodeRef={nodeRef}>
        {(state) => (
          <Modal
            keepMounted
            open={!['exited', 'exiting'].includes(state)}
            onClose={() => setOpen()}
            slotProps={{
              backdrop: {
                sx: {
                  opacity: 0,
                  backdropFilter: 'none',
                  transition: `opacity 400ms, backdrop-filter 400ms`,
                  // @ts-ignore
                  ...{
                    entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                    entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                  }[state],
                },
              },
            }}
            sx={{
              visibility: state === 'exited' ? 'hidden' : 'visible',
            }}
          >
            <ModalDialog
              aria-labelledby="fade-modal-dialog-title"
              aria-describedby="fade-modal-dialog-description"
              sx={{
                opacity: 0,
                transition: `opacity 300ms`,
                // @ts-ignore
                ...{
                  entering: { opacity: 1 },
                  entered: { opacity: 1 },
                }[state],
              }}
            >
              <Typography
                id="fade-modal-dialog-title"
                component="h2"
                level="inherit"
                fontSize="1.25em"
                mb="0.25em"
              >
                {title}
              </Typography>
              <Typography
                id="fade-modal-dialog-description"
                textColor="text.tertiary"
              >
                {message}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, marginTop: 2, justifyContent: 'flex-end' }}>
                <Button onClick={() => setOpen(false)}>OK</Button>
              </Box>
            </ModalDialog>
          </Modal>
        )}
      </Transition>
    </React.Fragment>
  );
}
export default FadeModalDialog;