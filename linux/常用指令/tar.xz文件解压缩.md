### tar.xz
- xz -z 要压缩的文件：如果要保留被压缩的文件加上参数-k，如果要设置压缩率加入参数0-9调节压缩率，如果不设置，默认压缩等级是6。
- xz -d 要解压的文件：-k 参数来保留被解压缩的文件。
- **.tar.xz
    - tar -xvf 文件名：直接解压
    - xz -d `**`.tar.xz解压成**.tar，然后在用tar xvf **.tar
### tar
- -c或 --create : 建立压缩档案
- -x或 --extract或--get : 解压文件
- -t或 --list : 查看内容
- -r或 --append : 向压缩归档文件末尾追加文件
- -u或 --update : 更新原压缩包的文件
以上5个参数只能使用一个，以下是辅助选项：
- -z：gzip属性 xxx.tar.gz或者xx.tgz
- -j：bz2属性   xxx.tar.bz2
- -v：显示操作过程
- -f：必须的参数，后面跟文件名，不能再加其他的参数。

### tar的功能
- tar -cf all.tar *.jpg 将所有的jpg文件打包成一个all.tar文件
- tar -rf all.tar *.jpg 将所有的jpg文件增加到all.tar

### 打包和压缩
- tar -cvf img.tar img1 img2：将img1和img2打包
- tar -zcvf img.tar.gz：将img1和img2打包，然后gzip压缩
- tar -tf img.tar(.gz/.xz)：查看img.tar的所有内容，加 -v 参数查看详细参数，-z可有可无
### 解压方法
- *.tar : tar -xvf
- *.gz : gzip -d或者 gunzip
- `*`tar.gz和*.tgz：tar -xzf
- *.bz2：bzip2 -d或者bunzip2
- *.tar.bz2：tar -xjf
- *.Z：uncompress
- *.tar.Z：tar -xZf
- *.rar：unrar x
- *.zip：unzip



