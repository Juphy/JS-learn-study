let request = require('request');
const URL = 'http://localhost:5757/manager_list';
// request({
//     url: URL + 'user',
//     body: {a: 'b'},
//     method: 'POST',
//     json: true,
//     headers: {
//         "content-type": "application/json"
//     }
// }, (error, res, body) => {
//     console.log(error);
//     console.log(body);
// });
request(URL, (error, res, data) => {
    console.log(res);
    console.log(data);
});
