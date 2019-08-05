- git --version  查看当前git版本
- yum info git  查看yum源仓库的Git信息
- yum remove git 卸载低版本git

> 安装git

- wget url(github中git发布的版本下载地址)
- tar zxf git-2.9.2.tar.gz  解压文件
- cd git-2.9.2
- make prefix=/usr/local/git all
- make prefix=/usr/local/git install

> 添加到环境变量

- echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
- source /etc/bashrc
