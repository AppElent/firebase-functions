import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useFetch } from 'hooks';
import SettingCardTado from 'appcomponents/SettingCardTado';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}));

const TestPage = (): any => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { request } = useFetch('/api/events', {});

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item md={7} xs={12}>
          <SettingCardTado />
          {t('greet')}
          {t('greetName', { name: 'Eric' })}
          <button
            onClick={(): void => {
              request.get();
            }}
          >
            Get data
          </button>
          <button
            onClick={(): void => {
              request.post({ value: 'test123' });
            }}
          >
            Post data
          </button>
          <button
            onClick={(): void => {
              request.put(2, { value: 'test1234' });
            }}
          >
            Put data
          </button>
          <button
            onClick={(): void => {
              request.destroy(3);
            }}
          >
            Delete data
          </button>
        </Grid>
        <Grid item md={5} xs={12}>
          <p>asd</p>
        </Grid>
      </Grid>
    </div>
  );
};

export default TestPage;
