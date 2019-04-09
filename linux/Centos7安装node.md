## Centos 安装 nodejs
### epel库安装nodejs
此方法安装的node版本一般太低。
- yum info epel-release 查看epel-release的安装信息
- sudo yum install epel-release 安装epel-release
- sudo yum install nodejs
### 源码安装
- wget https://nodejs.org/dist/v10.15.3/node-v10.15.3.tar.gz 下载源码
- tar xzvf node-v* && cd node-v*

要编译源码需要安装gcc和gcc-c++，如果没有，需要安装.
- yum info (package_name) 查看某一软件包的版本信息
- sudo yum install gcc gcc-c++
- ./configure 如果gcc或者gcc-c++版本太低导致无法编译
- make  编译时间比较长
- sudo make install
### 设置bin
选择Linux Binary(×86/×64)版本即Linux二进制文件(×64)。
- wget https://nodejs.org/dist/v10.15.3/node-v10.15.3-linux-x64.tar.xz
- xz -d node-v*
- tar -xvf node-v*
- 测试安装的版本
    - cd node-v*/bin && ls
    - ./node -v
- 配置全局环境
    - sudo ln -s /usr/local/node/node-v*(解压后node的文件位置)/bin/node  /usr/local/bin/node（或者/usr/bin/node(目前这个有效)）
    - sudo ln -s /usr/local/node/node-v*(解压后node的文件位置)/bin/npm  /usr/local/bin/npm(或者/usr/bin/npm(目前这个有效))


### 卸载node
- yum remove nodejs npm -y
- 删除/usr/local/lib、/usr/local/include、/usr/local/bin下所有的node和node_modules文件夹或者可执行node和npm
