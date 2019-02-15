let Rx = require("rxjs");
var people = [
    {name: 'Anna', score: 100, subject: 'English'},
    {name: 'Anna', score: 90, subject: 'Math'},
    {name: 'Anna', score: 96, subject: 'Chinese'},
    {name: 'Jerry', score: 80, subject: 'English'},
    {name: 'Jerry', score: 100, subject: 'Math'},
    {name: 'Jerry', score: 90, subject: 'Chinese'},
];
var source = Rx.Observable.from(people)
    .zip(Rx.Observable.interval(300), (x, y) => x);
var example = source
    .groupBy(person => person.name)
    .map(group => group.reduce((acc, cur) => ({
        name: cur.name,
        score: cur.score + acc.score
    })))
    .mergeAll();
example.subscribe(console.log);
