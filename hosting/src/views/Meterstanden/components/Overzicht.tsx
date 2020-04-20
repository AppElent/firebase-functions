import React, { useState, useRef } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { makeStyles } from '@material-ui/styles';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import { Button, Table } from 'components';
import { refreshOauth } from 'helpers';
import { updateEnelogicSettings, getData } from 'modules/Enelogic';
import { useForm, useSession } from 'hooks';
import { Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    //padding: theme.spacing(3)
  },
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  spacer: {
    flexGrow: 1,
  },
  content: {
    padding: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  button: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(1),
  },
}));

const Overzicht = () => {
  const classes = useStyles();
  const session = useSession();
  const userInfoRef = useRef(session.userInfo);
  const [data, setData] = useState([]);
  //userInfoRef.current = userInfo;

  const datefrom = (moment().date() < 3
    ? moment()
        .startOf('month')
        .add(-1, 'month')
    : moment().startOf('month')
  ).toDate(); //
  const dateto = moment()
    .add(-1, 'days')
    .toDate();

  const haalDataOp = () => async (state: any) => {
    try {
      const refreshedtoken = await refreshOauth(
        session,
        '/api/oauth/refresh/enelogic',
        session.userInfo.enelogic.token,
        updateEnelogicSettings,
      );
      session.log.trace(refreshedtoken);
      const data = await getData(session.user, state.datefrom.value, state.dateto.value, userInfoRef.current);
      session.log.trace(data);
      setData(data);
    } catch (err) {
      session.log.error(err);
    }
  };

  const { state, handleOnValueChange, handleOnSubmit, submitting } = useForm({ datefrom, dateto }, {}, haalDataOp());

  if (!session?.userInfo?.enelogic?.success) return <div></div>;

  const columns = [
    {
      title: 'Datum',
      field: 'datetime_verbruik',
    },
    {
      title: 'KwH verbruik laag',
      field: '181',
      render: (rowData: any) => rowData['181'] + ' (' + rowData['181_diff'] + ')',
    },
    {
      title: 'KwH verbruik hoog',
      field: '182',
      render: (rowData: any) => rowData['182'] + ' (' + rowData['182_diff'] + ')',
    },
    {
      title: 'Verbruik totaal',
      field: '180',
      render: (rowData: any) => rowData['180'] + ' (' + rowData['180_diff'] + ')',
    },
    {
      title: 'KwH teruglevering laag',
      field: '281',
      render: (rowData: any) => rowData['281'] + ' (' + rowData['281_diff'] + ')',
    },
    {
      title: 'KwH teruglevering hoog',
      field: '282',
      render: (rowData: any) => rowData['282'] + ' (' + rowData['282_diff'] + ')',
    },
    {
      title: 'Teruglevering totaal',
      field: '280',
      render: (rowData: any) => rowData['280'] + ' (' + rowData['280_diff'] + ')',
    },
    {
      title: 'Netto laag',
      field: 'netto_laag',
    },
    {
      title: 'Netto hoog',
      field: 'netto_hoog',
    },
    {
      title: 'Netto totaal',
      field: 'netto',
    },
  ];
  if (session.userInfo.solaredge.success)
    columns.push(
      {
        title: 'Opwekking',
        field: 'opwekking',
      },
      {
        title: 'Bruto',
        field: 'bruto',
      },
    );

  return (
    <div>
      <div className={classes.root}>
        <div className={classes.row}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
              autoOk
              disableToolbar
              format="yyyy-MM-dd"
              id="date-picker-datefrom"
              KeyboardButtonProps={{
                'aria-label': 'change date from',
              }}
              label="Datum vanaf"
              margin="normal"
              minDate={new Date(session.userInfo.enelogic.measuringpoints.electra.dayMin)}
              onChange={handleOnValueChange('datefrom')}
              value={state.datefrom.value}
              variant="inline"
            />
            <KeyboardDatePicker
              autoOk
              disableToolbar
              format="yyyy-MM-dd"
              id="date-picker-dateto"
              KeyboardButtonProps={{
                'aria-label': 'change date to',
              }}
              label="Datum tot"
              margin="normal"
              onChange={handleOnValueChange('dateto')}
              value={state.dateto.value}
              variant="inline"
            />
          </MuiPickersUtilsProvider>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleOnSubmit}
            loading={submitting}
          >
            Haal op
          </Button>
        </div>
        <div className={classes.content}>
          <Table columns={columns} data={data} title="Meterstanden" />
        </div>
      </div>
    </div>
  );
};

export default Overzicht;
