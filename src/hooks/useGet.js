import React, { useContext, useEffect, useState } from 'react';

import Context from '../context';
import useFetch from './useFetch';

export default ({
  name,
  path,
  defaultValue,
  params = {},
  headers = {},
  replace = {},
  memoize = false,
  transform,
  paramsSerializer
}) => {
  const replaceParams = (str = '') => str.replace(/:(\w+)/, (_, group) => replace[group]);

  const { setData, getData, setBusy, getBusy } = useContext(Context);
  const [resourceData, setResourceData] = useState(defaultValue);
  name = replaceParams(name);
  const currentValue = getData(name) || defaultValue;
  const refreshName = `refresh.${name}`;
  const { get } = useFetch({ transform, path, paramsSerializer });

  useEffect(() => {
    fetchItems();
    window.addEventListener(refreshName, handleRefresh);

    return () => {
      window.removeEventListener(refreshName, handleRefresh);
    };
  }, [name, JSON.stringify(path), JSON.stringify(params), JSON.stringify(headers)]);

  const handleRefresh = () => fetchItems();

  const fetchItems = async () => {
    if (memoize && currentValue !== defaultValue) {
      setResourceData(currentValue);
      return;
    }

    setBusy(name);
    const data = await get({ params, headers, replace });
    setBusy(name, false);

    setData(name, data);
    setResourceData(data);
  };

  return { data: resourceData, busy: getBusy(name) };
};
