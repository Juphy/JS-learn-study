// let sprintf = require('printj').sprintf;
let fs = require('fs');
// let express = require('express');
// let app = express();
let path = require('path');
// let basepath = process.cwd();
//
// let dir = path.join(__dirname, '');
//
// app.use(require('express-formidable')({uploadDir: dir}));
//
// app.post('/upload', (req, res) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     console.log(req.files);
//     var f = req.files[Object.keys(req.files)[0]];
//     f.name = 'xxx.csv';
//     let newpath = path.join(dir, f.name);
//     fs.renameSync(f.path, newpath);
//     res.end("wrote to " + f.name);
// });
// app.use(express.static(path.resolve(basepath)));
// app.use(require('serve-index')(basepath, {'icond': true}));
//
// app.listen(9090, () => {
//     console.log('Serveing HTTP on port 9090');
// });

let XLSX = require('xlsx'),
    request = require('request');
let url = path.join(__dirname, 'xxx.csv');
request(url, {encoding: null}, (err, res, data) => {
    console.log(err);
    console.log(res);
    if (err || res.statusCode !== 200) return;
    let workbook = XLSX.read(data, {type: 'buffer'});
    console.log(workbook);
});

var buf = fs.readFileSync("xxx.csv");
var wb = XLSX.read(buf, {type: 'buffer'});
console.log(wb);
