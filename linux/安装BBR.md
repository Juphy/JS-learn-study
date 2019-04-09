### BBR脚本
- uname -r 查看当前核心（低版本的核心是不能安装BBR）
> 更新内核

```
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
```

- sudo -i  切换到root用户
- yum install -y wget 安装wget

```
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh
```
安装完成后，脚本会提示需要重启VPS，输入`y`并`回车`后重启