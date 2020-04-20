import React, { useState } from 'react';
import { Button, Checkbox, FormControlLabel, Typography } from '@material-ui/core';
import { useParams } from 'react-router-dom';

import { useSession, useQueryParams } from 'hooks';
import { OauthAuthorize, OauthReceiver } from 'components';
import { refreshOauth } from 'helpers';

import { settings as enelogicSettings } from 'appcomponents/SettingCardEnelogic';
import { settings as bunqSettings } from 'appcomponents/SettingCardBunq';

const OAuthPage = (): JSX.Element => {
  const session = useSession();
  const queryParams = useQueryParams();
  const urlParams: any = useParams();
  const action = urlParams.action.toLowerCase();
  const [forceRefresh, setForceRefresh] = useState(false);

  if (!['display', 'format', 'exchange', 'refresh'].includes(action)) {
    return <div>Geen geldige actie</div>;
  }

  const oauthConfig: any = {
    bunq: bunqSettings,
    enelogic: enelogicSettings,
  };

  const name = urlParams.name.toLowerCase();
  const oauthSettings: any = oauthConfig[name];
  if (!oauthSettings) {
    return <>Setting niet gevonden</>;
  }

  if (action === 'format') {
    return <OauthAuthorize title={name} formatUrl={oauthSettings.formatUrl} formatUrlKey={'format_url_' + name} />;
  }
  if (action === 'exchange') {
    if (queryParams.code) {
      return (
        <OauthReceiver
          code={queryParams.code}
          exchangeUrl={oauthSettings.exchangeUrl}
          redirectUrl={oauthSettings.redirectUrl}
          saveFunction={oauthSettings.saveSettings}
          state={queryParams.state}
        />
      );
    } else {
      return <div>Geen code</div>;
    }
  }
  if (action === 'refresh') {
    const updateFunction = oauthSettings.updateSettings ?? oauthSettings.saveSettings;
    const refreshToken = async () => {
      const refreshedtoken = await refreshOauth(
        session,
        '/api/oauth/refresh/enelogic',
        session.userInfo.enelogic.token,
        updateFunction,
        forceRefresh,
      );
      if (refreshedtoken) {
        console.log(refreshedtoken);
      }
    };

    return (
      <div>
        <Typography variant="h1">OAuth 2.0 refresh</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={forceRefresh}
              onChange={() => {
                setForceRefresh(!forceRefresh);
              }}
              name="checkedA"
            />
          }
          label="Forceer"
        />
        <Button color="primary" variant="contained" onClick={refreshToken}>
          Refresh
        </Button>
      </div>
    );
  }

  return <div> Nothing to show here.. </div>;
};

export default OAuthPage;
