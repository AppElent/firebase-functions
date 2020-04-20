import React from 'react';
import clsx from 'clsx';
import PropTypes, { InferProps } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  InputLabel,
  FormControl,
  Grid,
  TextField,
  Theme,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import { useSession, useForm } from 'hooks';
import { Button, ResponsiveSelect, ResponsiveSelectItem } from 'components';

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

const AccountDetails: any = (props: InferProps<typeof AccountDetails.propTypes>): JSX.Element => {
  const { className, ...rest } = props;

  const { user, firebase } = useSession();
  const { t, i18n } = useTranslation();

  const classes = useStyles();

  const saveUserInfo = (user: firebase.User) => async (state: any): Promise<void> => {
    console.log(user, state);
    await user.updateProfile({
      displayName: state.name.value,
    });
    return;
  };

  const { isDirty, state, submitting, handleOnChange, handleOnSubmit }: any = useForm(
    { name: user.displayName, email: user.email, phone: user.phoneNumber },
    {},
    saveUserInfo(user),
  );

  return (
    <Card {...rest} className={clsx(classes.root, className)}>
      <form autoComplete="off" noValidate>
        <CardHeader subheader={t('greetName', { name: user.displayName })} title={'Profile'} />
        <Divider />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('profile.name')}
                margin="dense"
                name="name"
                onChange={handleOnChange}
                required
                value={state.name.value}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('profile.email')}
                margin="dense"
                name="email"
                onChange={handleOnChange}
                required
                value={state.email.value}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                fullWidth
                label={t('profile.phone')}
                margin="dense"
                name="phone"
                onChange={handleOnChange}
                type="text"
                value={state.phone.value || ''}
                variant="outlined"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="from-account-placeholder" shrink>
                  {t('profile.language')}
                </InputLabel>
                <ResponsiveSelect
                  inputProps={{
                    name: 'lng',
                    id: 'lng',
                  }}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => {
                    i18n.changeLanguage(e.target.value);
                  }}
                  value={i18n.language}
                >
                  <ResponsiveSelectItem value="en">English</ResponsiveSelectItem>
                  <ResponsiveSelectItem value="nl">Nederlands</ResponsiveSelectItem>
                </ResponsiveSelect>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions>
          <Button color="primary" disabled={!isDirty} loading={submitting} onClick={handleOnSubmit} variant="contained">
            {t('buttons.save')}
          </Button>
          <Button color="primary" onClick={(): void => firebase.auth().signOut()} variant="contained">
            {t('buttons.logout')}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string,
};

export default AccountDetails;
