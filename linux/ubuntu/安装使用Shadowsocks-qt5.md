### 安装 shadowsocks-qt5

```
#Ubuntu 14.04及更高版本
#添加ppa源
sudo add-apt-repository ppa:hzwhuang/ss-qt5
sudo apt-get update
sudo apt-get install shadowsocks-qt5
```

如果系统是 ubuntu18+，在你的/etc/apt/sources.list.d 目录下，看这个文件(hzwhuang-ubuntu-ss-qt5-bionic.list )将里面的 `bionic` 改成 `xenial` ,保存再运行 `sudo apt-get update` ,最后再运行一次 `sudo apt-get install shadowsocks-qt5` 就好了.
