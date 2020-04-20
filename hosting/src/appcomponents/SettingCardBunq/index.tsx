import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardActions, Divider, Typography, CircularProgress } from '@material-ui/core';

import { useSession } from 'hooks';
import { fetchBackend, refreshOauth } from 'helpers';
import { Button, OauthAuthorize, OauthReceiver } from 'components';

const useStyles = makeStyles(() => ({
  deleteButton: {
    color: 'red',
  },
  progress: {},
  button: {},
}));

export const settings = {
  redirectUrl: '/bunq',
  exchangeUrl: '/api/bunq/oauth/exchange',
  refreshUrl: '/api/bunq/oauth/refresh',
  formatUrl: '/api/oauth/formaturl/bunq',
  saveSettings: (ref: any, bunqConfig: any) => async (accesstoken: any) => {
    if (bunqConfig === undefined) bunqConfig = {};
    bunqConfig['success'] = accesstoken.success;
    bunqConfig['environment'] = 'PRODUCTION';
    ref.update({ bunq: bunqConfig });
    if (accesstoken.success) {
      //setLoadBunqData(true);
    }
  },
  deleteSettings: async (ref: any) => {
    await ref.update({ bunq: { success: false } });
  },
};

const SettingCardBunq: any = ({ action }: any): any => {
  const classes = useStyles();
  const { user, userInfo, ref } = useSession();
  const { t } = useTranslation();

  const [loadingToken, setLoadingToken] = useState(false);

  const createBunqSandbox = async () => {
    setLoadingToken(true);
    const data = await fetchBackend('/api/bunq/sandbox', { user });
    console.log(data);
    await ref.update({ bunq: { success: true, environment: 'SANDBOX' } });
    setLoadingToken(false);
  };

  if (loadingToken) return <CircularProgress className={classes.progress} />;

  return (
    <Card>
      <CardHeader subheader="Connect" title="Bunq" />
      <Divider />
      <CardContent>
        <Typography>
          {userInfo.bunq.success
            ? 'Connectie succesvol'
            : 'Bunq connectie is niet gemaakt. Deze is nodig om de data op te kunnen halen.'}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions>
        <OauthAuthorize
          formatUrl={settings.formatUrl}
          formatUrlKey="format_url_bunq"
          title={t('buttons.connect') + ' bunq'}
        />
        <Button className={classes.button} color="primary" onClick={createBunqSandbox} variant="contained">
          {t('buttons.delete') + ' bunq sandbox'}
        </Button>
        <Button
          className={classes.deleteButton}
          onClick={() => {
            settings.deleteSettings(ref);
          }}
          variant="outlined"
        >
          {t('buttons.delete')}
        </Button>
      </CardActions>
    </Card>
  );
};

export default SettingCardBunq;
