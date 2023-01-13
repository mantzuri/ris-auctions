import * as React from 'react';

import Box from '@mui/joy/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { ColorPaletteProp } from '@mui/joy/styles';
import IconButton from '@mui/joy/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import MuiAlert from '@mui/joy/Alert';
import ReportIcon from '@mui/icons-material/Report';
import Typography from '@mui/joy/Typography';
import WarningIcon from '@mui/icons-material/Warning';

type AlertType = {
  variant?: AlertVariant
  title?: string
  subtitle?: string
  open?: boolean
  onClose?: () => void
}

enum AlertVariant {
  Success,
  Warning,
  Error,
  Info,
}

const Alert = ({
  variant = AlertVariant.Success,
  title,
  subtitle,
  open = false,
  onClose,
}: AlertType) => {

  const currentState = (): {
    title: string;
    color: ColorPaletteProp;
    icon: React.ReactElement;
  } => {
    switch (variant) {
      case AlertVariant.Warning:
        return { title: 'Warning', color: 'warning', icon: <WarningIcon /> }
      case AlertVariant.Error:
        return { title: 'Error', color: 'danger', icon: <ReportIcon /> }
      case AlertVariant.Info:
        return { title: 'Info', color: 'info', icon: <InfoIcon /> }
      default:
        return { title: 'Success', color: 'success', icon: <CheckCircleIcon /> }
    }
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
      <MuiAlert
        key={title}
        sx={{ alignItems: 'flex-start' }}
        startDecorator={React.cloneElement(currentState().icon, {
          sx: { mt: '2px', mx: '4px' },
          fontSize: 'xl2',
        })}
        variant="soft"
        color={currentState().color}
        endDecorator={
          <>
            {onClose !== undefined && <IconButton onClick={onClose} variant="soft" size="sm" color={currentState().color}>
              <CloseRoundedIcon />
            </IconButton>}
          </>
        }
      >
        <div>
          <Typography fontWeight="lg" mt={0.25} sx={{ textAlign: 'start' }}>
            {title}
          </Typography>
          <Typography fontSize="sm" sx={{ opacity: 0.8 }}>
            {subtitle}
          </Typography>
        </div>
      </MuiAlert>
    </Box>
  );
}

export default Alert;