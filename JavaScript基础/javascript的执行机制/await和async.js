async function async1(){
  // await async2().then(function(){
  //   console.log(3);
  // });
  await async2();
  console.log('async1 end');
}

async function async2(){
  console.log('async2 end');
}
console.log(1);
async1()
console.log(2);

new Promise(resolve => {
  resolve()
}).then(function(){
  console.log('promise1');
})

// 1 async2 end 2 3 promise1 async1 end

// 1 async2 end 2 async1 end promise1