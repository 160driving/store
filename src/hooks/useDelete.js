import React, { useContext } from "react";

import Context from "../context";

export default ({ path, name, headers = {} }) => {
  const { apiUrl, setBusy, getBusy, globalHeaders, request } = useContext(
    Context
  );
  const busyName = `delete${name}`;

  const destroy = (params = {}) => {
    return new Promise((resolve, reject) => {
      setBusy(busyName);

      request({
        method: "delete",
        url: `${apiUrl}/${path.replace(/:(\w+)/, (_, group) => params[group])}`,
        headers: { ...globalHeaders(), ...headers }
      })
        .then(response => resolve(response.data))
        .catch(err => reject(err))
        .finally(() => setBusy(busyName, false));
    });
  };

  return { destroy, busy: getBusy(busyName) };
};
