import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Tab, Tabs, Theme } from '@material-ui/core';

import { OauthReceiver, TabPanel } from 'components';
import { useQueryParams, useSession, useTabs } from 'hooks';
import Overzicht from './components/Overzicht';
import KostenOverzicht from './components/KostenOverzicht';
import Settings from './components/Settings';
import Live from './components/Live';
import { saveEnelogicSettings } from 'modules/Enelogic';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //padding: theme.spacing(3)
  },
}));

const Meterstanden = () => {
  const classes = useStyles();
  const { userInfo } = useSession();

  const { tab, handleTabChange } = useTabs('live');

  if (!userInfo.enelogic.success) {
    if (tab === 'overzicht') handleTabChange(null, 'settings');
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
            <Tab label="Live" value="live" />
            <Tab label="Overzicht" value="overzicht" disabled={!userInfo.enelogic.success} />
            <Tab label="Kosten overzicht" value="kostenoverzicht" />
            <Tab label="Instellingen" value="settings" />
          </Tabs>
        </AppBar>
        <TabPanel tab={tab} tabKey="live">
          <Live />
        </TabPanel>
        <TabPanel tab={tab} tabKey="overzicht">
          <Overzicht />
        </TabPanel>
        <TabPanel tab={tab} tabKey="kostenoverzicht">
          <KostenOverzicht />
        </TabPanel>
        <TabPanel tab={tab} tabKey="settings">
          <Settings />
        </TabPanel>
      </div>
    </div>
  );
};

export default Meterstanden;
