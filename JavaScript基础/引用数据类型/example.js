//  非纯函数
let changeAgeImpure = function (person) {
    person.age = 25;
    return person;
}

var alex = {
    name: 'Alex',
    age: 30
}

var changeAlex = changeAgeImpure(alex);
console.log(alex);
console.log(changeAlex);

// 纯函数
let changeAgePure = function (person) {
    var newPersonObj = JSON.parse(JSON.stringify(person));
    newPersonObj.age = 25;
    return newPersonObj;
}

var alex = {
    name: 'Alex',
    age: 30
}

var alexChanged = changeAgePure(alex);
console.log(alex);
console.log(alexChanged);

// 值传递和引用传递
let changeAgeAndReference = function(person){
    person.age = 25;
    person = {
        name: 'John',
        age: 50
    };
    return person;
}

var person1 = {
    name: 'Alex',
    age: 30
}
var person2 = changeAgeAndReference(person1);
console.log(person1);
console.log(person2);