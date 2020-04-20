import { fetchBackend } from 'helpers';
import moment from 'moment';

export const getEnelogicData = async (user: any, url: string, config: any) => {
  url += '?access_token=' + config.token.access_token;
  if (!config.measuringpoints) throw Error('Geen measuringpoints');
  if (config.measuringpoints.electra) {
    url += '&mpointelectra=' + config.measuringpoints.electra.id;
  }
  if (config.measuringpoints.gas) {
    url += '&mpointgas=' + config.measuringpoints.gas.id;
  }
  const data = await fetchBackend(url, { user });
  return data;
};

const getDifferenceArray = async (array: any, id: string, columnArray: any) => {
  const savedItems: any = {};
  //savedItems['first'] = array[0];
  savedItems['previous'] = array[0];
  for (const item of array) {
    const index = array.findIndex((e: any) => e[id] === item[id]);
    for (const column of columnArray) {
      if (column in savedItems) {
      }
      const difference = item[column] - savedItems['previous'][column];

      array[index][column + '_diff'] = difference;
    }
    savedItems['previous'] = item;
  }
  return array;
};

const setVerbruikDates = async (data: any, timeframe: any) => {
  timeframe = timeframe.toLowerCase();
  let newData = await data.map((item: any) => {
    if (timeframe === 'day') {
      item.datetimeVerbruik = moment(item.datetime)
        .add(-1, 'days')
        .format('YYYY-MM-DD');
    } else if (timeframe === 'month') {
      item.datetimeVerbruik = moment(item.datetime)
        .add(-1, 'month')
        .format('YYYY-MM');
    } else if (timeframe === 'year') {
      item.datetimeVerbruik = moment(item.datetime)
        .add(-1, 'year')
        .format('YYYY');
    } else if (timeframe === 'quarter_of_an_hour') {
      item.datetimeVerbruik = moment(item.datetime)
        .add(-15, 'minutes')
        .format('YYYY-MM-DD HH:mm');
    }
    return item;
  });
  newData = newData.filter((item: any, index: number) => index > 0);
  return newData;
};

const addSolarEdgeData = async (
  data: any,
  start: string,
  end: string,
  timeframe: string,
  solarEdgeConfig: any,
  user: any,
) => {
  const solarEdgeUrl =
    '/api/solaredge/' +
    solarEdgeConfig.site.id +
    '/data/' +
    timeframe +
    '/' +
    start +
    '/' +
    end +
    '?access_token=' +
    solarEdgeConfig.access_token;
  try {
    let solaredgedata = await fetchBackend(solarEdgeUrl, { user });
    solaredgedata = solaredgedata.data.energy.values;
    for (const item of data) {
      item['opwekking'] = null;
      const solaredgeitem = solaredgedata.find((entry: any) =>
        moment(entry.date).isSame(moment(item.datetimeVerbruik)),
      );
      if (solaredgeitem !== undefined && solaredgeitem.value !== null) {
        item['opwekking'] = Math.round(parseFloat(solaredgeitem.value));
      }
    }
  } catch (err) {
    return data;
  }

  return data;
};

const addNetto = async (data: any) => {
  data.forEach((item: any, i: number) => {
    data[i]['netto'] = item['180_diff'] - item['280_diff'];
    data[i]['netto_laag'] = item['181_diff'] - item['281_diff'];
    data[i]['netto_hoog'] = item['182_diff'] - item['282_diff'];
  });
  return data;
};

const addBruto = async (data: any) => {
  data.forEach((item: any, i: number) => {
    data[i]['bruto'] = item['180_diff'];
    if (item.opwekking !== undefined) {
      data[i]['bruto'] = item['180_diff'] + item.opwekking - item['280_diff'];
    }
  });
  return data;
};

export const getData = async (user: any, datefrom: string, dateto: string, config: any) => {
  const momentdatefrom = moment(datefrom);
  const momentdateto = moment(dateto);
  if (momentdateto.isBefore(momentdatefrom)) throw 'Date to is before date from.';
  const isDayQuery = momentdatefrom.isSame(momentdateto, 'day') ? true : false;
  const daysBetween = momentdateto.diff(momentdatefrom, 'days');
  const timeframe = isDayQuery
    ? 'QUARTER_OF_AN_HOUR'
    : daysBetween > 60
    ? daysBetween > 364
      ? 'YEAR'
      : 'MONTH'
    : 'DAY';

  //if(timeframe === 'QUARTER_OF_AN_HOUR') momentdateto = momentdatefrom.clone().add(1, 'days');
  let dataUrl = '/api/enelogic/data/' + timeframe + '/';
  if (isDayQuery) {
    dataUrl +=
      momentdatefrom.format('YYYY-MM-DD') +
      '/' +
      momentdatefrom
        .clone()
        .add(1, 'days')
        .format('YYYY-MM-DD');
  } else if (timeframe === 'DAY') {
    dataUrl +=
      momentdatefrom.format('YYYY-MM-DD') +
      '/' +
      momentdateto
        .clone()
        .add(1, 'days')
        .format('YYYY-MM-DD');
  } else if (timeframe === 'MONTH') {
    dataUrl +=
      momentdatefrom
        .clone()
        .subtract(1, 'month')
        .format('YYYY-MM-DD') +
      '/' +
      momentdateto
        .clone()
        .add(1, 'days')
        .format('YYYY-MM-DD');
  } else if (timeframe === 'YEAR') {
    dataUrl =
      '/api/enelogic/data/year/' +
      momentdatefrom
        .clone()
        .subtract(1, 'year')
        .format('YYYY-MM-DD') +
      '/' +
      momentdateto
        .clone()
        .add(1, 'days')
        .format('YYYY-MM-DD');
  }
  let data = await getEnelogicData(user, dataUrl, config.enelogic);
  data = await getDifferenceArray(data, 'datetime', ['180', '181', '182', '280', '281', '282']);
  data = await setVerbruikDates(data, timeframe);
  data = await addNetto(data);
  if (config.solaredge.success) {
    data = await addSolarEdgeData(
      data,
      momentdatefrom.format('YYYY-MM-DD'),
      momentdateto.format('YYYY-MM-DD'),
      timeframe,
      config.solaredge,
      user,
    );
    data = await addBruto(data);
  }

  return data;
};

export const saveEnelogicSettings = async (session: any, accesstoken: any) => {
  console.log('beginSaveEnelogicToken', accesstoken);
  const saveObject: any = {};
  if (!accesstoken.success) {
    await session.ref.update({ enelogic: { success: false } });
    return;
  }
  saveObject['token'] = accesstoken.data.token;
  try {
    const measuringpoints = await fetchBackend(
      '/api/enelogic/measuringpoints?access_token=' + accesstoken.data.token.access_token,
      { user: session.user },
    );
    saveObject.measuringpoints = {};
    const mpointelectra = measuringpoints.data.find((item: any) => item.active === true && item.unitType === 0);
    if (mpointelectra !== undefined) saveObject.measuringpoints.electra = mpointelectra;
    const mpointgas = measuringpoints.data.find((item: any) => item.active === true && item.unitType === 1);
    if (mpointgas !== undefined) saveObject.measuringpoints.gas = mpointgas;
    saveObject.success = true;
  } catch (err) {
    console.log(err);
    saveObject.success = false;
  }
  console.log(saveObject);
  await session.ref.update({ enelogic: saveObject });
};

export const updateEnelogicSettings = async (session: any, accesstoken: any) => {
  const saveObject: any = {};
  if (!accesstoken.success) {
    await session.ref.update({ enelogic: { success: false } });
    return;
  }
  saveObject['token'] = accesstoken.data.token;
  saveObject['success'] = true;
  await session.ref.update({ enelogic: saveObject });
};

export const deleteEnelogicSettings = async (ref: any) => {
  await ref.update({ enelogic: { success: false } });
};

export const getMeasuringPoints = async () => {
  console.log(123);
};
