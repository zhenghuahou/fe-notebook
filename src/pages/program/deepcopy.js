/* eslint-disable no-prototype-builtins */
import Highlight from "../../components/highlight";
export default function ArrayFlat() {
  const code = `
    function deepcopy(obj) {
      if (!obj || typeof obj != "object") {
        return;
      }
    
      const rst = Array.isArray(obj) ? [] : {};
      for (let key in obj) {
        console.info(" key:", key);
        if (obj.hasOwnProperty(key)) {
          rst[key] = typeof obj[key] === "object" ? deepcopy(obj[key]) : obj[key];
        }
      }
    
      return rst;
    }
  `;

  return (
    <>
      <Highlight className="code">{code}</Highlight>
    </>
  );
}

// function deepcopy(obj) {
//   if (!obj || typeof obj != "object") {
//     return;
//   }

//   const rst = Array.isArray(obj) ? [] : {};
//   for (let key in obj) {
//     console.info(" key:", key);
//     if (obj.hasOwnProperty(key)) {
//       rst[key] = typeof obj[key] === "object" ? deepcopy(obj[key]) : obj[key];
//     }
//   }

//   return rst;
// }

// var a = {
//   b: {
//     ab: {
//       ee: [12, 56, 7],
//     },
//   },
//   yy: 22,
// };
// var b = deepcopy(a);

