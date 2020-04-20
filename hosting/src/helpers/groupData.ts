import _ from 'lodash';

const groupData = (key: string) => (xs: any) => {
  const object = xs.reduce(function(rv: any, x: any) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
  //let result = []
  const result = Object.entries(object).map((item: any) => {
    //const sum = this.sum(item[1], 'month_1')
    const array: any = { rekening: item[0], entries: item[1] };
    for (let i = 1; i < 13; i++) {
      const sumvalue: any = _.sumBy(item[1], 'month_' + i);
      array['month_' + i] = sumvalue;
    }
    return array;
  });
  return result;
};

export default groupData;
