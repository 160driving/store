import React, { useContext } from 'react';
import axios from 'axios';

import Context from '../context';

export default ({ transform, path }) => {
  const replaceParams = (str, obj) => str.replace(/:(\w+)/, (_, group) => obj[group]);

  const { apiUrl, globalHeaders, beforeGet, afterGet } = useContext(Context);
  const paths = Array.isArray(path) ? path : [path];

  const fetchItems = ({ params = {}, headers = {}, replace = {} } = {}) => {
    return new Promise((resolve, reject) => {
      const requests = paths.map((pathName, index) => {
        let resourceParams = Array.isArray(params) ? params[index] : params;

        if (beforeGet) {
          resourceParams = beforeGet(resourceParams);
        }

        return axios({
          method: 'get',
          url: `${apiUrl}/${replaceParams(pathName, replace)}`,
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

          resolve(data);
        })
        .catch(err => reject(err));
    });
  };

  return { get: fetchItems };
};
