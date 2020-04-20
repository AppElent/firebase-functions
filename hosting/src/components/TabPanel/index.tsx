import React from 'react';
import { Typography } from '@material-ui/core';

const TabPanel = ({ children, tab, tabKey, lazyLoad, ...other }: any): JSX.Element => {
  const visible = tab === tabKey;
  const loadTab = lazyLoad && !visible ? false : true;

  return (
    <Typography component="div" hidden={!visible} id={`simple-tabpanel_${tab}`} role="tabpanel" {...other}>
      {loadTab && children}
    </Typography>
  );
};

export default TabPanel;
