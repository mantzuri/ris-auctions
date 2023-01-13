import { SyntheticEvent, useEffect, useState } from 'react';

import Button from '@mui/joy/Button';
import { FormControl } from '@mui/joy';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import TextField from '@mui/joy/TextField';
import Typography from '@mui/joy/Typography';
import { createAuctionItem } from '../utils/firebase';
import { uploadImage } from '../utils/storage';

interface NewAuctionModalType {
  open?: boolean;
  onClose: Function;
}

interface FormFieldsType extends HTMLTextAreaElement {
  [key: number]: HTMLTextAreaElement
}

export default function NewAuctionModal({ open, onClose }: NewAuctionModalType) {

  const [uploading, setUploading] = useState(false);

  const onFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setUploading(true);
    const field = event.currentTarget as FormFieldsType;
    const imageField = field[2] as unknown as HTMLInputElement;
    const imageInput = imageField.files && imageField.files[0];

    if (field && field[0] && field[1] && field[2]) {
      const imageRef = await uploadImage(imageInput);
      await createAuctionItem({ title: field[0].value, subtitle: field[1].value, imageURL: imageRef });
    }
    setUploading(false);
    onClose(false);
  };

  useEffect(() => {
    if (uploading) {
      setTimeout(() => setUploading(false), 5000)
    }
  }, [uploading])

  return (
    <>
      <Button
        variant="plain"
        onClick={() => onClose(true)}
      >
        + Create auction item
      </Button>
      <Modal open={Boolean(open)} onClose={() => onClose(false)}>
        <ModalDialog
          aria-labelledby="basic-modal-dialog-title"
          aria-describedby="basic-modal-dialog-description"
          sx={{
            maxWidth: 500,
            borderRadius: 'md',
            p: 3,
            boxShadow: 'lg',
          }}
        >
          <Typography
            id="basic-modal-dialog-title"
            component="h2"
            level="inherit"
            fontSize="1.25em"
            mb="0.25em"
          >
            Create new listing
          </Typography>
          <Typography
            id="basic-modal-dialog-description"
            mt={0.5}
            mb={2}
            textColor="text.tertiary"
          >
            Fill in the information of the listing.
          </Typography>
          <form
            onSubmit={onFormSubmit}
          >
            <Stack spacing={2}>
              <TextField id="name" label="Name" autoFocus required />
              <TextField id="description" label="Description" required />
              <FormControl>
                <FormLabel required>Label</FormLabel>
                <Input id="image" type="file" required />
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </>
  );
}