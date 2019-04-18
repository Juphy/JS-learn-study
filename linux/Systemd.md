### Systemd
Systemd是linux系统工具，用来守护进程。

![Systemd架构图](https://ws3.sinaimg.cn/large/8b2b1aafly1g23684pfyij20k00b9jrm.jpg)

- systemctl: Systemd的主命令，用于管理系统
```
# 重启系统
$ sudo systemctl reboot

# 关闭系统，切断电源
$ sudo systemctl poweroff

# CPU停止工作
$ sudo systemctl halt

# 暂停系统
$ sudo systemctl suspend

# 让系统进入冬眠状态
$ sudo systemctl hibernate

# 让系统进入交互式休眠状态
$ sudo systemctl hybrid-sleep

# 启动进入救援状态（单用户状态）
$ sudo systemctl rescue
```
- systemd-analyze: 用于查看启动耗时
```
# 查看启动耗时
$ systemd-analyze                                                                                       
# 查看每个服务的启动耗时
$ systemd-analyze blame

# 显示瀑布状的启动过程流
$ systemd-analyze critical-chain

# 显示指定服务的启动流
$ systemd-analyze critical-chain atd.service
```
- hostnamectl: 用于查看当前主机的信息
```
# 显示当前主机的信息
$ hostnamectl

# 设置主机名。
$ sudo hostnamectl set-hostname rhel7
```
- localectl: 命令用于查看本地化设置
```
# 查看本地化设置
$ localectl

# 设置本地化参数。
$ sudo localectl set-locale LANG=en_GB.utf8
$ sudo localectl set-keymap en_GB
```
- timedatectl: 用于查看当前时区设置

```
# 查看当前时区设置
$ timedatectl

# 显示所有可用的时区
$ timedatectl list-timezones                                                                                   
# 设置当前时区
$ sudo timedatectl set-timezone America/New_York
$ sudo timedatectl set-time YYYY-MM-DD
$ sudo timedatectl set-time HH:MM:SS
```
- loginctl: 用于查看当前登录的用户
```
# 列出当前session
$ loginctl list-sessions

# 列出当前登录用户
$ loginctl list-users

# 列出显示指定用户的信息
$ loginctl show-user ruanyf
```

### Unit
Systemd可以管理所有系统资源，不同的资源统称未Unit（单位）。
```
Service unit：系统服务
Target unit：多个 Unit 构成的一个组
Device Unit：硬件设备
Mount Unit：文件系统的挂载点
Automount Unit：自动挂载点
Path Unit：文件或路径
Scope Unit：不是由 Systemd 启动的外部进程
Slice Unit：进程组
Snapshot Unit：Systemd 快照，可以切回某个快照
Socket Unit：进程间通信的 socket
Swap Unit：swap 文件
Timer Unit：定时器
```
- 查看当前系统的所有Unit
```
# 列出正在运行的 Unit
$ systemctl list-units

# 列出所有Unit，包括没有找到配置文件的或者启动失败的
$ systemctl list-units --all

# 列出所有没有运行的 Unit
$ systemctl list-units --all --state=inactive

# 列出所有加载失败的 Unit
$ systemctl list-units --failed

# 列出所有正在运行的、类型为 service 的 Unit
$ systemctl list-units --type=service
```
- 查看系统状态和单个Unit的状态
```
# 显示系统状态
$ systemctl status

# 显示单个 Unit 的状态
$ sysystemctl status bluetooth.service

# 显示远程主机的某个 Unit 的状态
$ systemctl -H root@rhel7.example.com status httpd.service

# 显示某个 Unit 是否正在运行
$ systemctl is-active application.service

# 显示某个 Unit 是否处于启动失败状态
$ systemctl is-failed application.service

# 显示某个 Unit 服务是否建立了启动链接
$ systemctl is-enabled application.service
```
- 常用的Unit管理命令
```
# 立即启动一个服务
$ sudo systemctl start apache.service

# 立即停止一个服务
$ sudo systemctl stop apache.service

# 重启一个服务
$ sudo systemctl restart apache.service

# 杀死一个服务的所有子进程
$ sudo systemctl kill apache.service

# 重新加载一个服务的配置文件
$ sudo systemctl reload apache.service

# 重载所有修改过的配置文件
$ sudo systemctl daemon-reload

# 显示某个 Unit 的所有底层参数
$ systemctl show httpd.service

# 显示某个 Unit 的指定属性的值
$ systemctl show -p CPUShares httpd.service

# 设置某个 Unit 的指定属性
$ sudo systemctl set-property httpd.service CPUShares=500
```
- 依赖关系
A 依赖于 B，就意味着 Systemd 在启动 A 的时候，同时会去启动 B。
```
systemctl list-dependencies nginx.service  列出一个Unit的所有依赖

systemctl list-dependenices --all nginx.service  有些依赖是target类型，默认不会展开显示，如果要展开Target，就需要使用--all参数
```

### Unit的配置文件
每一个Unit都有一个配置文件，告诉Systemd怎么启动这个Unit。
Systemd 默认从目录/etc/systemd/system/读取配置文件。但是，里面存放的大部分文件都是符号链接，指向目录/usr/lib/systemd/system/，真正的配置文件存放在那个目录。

```
sudo systemctl enable clamd@scan.service
# 等同于
$ sudo ln -s '/usr/lib/systemd/system/clamd@scan.service' '/etc/systemd/system/multi-user.target.wants/clamd@scan.service'
```
如果配置文件里面设置了开机启动，`systemctl enbale`命令相当于激活开机启动，与之对应的，`systemctl disable`命令用于在两个目录之间，撤销符号链接关系，相当于撤销开机启动。
```
sudo systemctl disabled clamd@scan.service
```
配置文件的后缀名