import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tabs, Tab, Theme } from '@material-ui/core';

import { useSession, useQueryParams, useTabs, useFirestoreCollectionDataOnce } from 'hooks';
//import { fetchBackend, groupData } from 'helpers';
import { OauthReceiver, TabPanel } from 'components';
import AccountsPage from './components/AccountsPage';
import Overboeken from './components/Overboeken';
import Settings from './components/Settings';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //padding: theme.spacing(3)
  },
}));

const Bunq = ({ match }: any) => {
  const { user, userInfo, ref } = useSession();
  const classes = useStyles();
  const params = useQueryParams();
  //const {data: accountdata, loading, error, request} = useFetch('/api/bunq/accounts', {cacheKey: 'bunq_accounts'});

  const [rekeningen, rekeningenLoading, rekeningenError, rekeningenRef] = useFirestoreCollectionDataOnce(
    ref.collection('rekeningen'),
  );
  //const [loadBunqData, setLoadBunqData] = useState(undefined);
  const { tab, handleTabChange } = useTabs('overzicht');

  const saveBunqSettings = (ref: any, bunqConfig: any) => async (accesstoken: any) => {
    if (bunqConfig === undefined) bunqConfig = {};
    bunqConfig['success'] = accesstoken.success;
    bunqConfig['environment'] = 'PRODUCTION';
    ref.update({ bunq: bunqConfig });
    if (accesstoken.success) {
      //setLoadBunqData(true);
    }
  };

  //if there is a query-param named code, the OauthReceiver is returned
  if (params.code !== undefined)
    return (
      <OauthReceiver
        code={params.code}
        exchangeUrl="/api/bunq/oauth/exchange"
        saveFunction={saveBunqSettings(ref, userInfo.bunq)}
      />
    );

  if (!userInfo.bunq.success) {
    if (tab !== 'settings') handleTabChange(null, 'settings');
  }

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            aria-label="simple tabs example"
            onChange={handleTabChange}
            scrollButtons="auto"
            value={tab}
            variant="scrollable"
          >
            <Tab label="Rekening overzicht" value="overzicht" />
            <Tab label="Overboeken" value="overboeken" />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        <TabPanel lazyLoad={true} tab={tab} tabKey="overzicht">
          {tab === 'overzicht' && <AccountsPage />}
        </TabPanel>
        <TabPanel lazyLoad={true} tab={tab} tabKey="overboeken">
          <Overboeken />
        </TabPanel>
        <TabPanel lazyLoad={true} tab={tab} tabKey="settings">
          <Settings />
        </TabPanel>
      </div>
    </div>
  );
};

export default Bunq;
