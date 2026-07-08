import React, { useState, useEffect } from "react";

let timeId;
const KEY = "__config";

export const useConfig = () => {
  const [config, setConfig] = useState(() => {
    console.info(" initializer ******** function");
    return window[KEY] || { huazi: "dev" };
  });

  useEffect(() => {
    console.info("useEffect ******* timeId:", timeId);

    if (!timeId) {
      timeId = setTimeout(() => {
        setConfig({
          test: "abc",
        });
      });
    }
  }, []);

  return config;
};
