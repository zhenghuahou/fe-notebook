import { useEffect, useState, useRef, useCallback, useMemo } from "react";

export const useNormalDataHook = () => {
  const [data, setData] = useState({ info: null, count: null });
  useEffect(() => {
    const timer = setInterval(() => {
      setData((data) => ({
        ...data,
        count: data.count + 1
      }));
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  });

  return data;
};

let a= 0;
export const useOnDemandDataHook = () => {
  a++;
  const setter = useState({})[1];
  window['bb'+a] = setter;
  console.info(' a--->',a);
  const forceUpdate = useCallback(() => setter({}), [setter]);
  const dependenciesRef = useRef({ info: false, count: false });
  const dataRef = useRef({ info: null, count: 0 });
  window['cc'+a] = dataRef;
  window['dd'+a] = dependenciesRef;
  const dispatch = useCallback(
    (payload) => {
      dataRef.current = { ...dataRef.current, ...payload };
      const needUpdate = Object.keys(payload).some(
        (key) => {
      // console.info(' payload:',payload,' key:',key, dependenciesRef.current[key]);
          return dependenciesRef.current[key]
        }
      );
      console.info('>>>>  needUpdate:',needUpdate);
      if (needUpdate) {
        // forceUpdate();
      }
    },
    [forceUpdate]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch({ count: dataRef.current.count + 1 });
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [dispatch]);

  console.info(' ---> dependenciesRef:',dependenciesRef);
  return useMemo(() => {
    return Object.defineProperties(
      {},
      {
        info: {
          get: function () {
            dependenciesRef.current.info = true;
            return dataRef.current.info;
          },
          enumerable: true
        },
        count: {
          get: function () {
            dependenciesRef.current.count = true;
            return dataRef.current.count;
          },
          enumerable: true
        }
      }
    );
  }, []);
};
