## cat

cat 命令用于连接文件并打印到标准输出设备上。

cat [-AbeEnstTuv] [--help] [--version] fileName

- 参数说明：
    - n 或 --number：由 1 开始对所有输出的行数编号。
    - b 或 --number-nonblank：和 -n 相似，只不过对于空白行不编号。
    - s 或 --squeeze-blank：当遇到有连续两行以上的空白行，就代换为一行的空白行。
    - v 或 --show-nonprinting：使用 ^ 和 M- 符号，除了 LFD 和 TAB 之外。
    - E 或 --show-ends : 在每行结束处显示 $。
    - T 或 --show-tabs: 将 TAB 字符显示为 ^I。
    - e : 等价于 -vE。
    - A, --show-all：等价于 -vET。
    - e：等价于"-vE"选项；
    - t：等价于"-vT"选项；

cat filename 查看文档的内容

cat -n textfile1 > textfile2 把 textfile1 的文档内容加上行号后输入 textfile2 这个文档里，如果textfile2不存在就会自动创建

cat -b textfile1 textfile2 >> textfile3  把textfile1和 textfile2 的文档内容加上行号（空白行不加）之后将内容附加到 textfile3 文档里，如果textfile3不存在就会自动创建

cat /dev/null > /etc/test.txt 清空 /etc/test.txt 文档内容， 使用相对路径，/dev/null是固定的

cat /dev/fd0 > OUTFILE cat 也可以用来制作镜像文件。例如要制作软盘的镜像文件，将软盘放好后输入

cat IMG_FILE > /dev/fd0 相反的，如果想把 image file 写到软盘，输入

- 注：
    - 1、OUTFILE 指输出的镜像文件名。
    - 2、IMG_FILE 指镜像文件。
    - 3、若从镜像文件写回 device 时，device 容量需与相当。
    - 4、通常用制作开机磁片。

## rm

rm 命令用于删除一个文件或者目录

rm [options] name

- 参数说明：
    - i 删除前逐一询问确认。
    - f 即使原档案属性设为唯读，亦直接删除，无需逐一确认。
    - r 将目录及以下之档案亦逐一删除

rm test.txt 删除文件

rm test 无法删除test目录

rm -r test 删除目录test

rm -r * 删除当前目录下所有文件及目录

## mv
mv(move file)用来为文件或目录改名、或将文件或目录移入其它位置。
```
mv [options] source dest
mv [options] source... directory
```
  - -b 当目标文件或目录存在时，在执行覆盖前，会为其创建一个备份
  - -i 如果指定移动的源目录或文件 与目标的目录或文件同名，则会先询问是否覆盖旧文件，输入y表示直接覆盖，输入n表示取消该操作
  - -f 如果指定移动的源目录或文件 与目标的目录或文件同名，不会询问，直接覆盖旧文件
  - -n 不要覆盖任何已存在的文件或目录
  - -u 当源文件比目标文件新或目标文件不存在时，才执行此操作

```
mv source_file(文件) dest_file(文件)  // 将源文件名source_file改为目标文件名dest_file
mv source_file(文件) dest_directory(目录)   //将文件source_file移动到目标文件夹dest_directory中
mv source_directory(目录) dest_directory(目录)  // 如果文件夹dest_directory已存在，将source_directory移动到文件夹dest_directory中，如果文件夹dest_directory不存在则source_directory改名为dest_directory
mv source_directory(目录)  dest_file(文件)  // 出错
```