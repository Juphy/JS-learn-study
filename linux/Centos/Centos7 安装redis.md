### 源文件安装

在 CentOS 和 Red Hat 系统中，首先添加 EPEL 仓库，然后更新 yum 源：

```
sudo yum install epel-release
sudo yum update
```

- sudo yum -y install redis 安装 Redis 数据库
- systemctl start redis 启动服务

为了使 Redis 能被远程连接，需要修改配置文件，路径为/etc/redis.conf

```
vi /etc/redis.conf

#bind 127.0.0.1     注释这一行

#requirepass foobared   取消注释这一行，可以给Redis设置密码

requirepass 密码  foobared即为当前密码，可以自行修改

sudo systemctl restart redis
```

- systemctl start redis.service #启动 redis 服务器

- systemctl stop redis.service #停止 redis 服务器

- systemctl restart redis.service #重新启动 redis 服务器

- systemctl status redis.service #获取 redis 服务器的运行状态

- systemctl enable redis.service #开机启动 redis 服务器

- systemctl disable redis.service #开机禁用 redis 服务器

### 压缩包安装

- wget http://download.redis.io/releases/redis-4.0.1.tar.gz 下载
- tar -zxvf redis-4.0.1.tar.gz 解压
- ```
    cd redis-4.0.1
    make  编译，make自动编译，会根据Makefile中描述的内容来进行编译
  ```
- make install 安装（实际上就是将这几个文件加到/usr/local/bin 目录下面，这个目录在 Path 下面的话，就可以直接执行这几个命令）

### 配置

> 设置 redis 服务器后台启动

启动一个客户端来进行登陆操作，需要设置后台启动，
daemonize no 修改为 daemonize yes。

### 卸载 redis

rm -rf /usr/local/bin/redis\*
或者
rm -rf /root/redis-stable
