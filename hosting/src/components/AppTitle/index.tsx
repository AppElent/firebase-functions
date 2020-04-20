import React from 'react';
import { Typography } from '@material-ui/core';

const AppTitle: React.FC = (): JSX.Element => {
  return (
    <Typography variant="h3" style={{ color: 'white' }}>
      Administratie App
    </Typography>
  );
};

export default AppTitle;
