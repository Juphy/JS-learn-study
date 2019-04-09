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


