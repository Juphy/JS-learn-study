## 1、通过yum安装
> 直接通过 yum install nginx 肯定是不行的,因为yum没有nginx，所以首先把 nginx 的源加入 yum 中。

- 将nginx放到yum repro库中

    rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

- 查看nginx信息

    yum info nginx

- 使用yum安装nginx

    yum install nginx

- 启动nginx

    service nginx start

- 查看nginx版本

    nginx -v

- 访问nginx，查看nginx服务返回的信息

    curl -i 公网IP

- nginx -t：测试配置文件的语法，配置文件是否写得正确，以及配置文件得路径

- 找到nginx文件路径

    ps aux | grep nginx


## 2、手动下载安装包
- 1、下载nginx包

    wget http://nginx.org/download/nginx-1.10.1.tar.gz

- 2、复制包到安装目录

    cp nginx-1.10.1.tar.gz /usr/loca

- 3、解压

    tar -zxvf nginx-1.10.1.tar.gz

- 4、启动nginx

     /usr/local/nginx/sbin/nginx
