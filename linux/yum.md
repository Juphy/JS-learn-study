/etc  一些配置档放置的目录，例如/etc/crontab

/usr/bin  一些可运行文件

/usr/lib 一些程序使用的动态函式库

/usr/share/doc 一些基本的软件使用手册与说明档

/usr/share/man 一些man page文件

namne-version.type.rpm

    name:表示软件包名称
    version:表示软件包的版本号
    type:软件包的类型
    i[3456]86:表示在Intel X86计算机平台上编译的
    sparc:表示在SPARC计算机平台上编译的
    alpha:表示在Alpha计算机平台上编译的
    src:表示软件包源代码
    rpm:表示文件扩展名

rpm -qa | sort | more 系统上所有软件包的排序列表

rpm -qa | wc -l 系统上所有包的数量

rpm -qal | wc -l 系统上所有包中所有文件的数量

rpm -qa |grep yum