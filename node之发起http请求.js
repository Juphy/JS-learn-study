// https库 需要解析JSON格式
const https = require('https');
https.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', res => {
    let data = '';
    res.on('data', chunk => {
        data += chunk;
    })
    res.on('end', () => {
        console.log(1, JSON.parse(data))
    })
}).on('error', err => {
    console.log('Error：' + err.message);
})

// request库
const request = require('request');
request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', {json: true}, (err, res, body) => {
    if (err) {
        return console.log(err)
    }
    console.log(2, body);
})

// request-promise库 request的promise操作
const requestPromise = require('request-promise');
requestPromise('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(res => {
        console.log(3, res);
    }).catch(err => {
    console.log(err);
});

// axios库 默认情况下，Axios可以解析JSON响应
const axios = require('axios');
axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    .then(res => {
        console.log(4, res.data);
    }).catch(err => {
    console.log(err);
})

// axios库的all
axios.all([
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-03'),
    axios.get('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=2017-08-02'),
]).then(axios.spread((res1, res2) => {
    console.log('res1', res1.data);
    console.log('res2', res2.data);
})).catch(err => {
    console.log(err);
})

// superAgent 默认解析JSON响应
const superagent = require('superagent');
superagent.get('https://api.nasa.gov/planetary/apod')
    .query({api_key: 'DEMO_KEY', date: '2017-08-02'})
    .end((err, res) => {
        if (err) {
            return console.log(err)
        }
        console.log(5, res.body);
    })

// Got 类似于promise，比较轻量，不像request那样臃肿
const got = require('got');
got('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', {json: true})
    .then(res => {
        console.log(res.body);
    }).catch(err => {
        console.log(err.reponse.body);
})