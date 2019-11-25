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
# RPC监听端口, 端口被占用时可以修改, 默认:6800
rpc-listen-port=6800
# 设置的RPC授权令牌, v1.18.4新增功能, 取代 --rpc-user 和 --rpc-passwd 选项
rpc-secret=6ad6db8723d261d6ebcd
# 在 RPC 服务中启用 SSL/TLS 加密时的证书文件(.pem/.crt)
rpc-certificate=/etc/nginx/cert/web.pem
# 在 RPC 服务中启用 SSL/TLS 加密时的私钥文件(.key)
rpc-private-key=/etc/nginx/cert/web.key
on-download-complete=/root/rcloneupload.sh
```

- /etc/init.d/aria2 start aria2 启动
- /etc/init.d/aria2 stop aria2 停止
- /etc/init.d/aria2 restart aria2 重启
- /etc/init.d/aria2 status aria2 状态

### 下载 AriaNg

```
mkdir -p /home/www/ariang
cd /home/www/ariang
wget https://github.com/mayswind/AriaNg-DailyBuild/archive/master.zip && unzip master.zip 下载并解压
mv AriaNg-DailyBuild-master/* .  移动文件
rm -rf master.zip AriaNg-DailyBuild-master  移除zip包和空文件夹
```
### 配置nginx
```
    server {
        listen 80;
	    listen 443 ssl;
        include ssl_certificates/web;
        server_name web.juphy.cn;
        location / {
            root /home/www/ariang/;
            index index.html index.htm;
        }
    }
```
### 整合Aria+Rclone
- vim /root/rcloneupload.sh 新建脚本
```
    server {
        listen 80;
	listen 443 ssl;
        include ssl_certificates/web;
        server_name web.juphy.cn;
        location / {
            root /home/www/ariang/;
            index index.html index.htm;
        }
    }
```
```
#!/bin/bash
filepath=$3     #取文件原始路径，如果是单文件则为/Download/a.mp4，如果是文件夹则该值为文件夹内第一个文件比如/Download/a/1.mp4
path=${3%/*}     #取文件根路径，如把/Download/a/1.mp4变成/Download/a
downloadpath='/data/download'    #Aria2下载目录
name='remote' #配置Rclone时的name
folder=''     #网盘里的文件夹，如果是根目录直接留空，
MinSize='10k'     #限制最低上传大小，默认10k，BT下载时可防止上传其他无用文件。会删除文件，谨慎设置。
MaxSize='15G'     #限制最大文件大小，OneDrive单文件上传最大只支持15G，保持默认即可。

if [ $2 -eq 0 ]; then exit 0; fi

while true; do
if [ "$path" = "$downloadpath" ] && [ $2 -eq 1 ]    #如果下载的是单个文件
    then
    rclone move -v "$filepath" ${name}:${folder} --tpslimit 1 --buffer-size=10M --min-size $MinSize --max-size $MaxSize
    rm -vf "$filepath".aria2    #删除残留的.aria.2文件
    exit 0
elif [ "$path" != "$downloadpath" ]    #如果下载的是文件夹
    then
    while [[ "`ls -A "$path/"`" != "" ]]; do
    rclone move -v "$path" ${name}:/${folder}/"${path##*/}" --tpslimit 1 --buffer-size=10M --min-size $MinSize --max-size $MaxSize --delete-empty-src-dirs
    rclone delete -v "$path" --max-size $MinSize    #删除多余的文件
    rclone rmdirs -v "$downloadpath" --leave-root    #删除空目录，--delete-empty-src-dirs 参数已实现，加上无所谓。
    done
    rm -vf "$path".aria2    #删除残留的.aria2文件
    exit 0
fi
done
```
- chmod +x /root/rcloneupload.sh
编辑aria2.conf配置文件，在末尾加上一行on-download-complete=/root/rcloneupload.sh