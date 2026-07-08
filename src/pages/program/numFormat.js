import Highlight from "../../components/highlight";
export default function NumFormat() {
  const code = `
  function numFormat(num){
    var res=num.toString().replace(/\\d+/, function(n){ // 先提取整数部分
         return n.replace(/(\\d)(?=(\\d{3})+$)/g,function($1){
            return $1+",";
          });
    })
    return res;
  }
  
  var a=1234567894532;
  var b=673439.4542;
  console.log(numFormat(a)); // "1,234,567,894,532"
  console.log(numFormat(b)); // "673,439.4542"
  `;
  return (
    <>
      <a href="https://www.jianshu.com/p/928c68f92c0c">参考网址</a>
      <br />
      <hr />
      <Highlight className="code">{code}</Highlight>
    </>
  );
}

/*
function numFormat(num){
  const [part,rest] = `${num}`.split('.')
  const newPart = part.replace(/(\d)(?=(\d{3})+$)/g,function($1){
          return $1+",";
        });
  return newPart + (rest ? `.${rest}` : '');
}

var a=1234567894532;
var b=673439.4542;
console.log(numFormat(a)); // "1,234,567,894,532"
console.log(numFormat(b)); // "673,439.4542"
*/
