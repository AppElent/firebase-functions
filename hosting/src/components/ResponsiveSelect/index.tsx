import React from 'react';
import { Select, NativeSelect } from '@material-ui/core';

import { useCustomMediaQuery } from 'hooks';
import { InferProps } from 'prop-types';

const ResponsiveSelect: any = (props: InferProps<typeof ResponsiveSelect.propTypes>) => {
  const isDesktop = useCustomMediaQuery();

  const SelectVersion = isDesktop ? Select : NativeSelect;

  const { children, ...rest } = props;
  return <SelectVersion {...rest}>{children}</SelectVersion>;
};

export default ResponsiveSelect;
