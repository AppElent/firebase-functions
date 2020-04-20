import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { InferProps } from 'prop-types';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    marginLeft: theme.spacing(3),
  },
  spinner: {
    color: 'white',
  },
}));

const LoadingButton: any = (props: InferProps<typeof LoadingButton.propTypes>): JSX.Element => {
  const classes = useStyles();
  const { children, loading, ...rest } = props;
  return (
    <Button disabled={loading} {...rest}>
      {!loading && children}
      {loading && <CircularProgress className={classes.spinner} size={20} />}
    </Button>
  );
};

export default LoadingButton;
