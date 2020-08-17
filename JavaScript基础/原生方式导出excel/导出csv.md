### aoa to csv

```
let data = [
        ['a', 'b', 'c'],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3]
    ;
let replacer = (key, value) => (value === null ? '' : value);
data = data.map(row => row.map(t => JSON.stringify(t, replacer)).join(','))
data = data.join('\r\n');
data = "data:text/csv;charset=utf-8,\uFEFF" + data;
const link = document.createElement("a");
link.href = encodeURI(data);
link.download = `example.csv`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

### json to csv

```
let data = [
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 },
        { a: 1, b: 2, c: 3 }
    ];
let thead = [
        { name: 'a', value: 'a' },
        { name: 'b', value: 'b' },
        { name: 'c', value: 'c' }
    ];
const replacer = (key, value) => (value === null ? '' : value);
let csv = data.map(row => thead.map(t => JSON.stringify(row[t.value], replacer)).join(','));
csv.unshift(thead.map(t => t.name).join(','));
csv = csv.join("\r\n");
csv = "data:text/csv;charset=utf-8,\uFEFF" + csv;
const link = document.createElement("a");
link.href = encodeURI(csv);
link.download = `index.csv`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```
