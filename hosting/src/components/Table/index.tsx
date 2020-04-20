/* eslint-disable react/no-multi-comp */

import React from 'react';
import MaterialTable, { MTableEditField } from 'material-table';

const getDataObject = (data: any, columns: any) => {
  if (columns !== undefined) {
    const keys = Object.keys(data);
    for (const objectkey of keys) {
      const foundColumn = columns.find((column: any) => column.field === objectkey);
      if (foundColumn !== undefined) {
        if (foundColumn.type && foundColumn.type === 'numeric') {
          data[objectkey] = parseInt(data[objectkey]);
        }
      }
    }
  }
  return data;
};

const checkDataObject = (data: any, columns: any) => {
  if (columns !== undefined) {
    columns.forEach((column: any) => {
      if (column.required && column.required === true && !data[column.field] && data[column.field] !== 0) {
        console.log('Column ' + column.field + ' is mandatory', data[column.field], data);
        alert('Column "' + column.title + '" is verplicht');
        throw new Error('Column ' + column.field + ' is mandatory');
      }
    });
  }
};

export const addData = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
};

export const updateData = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
};

export const deleteData = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).delete();
};

export const addDataDoc = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.set(data);
};

export const updateDataDoc = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  checkDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).set(data);
};

export const deleteDataDoc = (ref: any, prop: string, columns: any) => async (data: any) => {
  data = getDataObject(data, columns);
  console.log(data);
  await ref.doc(data[prop]).delete();
};

export const RequiredField = (props: any): JSX.Element => {
  if (props.columnDef.required && props.value === undefined) {
    return <MTableEditField {...props} />;
  }
  if (props.columnDef.required && props.value.length === 0) {
    return <MTableEditField {...props} error label="Required" />;
  }
  return <MTableEditField {...props} />;
};

const Table = (props: any): any => {
  let { options, ...rest } = props; //eslint-disable-line

  if (options === undefined) options = {};
  if (!options.padding) options.padding = 'dense';
  if (options.exportButton && !options.exportDelimiter) options.exportDelimiter = ';';
  if (!options.pageSize) options.pageSize = 10;

  return (
    <MaterialTable
      components={{
        EditField: RequiredField,
      }}
      options={options}
      {...rest}
    />
  );
};

export default Table;
