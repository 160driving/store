import React, { useContext } from "react";

import Context from "../context";

export default ({
  path,
  name,
  validate,
  headers = {},
  transform,
  method = "post",
  transformUrl
}) => {
  const {
    apiUrl,
    setBusy,
    getBusy,
    globalHeaders,
    beforeSave,
    afterSave,
    request
  } = useContext(Context);
  const busyName = `save${name}`;

  const save = ({ key, ...values }) => {
    return new Promise((resolve, reject) => {
      if (validate && !validate(values)) {
        reject(new Error("Failed to pass validation"));
        return;
      }

      if (transformUrl) {
        path = transformUrl(path, values);
      }

      const fullApiUrl = `${apiUrl}/${path.replace(
        /:(\w+)/,
        (_, group) => values[group]
      )}`;

      if (transform) {
        values = transform(values);
      }

      if (beforeSave) {
        values = beforeSave(values);
      }

      setBusy(busyName);

      request({
        method,
        url: fullApiUrl,
        data: values,
        headers: { ...globalHeaders(), headers }
      })
        .then(({ data }) => resolve(afterSave ? afterSave(data) : data))
        .catch(err => reject(err))
        .finally(() => setBusy(busyName, false));
    });
  };

  return { save, busy: getBusy(busyName) };
};
