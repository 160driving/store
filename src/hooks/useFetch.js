import React, { useContext } from 'react';
import axios from 'axios';

import Context from '../context';

export default ({ name, transform, path, params = {}, headers = {}, replace = {} }) => {
  const replaceParams = str => str.replace(/:(\w+)/, (_, group) => replace[group]);

  const { apiUrl, globalHeaders, beforeGet, afterGet, setBusy, getBusy } = useContext(Context);
  const paths = Array.isArray(path) ? path : [path];
  name = replaceParams(name);

  const fetchItems = () =>
    new Promise((resolve, reject) => {
      setBusy(name);

      const requests = paths.map((pathName, index) => {
        let resourceParams = Array.isArray(params) ? params[index] : params;

        if (beforeGet) {
          resourceParams = beforeGet(resourceParams);
        }

        return axios({
          method: 'get',
          url: `${apiUrl}/${replaceParams(pathName)}`,
          params: resourceParams,
          headers: { ...globalHeaders(), headers }
        });
      });

      Promise.all(requests)
        .then(data => {
          data = data.map(response => response.data);

          if (afterGet) {
            data = data.map(entry => afterGet(entry));
          }

          if (transform) {
            data = transform(data.length > 1 ? data : data[0], params);
          }

          setBusy(name, false);
          resolve(data);
        })
        .catch(err => reject(err));
    });

  return { get: fetchItems, busy: getBusy(name) };
};
