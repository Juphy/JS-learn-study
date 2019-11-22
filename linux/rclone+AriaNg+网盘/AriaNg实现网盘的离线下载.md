aria2: 用于下载资源
ariaNg：用于提供 Web 界面操作
rclone：用于将 VPS 的文件同步到 Google Drive

- 更新系统，安装必备的组件

```
yum -y update
yum -y install epel-release
yum -y install wget git unzip gcc gcc-c++ openssl-devel nginx
```

- 启动 nginx 并设置开机自启

```
systemctl start nginx
systemctl enable nginx.service
systemctl stop firewalld # 关闭防火墙
```

### 安装 aria2

```
wget -N --no-check-certificate https://raw.githubusercontent.com/ToyoDAdoubi/doubi/master/aria2.sh && chmod +x aria2.sh && bash aria2.sh

Aria2 一键安装管理脚本 [vx.x.x]
-- Toyo | doub.io/shell-jc4 --

 0. 升级脚本
————————————
 1. 安装 Aria2
 2. 更新 Aria2

 3. 卸载 Aria2
————————————
 4. 启动 Aria2
 5. 停止 Aria2
 6. 重启 Aria2
————————————
 7. 修改 配置文件
 8. 查看 配置信息
 9. 查看 日志信息
10. 配置 自动更新 BT-Tracker服务器
————————————

当前状态: 已安装 并 已启动

请输入数字 [0-10]: 1
```

安装完成后配置文件在`/root/.aria2/aria2.conf`
```
# 文件的保存路径（可以使用绝对路径或者相对路径），默认当前启动位置
dir=/home/download
```
