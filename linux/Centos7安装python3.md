### Centos7 安装python3和pip3
- whereis python:   默认指向所有python2的位置

> 默认的Centos7中没有安装pip

```
yum install epel-release -y 添加epel扩展源
yum install python-pip 安装pip
pip install wget 用pip安装wget
```

#### 安装依赖
- sudo yum install gcc
- sudo yum install openssl-devel -y  防止ImportError: cannot import name "HTTPHandlers"
- sudo yum install zlib-devel -y    防止ImportError: cannot import name "zlib"

#### pyton3安装
```
wget --no-check-certificate https://www.python.org/ftp/python/3.6.0/Python-3.6.0.tgz

tar -xzvf Python-3.6.0.tgz 

cd Python-3.6.0

sudo ./configure --prefix=/usr/local/python3/ (--with-zlib=/usr/include --enable-loadable-sqlite-extensions 后面忽略)

sudo make && make install

sudo ln -s /usr/local/python3/bin/python3 /usr/bin/python3
```

#### setuptools安装
```
wget --no-check-certificate https://pypi.python.org/packages/source/s/setuptools/setuptools-19.6.tar.gz#md5=c607dd118eae682c44ed146367a17e26 

tar -zxvf setuptools-19.6.tar.gz 
cd setuptools-19.6
python3 setup.py build 
python3 setup.py install
```

#### pip3安装
```
wget --no-check-certificate https://pypi.python.org/packages/source/p/pip/pip-8.0.2.tar.gz#md5=3a73c4188f8dbad6a1e6f6d44d117eeb 

tar -zxvf pip-8.0.2.tar.gz 
cd pip-8.0.2 
sudo python3 setup.py build 
sudo python3 setup.py install
sudo ln -s /usr/local/python3/bin/pip3 /usr/bin/pip3
```