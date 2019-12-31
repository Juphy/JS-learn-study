- ifconfig 查看 IP
- netstat -rn / route -n 查看网关
- cat /etc/resolv.conf 查看 DNS

### 使用 ifupdown 配置网络

- sudo apt install ifupdown 如果要使用之前的方式配置网络，需要重新安装 ifupdown
- 修改配置文件/etc/network/interfaces

```
iface ens160 inet static
address 210.72.92.25
gateway 210.72.92.254
netmask 255.255.255.0
dns-nameservers 8.8.8.8
```

- sudo services network restart 重启网络服务器配置生效
- 修改 DNS

```
sudo vim /etc/resolv.conf
sudo /etc/init.d/resolvconf restart  使DNS生效
```

### 使用 netplan 配置网络

ubuntu18 使用 netplan 配置网络，其配置文件是 yaml 格式的，安装好 ubuntu18 之后，在/etc/netplan 目录下默认的配置文件名是 50-cloud-init.yaml

```
network:
    version: 2
    ethernets:
        eth0:
            dhcp4: true
            match:
                macaddress: 52:54:00:62:8c:36
            set-name: eth0
        enp0s31f6:
            addresses:[210.72.92.28/24] # IP及掩码
            gateway4: 210.72.92.254 # 网关
            dhcp4: false
            optional: true
            nameservers:
                addresses: [192.168.18.2, 114.114.114.114]
```
重启网络服务使配置生效Sa7YF7TU
```
sudo netplan apply
ip addr list
```
