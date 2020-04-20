import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme } from '@material-ui/core';

import { useFetch } from 'hooks';
import { Table } from 'components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  textfields: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  button: {
    marginTop: theme.spacing(1),
  },
  row: {},
}));

const Live = ({}) => {
  const classes = useStyles();
  const { data, loading, error, request } = useFetch('/api/meterstanden', { onMount: true });

  const columns = [
    {
      title: 'Datum',
      field: 'datetime',
    },
    {
      title: 'KwH verbruik laag',
      field: '181',
    },
    {
      title: 'KwH verbruik hoog',
      field: '182',
    },
    {
      title: 'Verbruik totaal',
      field: '180',
    },
    {
      title: 'KwH teruglevering laag',
      field: '281',
    },
    {
      title: 'KwH teruglevering hoog',
      field: '282',
    },
    {
      title: 'Teruglevering totaal',
      field: '280',
    },
    {
      title: 'Netto laag',
      field: 'netto_laag',
    },
    {
      title: 'Netto hoog',
      field: 'netto_hoog',
    },
    {
      title: 'Netto totaal',
      field: 'netto',
    },
  ];

  return (
    <div className={classes.root}>
      <Table columns={columns} data={data} loading={loading} title="Live data" />
    </div>
  );
};

export default Live;
