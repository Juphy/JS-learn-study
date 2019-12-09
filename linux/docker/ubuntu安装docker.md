- 卸载旧版本
sudo apt-get remove docker docker.engine docker.io docker-ce

- 更新apt包索引
sudo apt-get update

- 安装apt依赖包，用于HTTPS来获取仓库
sudo apt-get install -y  apt-transport-https ca-certificates curl software-properties-common 

- 添加Docker的官方GPG密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

- 设置stable存储库
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

- 更新apt包索引
sudo apt-get update

- 安装最新版本的Docker CE
sudo apt-get install -y docker-ce

- 列出可用的版本
apt-cache madison docker-ce

- 安装特定的版本
sudo apt-get install docker-ce=`<VERSION>`

- 查看docker服务启动
systemctl status docker

