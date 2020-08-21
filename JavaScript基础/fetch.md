## Fetch
```
fetch(url).then(res => console.log(res))
{
    body: ReadableStream
    bodyUsed: false
    headers: Headers {}
    ok: true
    redirected: false
    status: 200
    statusText: "OK"
    type: "basic"
    url: "https://node-hnapi.herokuapp.com/news?page=1"
    __proto__: Response
}
```
请求到的资源存储在body中，作为一种可读的流，所以需要调用不同的方法来将可读流转换为我们可以使用的数据。这些方法返回另一个Promise，所以可以调用.then方法处理转换后的数据。根据Response Headers中的Content-Type来判断内容格式。
- json：response.json()
- plain/text  html xml：response.text()
- 图片：response.blob()
- 二进制文件流：response.buffer()

```
  fetch(url, options);

let content = {some: 'content'};
fetch('some-url', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(content)
})
```
- 设置请求方法（如post、put或del），fetch会自动设置为get
- 设置头部，一般使用json数据，所以设置为ContentType为appliaction/json
- 设置包含JSON内容的主体。因为主体内容是json，所以设置主体调用JSON.stringify

fetch不关心AJAX是否成功，只关心从服务器发送请求和接收响应，如果响应失败我们需要抛出异常，因此，初始的then方法需要被重写，以至于如果响应成功会调用response.json>最简单的方法就是检查response是否为ok。
```
fetch(url)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error('something webt wrong!');
            return Promise.reject({
                status: response.status,
                statusText: response.statusText
            });
        }
    })
    .then(data => console.log('data is', data))
    .catch(error => console.log('error is', error))
```
```
fetch(url)
    .then(handleResponse)
    .then(data => console.log(data))
    .then(error => console.log(error))

function handleResponse(response){
    let contentType = response.headers.get('content-type');
    if(contentType.includes('appliaction/json')){
        return response.json()
            .then(json => {
                if(response.ok){
                    return json 
                }else{
                    return Promise.reject(Object.assign({}, json, {
                        status: response.status,
                        statusText: response.statusText
                    }))
                }
            } )
    }
    if(contentType.includes('text/html')){
        return response.text()
            .then(text => {
                if(response.ok){
                    return text
                }else{
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText,
                        err: text
                    })
                }
            })
    }
}
```
#### 响应的对象Response类型
当我们执行一个fetch请求时，响应的数据的类型response.type可以是
