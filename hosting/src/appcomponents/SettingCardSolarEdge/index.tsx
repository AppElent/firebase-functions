import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardActions, Divider, TextField } from '@material-ui/core';

import { useSession, useForm } from 'hooks';
import { Button } from 'components';
import { saveSolarEdgeSettings, deleteSolarEdgeSettings } from 'modules/SolarEdge';

const useStyles = makeStyles(theme => ({
  deleteButton: {
    color: 'red',
  },
}));

export const settings = {
  redirectUrl: '/meterstanden',
  exchangeUrl: '/api/oauth/exchange/enelogic',
  refreshUrl: '/api/oauth/refresh/enelogic',
  formatUrl: '/api/oauth/formaturl/enelogic',
  saveSettings: saveSolarEdgeSettings,
  deleteSettings: (ref: any) => () => {
    ref.update({ solaredge: { success: false } });
  },
};

const SettingCardSolaredge = ({}) => {
  const classes = useStyles();
  const { user, userInfo, ref } = useSession();
  const { t } = useTranslation();
  const { hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial } = useForm(
    { key: userInfo.solaredge.access_token || '' },
    {},
    saveSolarEdgeSettings(user, ref),
  );

  return (
    <Card>
      <CardHeader subheader="Set SolarEdge API key" title="SolarEdge" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          helperText={userInfo.solaredge.success ? 'Configuratie is succesvol' : ''}
          label="API Key"
          name="key"
          onChange={handleOnChange}
          type="password"
          value={state.key.value || ''}
          variant="outlined"
        />
      </CardContent>

      <Divider />
      <CardActions>
        <Button color="primary" disabled={!isDirty} loading={submitting} onClick={handleOnSubmit} variant="contained">
          {t('buttons.save')}
        </Button>
        <Button
          className={classes.deleteButton}
          onClick={() => {
            ref.update({ solaredge: { success: false } });
            setInitial();
          }}
          variant="outlined"
        >
          {t('buttons.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

SettingCardSolaredge.propTypes = {
  config: PropTypes.object,
};

export default SettingCardSolaredge;
