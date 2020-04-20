import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardContent, CardActions, Divider, TextField } from '@material-ui/core';

import { useSession, useForm } from 'hooks';
import { Button } from 'components';
import { fetchBackend } from 'helpers';

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
  saveSettings: (session: any, state: any) => {
    console.log(session, state);
  },
  deleteSettings: (ref: any) => () => {
    ref.update({ solaredge: { success: false } });
  },
};

const saveTadoSetings = (session: any) => async (state: any) => {
  console.log(session, state);
  try {
    const token = await fetchBackend('/api/oauth/exchange/tado', {
      user: session.user,
      method: 'POST',
      body: { username: state.username.value, password: state.password.value },
    });
    const homes = await fetchBackend('/api/tado/me?access_token=' + token.data.token.access_token, {
      user: session.user,
    });
    session.ref.update({
      tado: {
        success: true,
        token: token.data.token,
        username: state.username.value,
        password: state.password.value,
        homes,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

const SettingCardTado = ({}) => {
  const classes = useStyles();
  const session = useSession();
  const { t } = useTranslation();
  const { hasError, isDirty, state, handleOnChange, handleOnSubmit, submitting, setInitial } = useForm(
    { username: session.userInfo.tado.username || '', password: session.userInfo.tado.password || '' },
    {},
    saveTadoSetings(session),
  );

  return (
    <Card>
      <CardHeader subheader="Set Tado credentials" title="Tado" />
      <Divider />
      <CardContent>
        <TextField
          fullWidth
          helperText={session.userInfo.tado.success ? 'Configuratie is succesvol' : ''}
          label="Username"
          name="username"
          onChange={handleOnChange}
          type="text"
          value={state.username.value || ''}
          variant="outlined"
        />
        <TextField
          fullWidth
          helperText={session.userInfo.tado.success ? 'Configuratie is succesvol' : ''}
          label="Password"
          name="password"
          onChange={handleOnChange}
          type="password"
          value={state.password.value || ''}
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
            session.ref.update({ tado: { success: false } });
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

export default SettingCardTado;
