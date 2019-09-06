### yum安装mysql
Centos默认的的数据库是Maria DB。
```
yum install mysql 更新Maria DB

yum remove mysql 删除

rpm -qa | grep mysql  检查系统是否安装mysql
```
> 添加mysql yum源并安装

```
wget "https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm" 

yum repolist all | grep mysql  

rpm -ivh  mysql57-community-release-el7-11.noarch.rpm

yum -y install mysql mysql-server

```

>  默认配置文件路径

```
配置文件：/etc/my.cnf 
日志文件：/var/log/mysqld.log 
服务启动脚本：/usr/lib/systemd/system/mysqld.service 
socket文件：/var/run/mysqld/mysqld.pid
```
> 重置密码

```
grep "temporary"

grep "password" /var/log/mysqld.log    获取起始的默认密码

mysql -u root -p    第一次登陆需要重置密码
```

### 删除mysql
```
pkill -9 mysqld

yum remove mysql mysql-server mysql-libs

find / -name mysql  查询出来的相关东西delete

rpm -qa | grep mysql 查询出mysql相关的全部yum remove
```

### Oneinstack一键安装mysql
```
yum -y install wget screen      // for CentOS / Redhat 
wget http://mirrors.linuxeye.com/oneinstack-full.tar.gz   // Contains the source code
tar xzf oneinstack-full.tar.gz
cd oneinstack   // If you need to modify the directory (installation, data storage, Nginx logs), modify options.conf file
screen -S oneinstack    // If network interruption, you can execute the command `screen -r oneinstack` reconnect install window
./install.sh
```
或者
```
git clone https://github.com/oneinstack/oneinstack.git
cd oneinstack
./install.sh
```
- service mysqld {start|stop|restart|reload|status}
- systemctl {start|stop|restart|reload|status} mysqld.service
- 在oneinstack目录下
    - grep dbrootpwd options.conf  显示数据库root的密码
    - ./reset_db_root_password.sh   更改数据库root密码
- mysql -u root -p 登入mysql，输入之前安装时设置的密码

### 数据库操作
- create database table_name;  创建数据库（注意分号）
- show databases; 查看数据库（4个系统默认库，不能删除）
    ```
    +--------------------+
    | Database           |
    +--------------------+
    | information_schema |
    | mysql              |
    | performance_schema |
    | sys                |
    +--------------------+
    ```
- drop database table_name; 删除table_name数据库（注意分号）
- exit; 退出数据库控制台（注意分号）


### 创建数据库用户
```
mysql -uroot -p

grant all privileges on *.* to db_user@"localhost" identified by "123456";  添加一个用户名为 db_user 密码为 123456，授权为本机localhost对oninstack数据库所有权限。

flush privileges;  权限立即生效

exit;

service mysql restart
```
grant命令说明：
- all privileges 表示所有权限，也可以选择select、update等权限
- on 用来指定权限针对那些库和表
- `*`.* 前面的*用来表示指定数据库名，后面的`*`号用来指定表名
- root@'localhost'  表示root用户，@后面接限制的主机，可以是IP、IP段、域名以及%，%表示任何地方。注意这里%，有的版本不包括本地，如果有此问题在添加一个localhost的用户就可以了。
- identified by 指定用户的登录密码
- with grant option 表示该用户可以将自己拥有的权限授权给别人。可以使用grant重复给用户添加权限，权限叠加。

### 配置MySQL远程连接
为了安全考虑，Oneinstack仅允许云主机本机（localhost）连接数据库，如果需要远程连接数据库，需要进行以下操作：（服务器重启之后也需要重新操作一下iptables）
- 打开iptables3306端口
```
 iptables -I INPUT 4 -p tcp -m state --state NEW -m tcp --dport 3306 -j ACCEPT（其中INPUT后的数字可修改）

service iptables save #保存iptables规则
```
- 数据库授权，创建远程连接数据
```
mysql -uroot -p

// 添加一个用户名为 linuxeye 密码为 123456 授权为 % （%表示所有ip能连接，可以设置指定ip）对oninstack数据库所有权限
grant all privileges on *.* to linuxeye@'%' identified by '123456'; #授权语句，特别注意有分号

flush privileges;

exit;

service mysql restart; 
```
### MySQL访问控制与权限管理
系统默认创建一个名为root的用户，root用户拥有对整个mysql服务器完全控制的权限。
- create user'zhangsan'@'localhost' identified by '123456'; 创建用户名为zhangsan，密码为123456
- select user from mysql.user; 查看数据库的使用者账号

### 基本操作
> 数据库

- create database test_h;  创建数据库
- show databases;  查看数据库
- show create database test_h;  查看数据库
- alter database test_h default character set gbk collate gbk_bin;  修改数据库的编码，可使用上一条语句查看是否修改成功
- drop database test_h;  删除数据库
- CREATE DATABASE test_h DEFAULT CHARARCTER SET utf8 COLLATE utf8_general_ci; 综上直接创建数据库且设置编码方式

> 数据表

- use test_h;   选定操作的数据库
- 创建数据表
    ```
    create table student(
        id   int(11),
        name    varchar(20),
        age   int(11)
    );
    ```
- show tables;  查看数据表
- show create table student;  查看数据表信息，后面加上参数/G可使结果更加美观
- desc student;  查看表字段信息
- alter table student rename `[to]` h_student;    修改表名


