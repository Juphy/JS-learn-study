- git --version  查看当前git版本
- yum info git  查看yum源仓库的Git信息
- yum remove git 卸载低版本git

> 安装git

- wget url(github中git发布的版本下载地址https://github.com/git/git/archive/v2.24.0.tar.gz)
- tar xzvf v-2.24.0.tar.gz  解压文件
- cd git-2.24.0
- ./configure
- make
- make install

> 添加到环境变量

- echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
- source /etc/bashrc
