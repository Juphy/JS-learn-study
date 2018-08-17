### 查看激活信息
cscript.exe %windir%\System32\slmgr.vbs /dlv>%temp%\slmgr.vbs_dlv.txt&%temp%\slmgr.vbs_dlv.txt

### 激活方式
以管理员身份打开cmd命令行窗口，kms.xspace.in是kms服务器地址，可能会失效，如果激活失败，可以自行搜索kms服务器地址，将kms.xspace.in替换即可，比如换成kms.03k.org

在命令行依次输入：\
slmgr /ipk W269N-WFGWX-YVC9B-4J6C9-T83GX(此为产品激活秘钥)\
slmgr /skms kms.xspace.in\
slmgr /ato
