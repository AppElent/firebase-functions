import { useState } from 'react';

const useMaterialUIMenu = (): any => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleOpen = (event: any): void => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return Object.assign([anchorEl, open, handleOpen, handleClose], { anchorEl, open, handleOpen, handleClose });
};

export default useMaterialUIMenu;
