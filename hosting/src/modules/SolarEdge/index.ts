import { fetchBackend } from 'helpers';

const getEnelogicData = async (user: any, url: string, config: any) => {
  url += '?access_token=' + config.token.access_token;
  if (!config.measuringpoints) throw Error('Geen measuringpoints');
  if (config.measuringpoints.electra) {
    url += '&mpointelectra=' + config.measuringpoints.electra.id;
  }
  if (config.measuringpoints.gas) {
    url += '&mpointgas=' + config.measuringpoints.gas.id;
  }
  const data = await fetchBackend(url, { user });
  console.log(url, data);
  return data;
};

export const saveSolarEdgeSettings = (user: any, ref: any) => async (state: any) => {
  let config: any = {};

  config.token = state.key.value;
  try {
    const sites = await fetchBackend('/api/solaredge/sites?access_token=' + state.key.value, { user });
    config.site = sites.data.sites.site[0];
    const equipment = await fetchBackend(
      '/api/solaredge/' + config.site.id + '/equipment?access_token=' + state.key.value,
      { user },
    );
    config.equipment = equipment.data.reporters.list[0];
    config.success = true;
    console.log(config);
  } catch (err) {
    console.log(err);
    config = { success: false };
    alert('API key is onjuist');
  }
  await ref.update({ solaredge: config });
};

export const deleteSolarEdgeSettings = async (ref: any) => {
  await ref.update({ solaredge: { success: false } });
};
