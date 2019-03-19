- 创建RSA密钥对
    - ssh-keygen -t rsa
- 存储密钥和密码短语
    - 输入Gen Key之后，`Enter file in which to save the key(/root/.ssh/id_rsa):`
    - `Enter passphrase(empty for no passphrase)`
```
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Enter passphrase (empty for no passphrase): （112358）
Enter same passphrase again: （112358）
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:zAny1ZGE5nCSyT06njUuLUHlXpcNpi/twrArz2fYZTE root@VM_0_13_centos
The key's randomart image is:
+---[RSA 2048]----+
|     . =.oo.o    |
|      B.*..+ +   |
|    ...Bo.+ o .  |
|     o+*+o +E    |
|     ..BS.. oo   
|      = o+ oo    |
|       o.ooo.    |
|      ....+.     |
|       o+o       |
+----[SHA256]-----+
```
公钥位于` /root/.ssh/id_rsa.pub`，私钥位于`/root/.ssh/id_rsa`。
- 复制公钥
    - 生成密钥对之后，就可以将公钥放在我们想要使用的服务器上了，使用ssh-copy-id将公钥复制到新的计算机的authorized_keys文件中，`ssh-copy-id root@ip地址`
    -如果是Mac用户，则不会在安装ssh-copy-id，需要使用Homebrew安装它，`brew install ssh-copy-id`
    - 使用SSH粘贴密钥`cat ~/.ssh/id_rsa.pub | ssh demo@198.51.100.0 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >>  ~/.ssh/authorized_keys"`
无论使用那种命令，都有以下内容：
```
The authenticity of host '198.51.100.0 (198.51.100.0)' can't be established.
RSA key fingerprint is b1:2d:33:67:ce:35:4d:5f:f3:a8:cd:c0:c4:48:86:12.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '198.51.100.0' (RSA) to the list of known hosts.
user@198.51.100.0's password: 
```
此消息有助于确保没有添加不期望的额外密钥。

`现在您可以继续登录您的用户配置文件，系统不会提示您输入密码。但是，如果在创建SSH密钥时设置密码，则会要求您在此时输入密码（以及将来登录时的任何其他密码）。`

- 禁用Root登录密码
将SSH密钥复制到服务器上并确保只能使用SSH密钥登录后，可以继续将root登录限制为仅允许通过SSH密钥。
    - 打开SSH配置文件   `sudo nano /etc/ssh/sshd_config`
    - 找到包含PermitRootLogin并修改它的行，以确保用户只能使用其SSH密钥进行连接  `PermitRootLogin without-password`
    - 更改生效  `sudo systemctl reload sshd.service`

### 利用RaiDrive进行SFTP连接
sftp://ip地址:22
账号
