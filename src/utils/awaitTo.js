// 中间人方法
// function to (PromiseA) { // PromiseA就是axios函数返回的Promise对象(内部有ajax请求异步任务)
//   const PromiseB = PromiseA.then(res => {
//     return [null, res]
//   }).catch(err => {
//     return [err, null]
//   }) // then和catch接收ajax请求后返回的结果
//   return PromiseB // return到业务逻辑页面await后面去
// }
// export default to

// 极简写法
export default PromiseA => PromiseA.then(res => [null, res]).catch(err => [err, null])
