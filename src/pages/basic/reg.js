import Highlight from '../../components/highlight';
export default function Reg() {
    const code = `
    // var str = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
    /*
    传入的函数会被执行两次，第一次的打印结果为：
    match:<%=www.baidu.com%>
    p1:www.baidu.com
    offset:13
    string:<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>
    
    第二次的打印结果:
    match:<%=baidu%>
    p1:'baidu'
    offset:33
    string:<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>
    */
    // str.replace(/<%=(.+?)%>/g, function(match, p1, offset, string){
    //   console.log('match:',match);
    //   console.log('p1:',p1);
    //   console.log('offset:',offset);
    //   console.log('string:',string);
    // })
    
    console.log("aaabc".replace(/a+/g, function(){
      //执行1次，替换候的文本为'dbc'
      console.info('+ arg:',arguments)
      return 'd'
    }));
    
    
    console.log("aaabc".replace(/a+?/g, function(){
      //执行3次，替换候的文本为'dddbc'
      console.info('+? arg:',arguments)
      return 'd'
    }));
    
    
    /* 非惰性匹配
    输出结果:
    非惰性匹配 match: <%=www.baidu.com%>
    非惰性匹配 match: <%=baidu%>
    */
    var str2 = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
    str2.replace(/<%=(.+?)%>/g, function(match){
        console.log('非惰性匹配 match:',match);
    })
    
    /* 惰性匹配
    输出结果:
    惰性匹配 match: <%=www.baidu.com%>"><%=baidu%>
    */
    var str3 = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
    str3.replace(/<%=(.+)%>/g, function(match){
        console.log('惰性匹配 match:',match);
    })
    `

    return (
        <>
            <a href='https://github.com/mqyqingfeng/Blog/issues/70'>详细解题网址</a>
            <h3>正则表达式</h3>
            <Highlight className="code">
                {code}
            </Highlight>
        </>
    )
}
// var str = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
/*
传入的函数会被执行两次，第一次的打印结果为：
match:<%=www.baidu.com%>
p1:www.baidu.com
offset:13
string:<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>

第二次的打印结果:
match:<%=baidu%>
p1:'baidu'
offset:33
string:<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>
*/
// str.replace(/<%=(.+?)%>/g, function(match, p1, offset, string){
//   console.log('match:',match);
//   console.log('p1:',p1);
//   console.log('offset:',offset);
//   console.log('string:',string);
// })

// console.log("aaabc".replace(/a+/g, function(){
//   //执行1次，替换候的文本为'dbc'
//   console.info('+ arg:',arguments)
//   return 'd'
// }));


// console.log("aaabc".replace(/a+?/g, function(){
//   //执行3次，替换候的文本为'dddbc'
//   console.info('+? arg:',arguments)
//   return 'd'
// }));


/* 非惰性匹配
输出结果:
非惰性匹配 match: <%=www.baidu.com%>
非惰性匹配 match: <%=baidu%>
*/
// var str2 = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
// str2.replace(/<%=(.+?)%>/g, function(match){
//     console.log('非惰性匹配 match:',match);
// })

/* 惰性匹配
输出结果:
惰性匹配 match: <%=www.baidu.com%>"><%=baidu%>
*/
// var str3 = '<li><a href="<%=www.baidu.com%>"><%=baidu%></a></li>'
// str3.replace(/<%=(.+)%>/g, function(match){
//     console.log('惰性匹配 match:',match);
// })


