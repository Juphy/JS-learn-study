async function A() {
  console.log(1)
  await 2;
  console.log(3)
}

console.log(4);
A();
console.log(5)

async function main(){
  console.log(6);
  await A();
  console.log(7);
}
main();