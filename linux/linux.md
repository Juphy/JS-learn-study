### Centos7 添加用户到sudoers
```
chmod u+w /etc/sudoers   // 因为没有写权限，所以要把写权限加上

vim /etc/sudoers    // 编辑/etc/sudoers文件

## Allow root to run any commands anywhere.
root ALL=(ALL)   ALL
name ALL=(ALL)   ALL
name ALL=(ALL)   NOPASSWD: ALL  如果不想每次都输入密码

chmod u-w /etc/sudoers 恢复没有写权限模式
```

### 使用yum报错
```
bash: /usr/bin/yum: /usr/bin/python: bad interpreter: No such file or directory
```
Cnetos要求的python2版本，且使用的是/usr/bin/python，其指向python2版本，故如此操作：
```
sudo rm -rf /usr/bin/python
sudo ln -s /usr/bin/python2 /usr/bin/python
```