## gzip
on（启用gzip压缩）off（停用gzip压缩）
开启gzip压缩后，可以看到http响应头的Content-Encoding的值为gzip
## gzip_buffers
默认：gzip_buffers 32 4k | 16 8k
设置用于压缩响应的缓冲区number和size。默认情况下，缓冲区大小等于一个内存页面
## gzip_comp_level
1-9的正整数，1最低，压缩时间短，9最高，压缩时间长，吃cpu，但是压缩效果好，实质是用cpu换流量，视情况而用。
## gzip_http_version
默认：gzip_http_version 1.1
设置压缩响应所需的最小http协议版本
## gzip_min_length
默认：gzip_min_length 20
设置将被gzip压缩的响应的最小长度。正整数，单位为字节，也可用k表示千字节，比如写成1024与1k都可以，效果是一样的，表示当资源大于1k时才进行压缩，资源大小取响应头中的Content-Length进行比较，经测试如果响应头不存在Content_length信息，该限制参数对于这个响应包是不起作用的；另外此处参数值不建议设的太小，因为设的太小，一些本来很小的文件经过压缩后反而变大了，官网没有给出建议值，在此建议1k起，因为小于1k的也没必要压缩，并根据实际情况来调整设定。
## gzip_proxied
默认：gzip_proxied off
根据请求和响应启用或禁用对代理请求的响应的gzipping。请求被代理的事实由“Via”请求头字段的存在确定。该指令接受多个参数。
- off – 关闭所有的代理结果数据压缩
- expired – 如果header中包含”Expires”头信息，启用压缩
- no-cache – 如果header中包含”Cache-Control:no-cache”头信息，启用压缩
- no-store – 如果header中包含”Cache-Control:no-store”头信息，启用压缩
- private – 如果header中包含”Cache-Control:private”头信息，启用压缩
- no_last_modified – 启用压缩，如果header中包含”Last_Modified”头信息，启用压缩
- no_etag – 启用压缩，如果header中包含“ETag”头信息，启用压缩
- auth – 启用压缩，如果header中包含“Authorization”头信息，启用压缩
- any – 无条件压缩所有结果数据
## gzip_types
默认：gzip_types text/html
响应报文数据格式，或者说类型，对应http响应头中的Content-type字段，如常见的有text/html、text/css、application/json、application/javaScript等。用于指定要压缩的响应报文类型。”*”表示压缩所有格式的响应报文，多种格式用空格隔开。如text/html text/css。
## gzip_vary
on（开启）|off（关闭）
是否在http header中添加Vary: Accept-Encoding。
## gzip_disable
一般使用：gzip_disable "MSIE [1-6]\."
表示那些UA头不适用gzip压缩。
