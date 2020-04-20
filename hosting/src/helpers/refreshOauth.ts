import moment from 'moment';
import { fetchBackend } from 'helpers';

const refreshOauth = async (
  session: any,
  url: string,
  accesstoken: any,
  saveFunction?: (session: any, token: any) => void,
  force = false,
): Promise<any> => {
  const momentexpires = moment(accesstoken.expires_at);
  if (momentexpires.add(2, 'minutes').isAfter(moment()) && force === false) {
    session.log.log('Refresh is not necessary, and force is set to false.');
    return;
  }
  session.log.log(
    'Refresh is nodig want expires is verlopen (expires, current) (of force=TRUE)',
    momentexpires.format('YYYY-MM-DD HH:mm'),
    moment().format('YYYY-MM-DD HH:mm'),
    'refreshOauth.ts, line 16',
  );
  const refreshedToken = await fetchBackend(url, { user: session.user, method: 'POST', body: { token: accesstoken } });
  if (saveFunction) {
    await saveFunction(session, refreshedToken);
  }
  return refreshedToken;
};

export default refreshOauth;
