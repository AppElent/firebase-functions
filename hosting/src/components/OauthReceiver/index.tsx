import React, { useState, useEffect } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from 'react-router-dom';

import { useSession } from 'hooks';
import { fetchBackend } from 'helpers';

type OauthReceiverType = {
  code: string;
  exchangeUrl: string;
  saveFunction: (session: any, token: any) => void;
  redirectUrl?: string | undefined;
  state?: string;
};

const OauthReceiver: React.FC<OauthReceiverType> = ({
  code,
  exchangeUrl,
  saveFunction,
  redirectUrl,
  state,
}: OauthReceiverType) => {
  const session = useSession();
  const [newRedirectUrl, setNewRedirectUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  console.log(redirectUrl, newRedirectUrl);
  useEffect(() => {
    let isMounted = true;
    const getToken = async () => {
      if (code !== undefined) {
        try {
          const body = { code, state };
          const accesstoken = await fetchBackend(exchangeUrl, { method: 'POST', body, user: session.user });
          if (accesstoken === undefined) return setNewRedirectUrl(redirectUrl);
          if (accesstoken.success) {
            await saveFunction(session, accesstoken);
          }
          let pathname;
          if (accesstoken?.data?.state?.origin) {
            const reg = /.+?\:\/\/.+?(\/.+?)(?:#|\?|$)/;
            const result = reg.exec('asdhgas');
            pathname = result ? result[1] : redirectUrl;
          }
          if (isMounted) setNewRedirectUrl(pathname ?? redirectUrl);
        } catch (error) {
          console.log(error);
          setError(JSON.stringify(error));
        }
      }
    };
    getToken();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return <div>Mislukt: {error}</div>;
  }

  if (newRedirectUrl === undefined) return <CircularProgress />;

  return <Redirect to={newRedirectUrl} />;
};

export default OauthReceiver;
