/* eslint-disable no-prototype-builtins */
import Highlight from "../../components/highlight";
export default function ArrayFlat() {
  const code = `
    function shuffle(arr) {
      let j = arr.length;
      while(j>0){
        let randomIndex = Math.floor(Math.random()*j);
        j--;
        [arr[j],arr[randomIndex]] = [ arr[randomIndex],arr[j]];
      }
    
      return arr;
    }
  `;

  return (
    <>
      <a href="https://bost.ocks.org/mike/shuffle/compare.html"></a>
      <Highlight className="code">{code}</Highlight>
    </>
  );
}

// function shuffle(arr) {
//   let j = arr.length;
//   while(j>0){
//     let randomIndex = Math.floor(Math.random()*j);
//     j--;
//     [arr[j],arr[randomIndex]] = [ arr[randomIndex],arr[j]];
//   }

//   return arr;
// }
//  shuffle([1,2,3,4,5,6])