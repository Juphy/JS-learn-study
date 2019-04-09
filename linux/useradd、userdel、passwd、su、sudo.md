### useradd
用于创建用户账号
useradd可用于建立用户账号，账号建好之后，再用passwd设定账号的密码，而可用userdel删除账号。使用useradd指令所建立的账号，实际上是保存在/etc/passwd文本文件中。
> useradd [-mMnr] [-c <备注>] [-d <登入目录>]  [-e <有效期限>] [-f <缓冲天数>] [-g <群组>] [-G <群组>] [-s <shell>] [-u <uid>] [用户账号]

> useradd -D [-b][-e <有效期限>][-f <缓冲天数>][-g <群组>][-G <群组>][-s <shell>]

参数说明：
- -c<备注> 　加上备注文字。备注文字会保存在passwd的备注栏位中。
- -d<登入目录> 　指定用户登入时的启始目录。
- -D 　变更预设值．
- -e<有效期限> 　指定帐号的有效期限。
- -f<缓冲天数> 　指定在密码过期后多少天即关闭该帐号。
- -g<群组> 　指定用户所属的群组。
- -G<群组> 　指定用户所属的附加群组。
- -m 　自动建立用户的登入目录。
- -M 　不要自动建立用户的登入目录。
- -n 　取消建立以用户名称为名的群组．
- -r 　建立系统帐号。
- -s`<`shell>　 　指定用户登入后所使用的shell。
- -u`<`uid> 　指定用户ID。

example
```
useradd tt  // 添加一般用户

useradd -g root tt // 为添加的用户指定相应的用户组

useradd -r tt 创建一个系统用户

useradd -d /home/myd tt   为新添加的用户指定的home目录，即登入时的起始目录

useradd tt -u 544    建立用户且指定ID
```

### userdel
用于删除用户账号。userdel可删除用户与相关的文件，若不加参数，则仅删除用户账号，而不删除相关文件。
```
userdel [-r][用户账号]   //   -r  删除用户登入目录以及目录中所有文件

userdel hnlinux 删除用户账号
```

### passwd
用来修改使用者的密码
> passwd [-k] [-l] [-u] [-f] [-d] [-S] [username]

必要参数：
- -d 删除密码
- -f 强制执行
- -k 更新只能发送在过期之后
- -l 停止账号使用
- -S 显示密码信息
- -u 启用已被停止的账户
- -x 设置密码的有效期
- -g 修改群组密码
- -i 过期后停止用户账号

选择参数：
- --help 显示帮助信息
- --version 显示版本信息

example
```
passwd runoob(用户名) // 设置runoob用户的密码

passwd -S runoob    // 显示账号密码信息

passwd -d 1×138     // 删除用户密码
```
### su
用于变更为其他使用者的身份，除root外，需要键入该使用者的密码。
使用权限：所有使用者

> su [-fmp] [-c command] [-s shell] [--help] [--version] [-] [USER [ARG]]

参数说明：
- -f 或 --fast 不必读启动档（如 csh.cshrc 等），仅用于 csh 或 tcsh
- -m -p 或 --preserve-environment 执行 su 时不改变环境变数
- -c command 或 --command=command 变更为帐号为 USER 的使用者并执行指令（command）后再变回原来使用者
- -s shell 或 --shell=shell 指定要执行的 shell （bash csh tcsh 等），预设值为 /etc/passwd 内的该使用者（USER） shell
- --help 显示说明文件
- --version 显示版本资讯
- -l 或 --login 这个参数加了之后，就好像是重新 login 为该使用者一样，大部份环境变数（HOME SHELL USER等等）都是以该使用者（USER）为主，并且工作目录也会改变，如果没有指定 USER ，内定是 root
- USER 欲变更的使用者帐号
- ARG 传入新的 shell 参数

```
su -c ls root   变更账号为root并在执行ls指令后退出变回原使用者

su root -f  变更账号为root并传入-f参数給新执行的shell

su - clsung   变更账号为clsung并改变工作目录至clsung的家目录（home  dir）
```

切换用户
```
whoami   // 显示当前用户
pwd  // 显示当前目录
su root 或者直接 su   // 切换到root用户

su - root   // 切换到root用户
```

### sudo
以系统管理者的身份执行指令，也就是说，经由sudo所执行的指令就好像是root亲自执行。使用权限：在/etc/sudoers中出现的使用者。

- sudo -V 显示版本号
- sudo -h 显示版本编号及指令的使用方式说明
- sudo -l 显示出自己（执行sudo的使用者）的权限
- sudo -v 因为sudo在第一次执行时或是在N分钟内没有执行（N预设为5）会问密码，这个参数是重新做一次确认，如果超过N分钟，也会问密码。
- sudo -k 将会强迫使用者在下一次执行sudo时问密码（不论有没有超过N分钟）
- sudo -s 执行环境变数中的 SHELL 所指定的 shell ，或是 /etc/passwd 里所指定的 shell
- sudo -H 将环境变数中的 HOME （家目录）指定为要变更身份的使用者家目录（如不加 -u 参数就是系统管理者 root ）
- sudo command 要以系统管理者身份（或以-u更改为其他人）执行的指令
- sudo [  -b ] [ -p prompt ] [   -u username/#uid  ]  -s
    - -b 将要执行的指令放在背景执行
    - -p prompt 可以更改问密码的提示语，其中%u 会替换为使用者的账号名称，%h会显示主机名称
    - -u username/#uid 不加此参数，代表要以root的身份执行指令，而加了此参数，可以以username的身份执行指令（#uid为该username的使用者号码）

```
sudo ls
```