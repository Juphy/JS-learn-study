# urllib python内置的标准库模块
import urllib.request
import urllib.parse

url = 'https://api.github.com/users/github'
f = urllib.request.urlopen(url)
# html或者json数据都可以解析
print(f.read().decode('utf-8'))
# 利用type(f)可以查看输出响应的类型，<class 'http.client.HTTPResponse'>，它是一个HTTPResponse类型的对象，它主要包括read()、readinto()、getheader(name)、getheaders()、fileno()等方法，以及msg、version、status、reason、debuglevel、closed等属性。
# 调用read()方法可以得到返回的网页内容
# 调用status属性可以得到返回结果的状态码，如200代表请求成功，404代表网页未找到等
# getheaders()响应头信息

import urllib.parse
import urllib.request
# # 传递参数
# data = bytes(urllib.parse.urlencode({'word': 'hello'}), encoding='utf8')
# response = urllib.request.urlopen('http://httpbin.org/post', data=data)
# print(response.read().decode('utf-8'))
# # 设置timeout
# response = urllib.request.urlopen('http://httpbin.org/get', timeout=0.1)
# print(response.read().decode('utf-8'))

# request
import urllib.request

request = urllib.request.Request('https://python.org')
response = urllib.request.urlopen(request)
print(response.read().decode('utf-8'))

# Requests 由urllib3提供支持，Requests抽象了大量的程式化的代码，使得http请求比使用内置urllib库更简单
# 安装requests，pip install requests
import requests
from pprint import pprint

r = requests.get(url)
pprint(r.json())

import httpie
# alias https = 'http —default-scheme=https'
# httpie "https://api.spotify.com/v1/search?type=artist&q=snoop"
