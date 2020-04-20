import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Moment from 'react-moment';
import { useSnackbar } from 'notistack';

import { useFetch } from 'hooks';
import { Table, Button } from 'components';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(1),
  },
  content: {
    marginTop: theme.spacing(1),
  },
  spacer: {
    flexGrow: 1,
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
  },
}));

const Events = (): any => {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const [all, setAll] = useState(false);
  const { data, loading, error, request } = useFetch('/api/events', {
    cacheKey: 'events_' + (all ? 'all' : 'lastweek'),
  });

  useEffect(() => {
    request.get(false, { query: all ? '' : '?scope=last_week' });
  }, [all]);

  const columns = [
    {
      title: 'Datum/tijd',
      field: 'datetime',
      render: (rowData: any): any => <Moment date={rowData.datetime} format="YYYY-MM-DD HH:mm" />, //eslint-disable-line
    },
    {
      title: 'Application',
      field: 'application',
    },
    {
      title: 'Category',
      field: 'category',
    },
    {
      title: 'Event',
      field: 'value',
    },
  ];

  useEffect(() => {
    if (error) {
      //enqueueSnackbar(JSON.stringify(error), { variant: 'error' });
    }
  }, [error]);

  return (
    <div className={classes.root}>
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          color="primary"
          onClick={(): void => {
            setAll(all => !all);
          }}
          variant="contained"
        >
          {all ? 'Last week' : 'All'}
        </Button>
      </div>
      <div className={classes.content}>
        <Table columns={columns} data={data} isLoading={loading} title="Events" />
      </div>
    </div>
  );
};

export default Events;
