import ArrayToRemoveDuplicates from './arrayToRemoveDuplicates'
import ArrayFlat from './arrayFlat'
import Curry from './curry'
import NumFormat from './numFormat'
import Throttle from './throttle'
import Debounce from './debounce'
import Shuffle from './shuffle'

const genConfig = function () {
    const config = [
        {
            path: "arrayToRemoveDuplicates",
            element: <ArrayToRemoveDuplicates />,
            title: '数组去重'
        },
        {
            path: "arrayFlat",
            element: <ArrayFlat />,
            title: '数组扁平化'
        }, {
            path: "curry",
            element: <Curry />,
            title: '柯里化(curry)函数实现'
        },
        {
            path: "numFormat",
            element: <NumFormat />,
            title: '千位分隔符实现'
        },
        {
            path: "throttle",
            element: <Throttle />,
            title: '函数节流'
        },
        {
            path: "Debounce",
            element: <Debounce />,
            title: '函数防抖'
        },
        {
            path: "Shuffle",
            element: <Shuffle />,
            title: '随机打乱数组顺序'
        },
        
    ];

    config.map(item => {
        item.path = item.path.toLowerCase();
        return item
    })
    return config
}


export default genConfig();