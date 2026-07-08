const updateQueue = {
  pending: null,
};
let firstUpate;

function createUpdate(u) {
  const update = {
    payload: u,
    next: null,
  };
  return update;
}

function enqueueUpdate(update) {
  const pending = updateQueue.pending;
  if (pending === null) {
    // pending 为空，说明这是第一个 update
    update.next = update;
    //方便下面测试打印，实际不需要加下面这行代码
    firstUpate = update;
  } else {
    // 否则这个 update 会被添加到链表称为尾节点
    // 先将这个 update 指向头节点
    update.next = pending.next;
    // 再将当前的尾节点指向该节点
    pending.next = update;
  }
  // 将该 pending 设为该节点
  updateQueue.pending = update;
}

function test() {
  var updateList = ["u1", "u2", "u3", "u4", "u5"];
  updateList.forEach((u) => {
    const _update = createUpdate(u);
    enqueueUpdate(_update);
  });

  // console.info(" updateQueue:", updateQueue);

  let i = 0;
  let point = firstUpate;
  let rst = [];
  while (i < updateList.length) {
    i++;
    rst.push(point.payload + "-->");
    point = point.next;
  }
  rst.push(point.payload);
  console.info("rst:", rst.join(""));
}

test();
// rst: u1-->u2-->u3-->u4-->u5-->u1
