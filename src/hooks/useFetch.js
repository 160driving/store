import React, { useContext } from 'react';

import Context from '../context';

export default ({ transform, path, paramsSerializer }) => {
  const replaceParams = (str, obj) => str.replace(/:(\w+)/, (_, group) => obj[group]);

  const { apiUrl, globalHeaders, beforeGet, afterGet, request } = useContext(Context);
  const paths = Array.isArray(path) ? path : [path];

  const fetchItems = ({ params = {}, headers = {}, replace = {} } = {}) => {
    return new Promise((resolve, reject) => {
      const requests = paths.map((pathName, index) => {
        let resourceParams = Array.isArray(params) ? params[index] : params;

        if (beforeGet) {
          resourceParams = beforeGet(resourceParams);
        }

        let config = {
          method: 'get',
          url: `${apiUrl}/${replaceParams(pathName, replace)}`,
          params: resourceParams,
          headers: { ...globalHeaders(), headers }
        };

        if (paramsSerializer) {
          config.paramsSerializer = paramsSerializer;
        }

        return request(config);
      });

      Promise.all(requests)
        .then(async data => {
          data = data.map(response => response.data);

          if (afterGet) {
            data = data.map(entry => afterGet(entry));
          }

          if (transform) {
            const dataToTransform = data.length > 1 ? data : data[0];
            data = await Promise.resolve(transform(dataToTransform, params));
          }

          resolve(data);
        })
        .catch(err => reject(err));
    });
  };

  return { get: fetchItems };
};
