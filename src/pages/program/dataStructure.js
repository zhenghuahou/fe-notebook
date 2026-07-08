/* eslint-disable @typescript-eslint/no-unused-vars */
function listToTree(arr){
    if(!Array.isArray(arr)){
        return []
    }
    let result = [];
    let _map = {};

    arr.forEach(item=>{
        _map[item.id] = item;
    });
    // console.info(' _map:',_map);

    arr.forEach(item=>{
        let _parentId = item.parent;
        let _parent = _map[_parentId];
        if(_parent){
            _parent.children  =   _parent.children  || [];
            _parent.children.push(item)
        }else{
            result.push(item);
        }
    });

    return result;
}


const source = [{
    id:1,
    parent:null,
    name:'aaa'
},{
    id:2,
    parent:1,
    name:'bbb'
},{
    id:3,
    parent:2,
    name:'ccc'
}]

// const output = listToTree(source)
/*
output = [{
    id:1,
    name:'aaa',
    children:[
        id:2,
        name:'bbb',
        children:[{
            id:3,
            name:'ccc'
        }]
    ]
}]

*/