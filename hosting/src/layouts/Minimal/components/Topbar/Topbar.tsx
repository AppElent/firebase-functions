import React from 'react';
import clsx from 'clsx';
import PropTypes, { InferProps } from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import AppTitle from 'components/AppTitle';

const useStyles = makeStyles(() => ({
  root: {
    boxShadow: 'none',
  },
}));

const Topbar: any = (props: InferProps<typeof Topbar>): JSX.Element => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <AppBar {...rest} className={clsx(classes.root, className)} color="primary" position="fixed">
      <Toolbar>
        <RouterLink to="/">
          <AppTitle />
        </RouterLink>
      </Toolbar>
    </AppBar>
  );
};

Topbar.propTypes = {
  className: PropTypes.string,
};

export default Topbar;
