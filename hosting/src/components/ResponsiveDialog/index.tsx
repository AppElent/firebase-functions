import React from 'react';
import { Dialog, DialogTitle, AppBar, Toolbar, IconButton, Typography, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { InferProps } from 'prop-types';

import useCustomMediaQuery from 'hooks/useCustomMediaQuery';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
    color: 'white',
  },
}));

const ResponsiveDialog: any = (props: InferProps<typeof ResponsiveDialog.propTypes>) => {
  const classes = useStyles();
  const { children, onClose, title, open, ...rest } = props;
  const isDesktop = useCustomMediaQuery();

  if (isDesktop) {
    return (
      <Dialog open={open} {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        {children}
      </Dialog>
    );
  }

  return (
    <Dialog open={open} fullScreen {...rest}>
      {!isDesktop && (
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {title}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      {children}
    </Dialog>
  );
};

export default ResponsiveDialog;
