import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';

import { useSession, useFetch } from 'hooks';

const OauthAuthorize = ({
  formatUrlKey,
  title,
  formatUrl,
}: {
  formatUrlKey: string;
  title: string;
  formatUrl: string;
}): JSX.Element => {
  const { user } = useSession();

  const { data: url, request } = useFetch(formatUrl, {
    cacheKey: formatUrlKey,
    initialData: '',
  });

  useEffect(() => {
    request.get();
  }, [formatUrl, user]);

  return (
    <Button color="primary" disabled={url === ''} href={url} variant="contained">
      {title}
    </Button>
  );
};

export default OauthAuthorize;
