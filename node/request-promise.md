### request-promise
```
npm install --save request
npm install --save request-promise
```
### Crawl a webpage
```
var rp = require("request-promise");
rp("http://www.google.com")
    .then(function(htmlString){
        // Process html
    })
    .catch(function(err){
        // Crawling failed
    })
```
### Crawl a webpage better
```
var cheerio = require("cheerio");
var option = {
    uri: "http://www.google.com",
    tramsform: function(body){
        return cheerio.load(body);
    }
}
rp(option).then(function($){
    // Process html like you would with jQuery
}).catch(err =>{
    // Crawling failed or cheerio choked
})
```
### GET something from a JSON REST API
```
var options = {
    uri: 'https://api.github.com/user/repos',
    qs: {
        access_token: 'xxxxx xxxxx' // -> uri + '?access_token=xxxxx%20xxxxx'
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true // Automatically parses the JSON string in the response
};

rp(options)
    .then(function (repos) {
        console.log('User has %d repos', repos.length);
    })
    .catch(function (err) {
        // API call failed...
    });
```
### POST data to a JSON REST API
```
var options = {
    method: 'POST',
    uri: 'http://api.posttestserver.com/post',
    body: {
        some: 'payload'
    },
    json: true // Automatically stringifies the body to JSON
};

rp(options)
    .then(function (parsedBody) {
        // POST succeeded...
    })
    .catch(function (err) {
        // POST failed...
    });
```
### POST like HTML forms do
> form

```
var options = {
    method: 'POST',
    uri: 'http://posttestserver.com/post.php',
    form: {
        // Like <input type="text" name="name">
        name: 'Josh'
    },
    headers: {
        /* 'content-type': 'application/x-www-form-urlencoded' */ // Is set automatically
    }
};

rp(options)
    .then(function (body) {
        // POST succeeded...
    })
    .catch(function (err) {
        // POST failed...
    });
```
> file

```
var options = {
    method: 'POST',
    uri: 'http://posttestserver.com/post.php',
    formData: {
        // Like <input type="text" name="name">
        name: 'Jenn',
        // Like <input type="file" name="file">
        file: {
            value: fs.createReadStream('test/test.jpg'),
            options: {
                filename: 'test.jpg',
                contentType: 'image/jpg'
            }
        }
    },
    headers: {
        /* 'content-type': 'multipart/form-data' */ // Is set automatically
    }
};

rp(options)
    .then(function (body) {
        // POST succeeded...
    })
    .catch(function (err) {
        // POST failed...
    });
```

### include a cookie
```
var tough = require('tough-cookie');

// Easy creation of the cookie - see tough-cookie docs for details
let cookie = new tough.Cookie({
    key: "some_key",
    value: "some_value",
    domain: 'api.mydomain.com',
    httpOnly: true,
    maxAge: 31536000
});

// Put cookie in an jar which can be used across multiple requests
var cookiejar = rp.jar();
cookiejar.setCookie(cookie, 'https://api.mydomain.com');
// ...all requests to https://api.mydomain.com will include the cookie

var options = {
    uri: 'https://api.mydomain.com/...',
    jar: cookiejar // Tells rp to include cookies in jar that match uri
};

rp(options)
    .then(function (body) {
        // Request succeeded...
    })
    .catch(function (err) {
        // Request failed...
    });
```
