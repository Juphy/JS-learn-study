## 安装nginx

- cat /etc/redhat-release 查看当前linux版本信息

### 1、通过yum安装

> 1、直接通过 yum install nginx 肯定是不行的,因为yum没有nginx，所以首先把 nginx 的源加入 yum 中。

```
// 将nginx放到yum repro库中
sudo rpm -ivh `http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm`
```
- yum repolist 查看yum源
- yum info nginx 查看nginx安装信息
> 2、安装

```
yum install nginx 使用yum安装nginx
```
> 3、配置nginx服务

- 设置开机启动

    sudo systemctl enable nginx

- 启动服务

    sudo systemctl start nginx
    service nginx start

- 停止服务

    sudo systemctl stop nginx

- 重启服务

    sudo systemctl reload nginx
    service nginx restart

> 4、打开防火墙

默认centos7使用的防火墙firewall是关闭http服务的（打开80端口）。
```
sudo firewall-cmd --zone=public --permanent --add-service=http

sudo firewall-cmd --reload
```
- 查看防火墙打开的所有的服务

    sudo firewall-cmd --list-service

> 5、方向代理

centos7的SELinux，使用反向代理需要打开网络访问权限
```
sudo setsebool httpd_can_network_connect 1
```
### 2、手动下载安装包
- 1、下载nginx包

    wget `http://nginx.org/download/nginx-1.10.1.tar.gz`

- 2、复制包到安装目录

    cp nginx-1.10.1.tar.gz /usr/loca

- 3、解压

    tar -zxvf nginx-1.10.1.tar.gz

- 4、启动nginx

     /usr/local/nginx/sbin/nginx

### nginx
- 查看nginx版本

    nginx -v

- 访问nginx，查看nginx服务返回的信息

    curl -i 公网IP

- nginx -t：测试配置文件的语法，配置文件是否写得正确，以及配置文件得路径

- 找到nginx文件路径

    ps aux | grep nginx

- 快速查找nginx文件位置

    locate nginx.conf

- 检测配置文件是否出错

    nginx -t

- 查看日志

    cat /var/log/nginx/error.log

- ps -ef | grep nginx

    ps: 将某个进程显示出来\
    -A: 显示所有程序\
    -e: 此参数的效果和指定'A'参数相同\
    -f: 显示UID，PPIP，C与STIME栏位\
    grep命令是查找\
    中间的“|”是管道命令是指ps命令与grep同时执行\
    这条命令的意思就是显示有关nginx的进程

- UID PID PPID C STIME TTY TIME CMD

    UID 程序被该 UID 所拥有\
    PID 就是这个程序的 ID\
    PPID 则是其上级父程序的ID\
    C CPU 使用的资源百分比\
    STIME 系统启动时间\
    TTY 登入者的终端机位置\
    TIME 使用掉的 CPU 时间。\
    CMD 所下达的指令为何\

- 杀掉进程

    kill -9 PID（通过ps -ef | grep nginx查看pid值）

- 查看nginx运行状态
    
    systemctl status nginx.service

## nginx配置
### 静态资源
指定路径对应的目录，location可以使用正则表达式指向图片所在的文件夹，root指向文件对应的硬盘中的目录。
```
location /images/ {
    root /home/www/spider/mono/;
    autoindex on;
}
```
### 多域名配置


## Nginx服务安装SSL证书
### Nginx/Tengine服务器安装SSL证书
在证书控制台下载nginx版本证书，解压后包含：
- .crt文件：是证书文件，crt是pem文件的扩展名。.pem扩展名
- .key文件：证书的私钥文件（申请证书时如果没有选择自动创建CSR，则没有该文件）

### 安装步骤
证书文件名a.pem、私钥文件是a.key
- 1.在nginx的安装目录下创建cert目录，并且将全部文件拷贝到cert目录中，如果申请证书时是自己创建的CSR文件，请将对应的私钥文件放到cert目录下并且命名a.key
- 2.打开Nginx安装目录下conf目录中的nginx.conf文件，添加配置：
```
 ssl_certificate   cert/a.pem;
 ssl_certificate_key  cert/a.key;
 ssl_session_timeout 5m;
 ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
 ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
 ssl_prefer_server_ciphers on;
```

###  nginx 403 forbidden
- 1.缺少index.html或者index.php文件
- 2.权限问题：修改文件或者目录的权限
- 3.nginx配置的用户
```
ps aux | grep nginx 查看nginx运行的user，可以修改为root
root     11551  0.0  0.1  47156  1140 ?        Ss   06:25   0:00 nginx: master process nginx -c /etc/nginx/nginx.conf
root     11552  0.0  1.1  47536  6636 ?        S    06:25   0:00 nginx: worker process
root     11897  0.0  0.3 112716  2320 pts/0    S+   06:49   0:00 grep --color=auto nginx
```

