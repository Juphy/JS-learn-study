## git相关命令
- ls -a(-all) ~/.ssh    列出.ssh目录中的文件
    - 公钥的文件名是以下之一：\
      id_dsa.pub\
      id_ecdsa.pub\
      id_ed25519.pub\
      id_rsa.pub
- cat ~/.ssh/id_rsa.pub 查看当前的ssh密钥
- ssh-keygen -t rsa -C "your_email@example" 创建新的ssh密钥


- git remote set-url 原连接名 新的连接  修改连接地址
- git config --list 查看所有的config配置

- error: GH007:Your push would publish a private email address.
  由于设置邮箱为隐私邮箱，解决方法：
  - 1.在github上的settings=>Emails=>Keep my email address private去掉勾选
  - 2.命令行中配置邮箱为 username@users.noreply.github.com   `git config --global user.email 'username@users.noreply.github.com'`