import React, { useContext } from 'react';

import Context from '../context';

export default ({ transform, name, defaultValue }) => {
  const { getData } = useContext(Context);

  let resourceData = getData(name) || defaultValue;

  if (transform) {
    resourceData = transform(resourceData);
  }

  return resourceData;
};
