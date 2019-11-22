bash-4.2# curl https://rclone.org/install.sh | sudo bash          ————————下载并安装Rclone
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  4437  100  4437    0     0   2901      0  0:00:01  0:00:01 --:--:--  2901
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    15  100    15    0     0     10      0  0:00:01  0:00:01 --:--:--    10

The latest version of rclone rclone v1.49.1 is already installed.

bash-4.2# rclone config                                          ——————————初始化配置文件
2019/09/09 06:31:06 NOTICE: Config file "/root/.config/rclone/rclone.conf" not found - using defaults
No remotes found - make a new one
n) New remote
s) Set configuration password
q) Quit config
n/s/q> n                                                       ——————————————点击“n”新建一个挂载器
name> OneFine
Type of storage to configure.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
 1 / 1Fichier
   \ "fichier"
 2 / Alias for an existing remote
   \ "alias"
 3 / Amazon Drive
   \ "amazon cloud drive"
 4 / Amazon S3 Compliant Storage Provider (AWS, Alibaba, Ceph, Digital Ocean, Dreamhost, IBM COS, Minio, etc)
   \ "s3"
 5 / Backblaze B2
   \ "b2"
 6 / Box
   \ "box"
 7 / Cache a remote
   \ "cache"
 8 / Dropbox
   \ "dropbox"
 9 / Encrypt/Decrypt a remote
   \ "crypt"
10 / FTP Connection
   \ "ftp"
11 / Google Cloud Storage (this is not Google Drive)
   \ "google cloud storage"
12 / Google Drive
   \ "drive"
13 / Google Photos
   \ "google photos"
14 / Hubic
   \ "hubic"
15 / JottaCloud
   \ "jottacloud"
16 / Koofr
   \ "koofr"
17 / Local Disk
   \ "local"
18 / Mega
   \ "mega"
19 / Microsoft Azure Blob Storage
   \ "azureblob"
20 / Microsoft OneDrive                              ————————————选择20 “ Microsoft OneDrive”
   \ "onedrive"
21 / OpenDrive
   \ "opendrive"
22 / Openstack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ "swift"
23 / Pcloud
   \ "pcloud"
24 / Put.io
   \ "putio"
25 / QingCloud Object Storage
   \ "qingstor"
26 / SSH/SFTP Connection
   \ "sftp"
27 / Union merges the contents of several remotes
   \ "union"
28 / Webdav
   \ "webdav"
29 / Yandex Disk
   \ "yandex"
30 / http Connection
   \ "http"
31 / premiumize.me
   \ "premiumizeme"
Storage> 20                                   ————————————选择20 “ Microsoft OneDrive”     
** See help for onedrive backend at: https://rclone.org/onedrive/ **

Microsoft App Client Id
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_id>                                   ——————————————留空，直接回车就好！
Microsoft App Client Secret
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_secret>                             ——————————————留空，直接回车就好！ 
Edit advanced config? (y/n)
y) Yes
n) No
y/n> y                                   ——————————————留空，直接回车就好！
Chunk size to upload files with - must be multiple of 320k.

Above this size files will be chunked - must be multiple of 320k. Note
that the chunks will be buffered into memory.
Enter a size with suffix k,M,G,T. Press Enter for the default ("10M").
chunk_size>                                   ——————————————留空，直接回车就好！ 
The ID of the drive to use
Enter a string value. Press Enter for the default ("").
drive_id>                                    ——————————————留空，直接回车就好！
The type of the drive ( personal | business | documentLibrary )
Enter a string value. Press Enter for the default ("").
drive_type>                                    ——————————————留空，直接回车就好！
Set to make OneNote files show up in directory listings.

By default rclone will hide OneNote files in directory listings because
operations like "Open" and "Update" won't work on them.  But this
behaviour may also prevent you from deleting them.  If you want to
delete OneNote files or otherwise want them to show up in directory
listing, set this option.
Enter a boolean value (true or false). Press Enter for the default ("false").
expose_onenote_files>                                   ——————————————留空，直接回车就好！ 
Remote config
Use auto config?                
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine
y) Yes
n) No
y/n> n                                                  ————————————点击“n”，千万不要单击“y”，不然又要重新新建了。
For this to work, you will need rclone available on a machine that has a web browser available.
Execute the following on your machine (same rclone version recommended) :
        rclone authorize "onedrive"
Then paste the result below:
result>               ——————————————在这里你在电脑内获取的 result，记住是一整段 
{"access_token":"eyJ0eXAiOiJKV1QiLCJub25jZSI6ImRPd0ozWWhtQWozRlNfVkl4aEtIS3dSSS1VdFN4cVBsdUVsSTNqd0pCR00iLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiIwMDAjoiMSIsImFpbyI6IkFTUUEyLzhNQUFBQXllYURuVkR1MlA4eXZtMkNLRkVCWFBIMWV3SExsdHFBMUFNeHFNTU5UbW89IiwiYW1yIjpbInB3ZCJdLCJhcHBfZGlzcGxheW5hbWUiOiJyY2xvbmUiLCJhcHBpZCI6ImIxNTY2NWQ5LWVkYTYtNDA5Mi04NTM5LTBlZWMzNzZhZmQ1OSIsImFwcGlkYWNyIjoiMSIsImlwYWRkciI6IjIwMi45MS4zNC4xNTAiLCJuYW1lIjoibHVjazE5OTAiLCJYO8eETTiucl0BzZlrd0IwshMW6aa-zlMCAZ9kXRrpiiPqtFoMrc-v0OVrMpOqqfjte5_RJKpNkiG_bFTOT5UBu0kp2Ztpw6zuTQG4BMj0MDgDxE_skWM4XtLNHb_Yksftt9Dq0NHCH3GBsHZcn-_wWb2LoltiAdl-NfGA_jMb6KZBuLmyhpwTzYwR_aDyR76PkgM1uwexYZJZ3KQYjVfBrIJv1h8hhRY9_T0hqSEMjjW2XeZ_OEyyS8_wUK_wz9OCIOVWpQjjpuHZXSwF9qzVfGkCqf8uohgg4qRSitep9_z7WHqQBdcObFSk2ucnE48JaZL5da3ri5BTI3N8WW8w","token_type":"Bearer","refresh_token":"OAQABAAAAAAAP0wLlqdLVToOpA4kwzSnx7ToyVchTMoTn_9Mt2FWRWWlWpLA-WLXDy0gG4OfJjL41MLL3-K8shBZ9TFnmtbDpv97EQ8SEfS1ghps_xW2ElP0tdZUFZI1lly0VmYvTRnqt7jZY3fi4BqxJQItL4Gf32aso-JVoyOZain_fga8-8SUiXoCBuOGBsxsQgadjFqcizErfkb1NvRWSNi6umvO_lrpAVdYuCwOWtQe3tA1e25FVwBgz_oYBBimet1h9mJX8LbmWAF41lYaAE8Ms79ugp69G2CEPr5brGMNQXFVnqb6KlPFAi7zWCG3zHk2HNzEkWJdVd9Ol2oOgUlA8L18_ZWir4ICOXErHwIOvR2mS2Sc8O8QkDdgn_QmILfY7PwaAM5lwfP203pRwoLoKCa7HcjO_RfQjyygrSFMQHdiloKajHUWp8Y03vJKXyJ699Y-tToFMSNeP3QQ_MShg_sDn8SCXj9KzqgGBo8EEVIEciEusEPc2LppwckjzvKTIxAgHE5_CXRaBBgf_Z7mNgf85i-esqMFZmqxDUnxpV4LSSmaYwOBjJ9CdHh8Q6EEwJCs7Bk8voj7wVBeXgkTwZGuFWs5zPI9HF77OjQVGrXLaC1ST1t24OTFo5X6vgA-nlOWf7ZukrK9Eu7egT_ILR_m3i6arow7oJ2_Wjj9nbVAQlAwBsFKoQ8OZx7yqFd_Wrd0j7ZoTlaps3-VVQ7UoDNlLeQIm32PJMk57YksndOs_On7R8t8Do1LBnj1qaF8Q4jNybw32HODuFBKvTlahFu_Yj-5WJibBZ_L2HARBLEibR6HGDdpQ0C8VFsw77kmfyCUgAA","expiry":"2019-09-08T23:28:06.2230418+08:00"}
Choose a number from below, or type in an existing value
 1 / OneDrive Personal or Business
   \ "onedrive"
 2 / Root Sharepoint site
   \ "sharepoint"
 3 / Type in driveID
   \ "driveid"
 4 / Type in SiteID
   \ "siteid"
 5 / Search a Sharepoint site
   \ "search"
Your choice> 1                       ————————————————这里点击“1”，选择Business也就是“业务”
2019/09/09 06:31:57 NOTICE: Time may be set wrong - time from "login.microsoftonline.com" is 7h59m59.878964267s different from this computer
2019/09/09 06:31:59 NOTICE: Time may be set wrong - time from "graph.microsoft.com" is 7h59m59.375250187s different from this computer
Found 1 drives, please select the one you want to use:
0: OneDrive (business) id=b!4Af4WMptvUuoI2lKWmZ8DjTP53Sxc8NErBbI7DaiShy7YVnzONqjSpaHTZFLYIPH
Chose drive to use:> 0
Found drive 'root' of type 'business', URL: https://dutaotbsteduau-my.sharepoint.com/personal/luck1990_edu365_site/Documents
Is that okay?
y) Yes
n) No
y/n> y                           选择Y，并回车
--------------------
[OneFine]
type = onedrive
token = {"access_token":"eyJ0eXAiOiJKV1QiLCJub25jZSI6IjItRXAzbFh0azVla0x1Y2xCeGxIWkRKYURRczJRSzFCbFM0Z29aSVVTT0kiLCJhbGciOiJSUzI1NiIsIng1dCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCIsImtpZCI6ImllX3FXQ1hoWHh0MXpJRXN1NGM3YWNRVkduNCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8wYTdlZDczNi1iMTIiOiIxIiwiaXBhZGRyIjoiMjAyLjkxLjM0LjE1MCIsIm5hbWUiOiJsdWNrMTk5MCIsIm9pZCI6IjM0YjY4ZGEyLWQwOTktNGVjYi1hNmIwLTU5ODUzNWZkOGUzNyIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzQkZGRDk2OUU0NDdFIiwic2NwIjoiRmlsZXMuUmVhZCBGaWxlcy5SZWFkLkFsbCBGaWxlcy5SZWFkV3JpdGUgRmlsZXMuUmVhZFdyaXRlLkFsbCBwcm9maWxlIG9wZW5pZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ik5UV1ZXT1M1ZkxkN24wbldzV05qMmVyT3BwQ3NCZGtLZ29aQWlnVkFMWnMiLCJ0aWQiOiIwYTdlZDczNi1iMTgzLTRkNWYtYWI2Yi00Zjk1YzBiODM4NzMiLCJ1bmlxdWVfbmFtZSI6Imx1Y2sxOTkwQGVkdTM2NS5zaXRlIiwidXBuIjoibHVjazE5OTBAZWR1MzY1LnNpdGUiLCJ1dGkiOiJmNWNWUWpSQWtrMl9hSUQwYXkxNEFBIiwidmVyIjoiMS4wIiwieG1zX3N0Ijp7InN1YiI6Im1tTk1hblRzS0dRZGRHa3Fpc2VaZmFhTlIxZm9EWW9PdkpwRk9sRktndUUifSwieG1zX3RjZHQiOjE0Mzc0ODQxNDZ9.MIM8z3lQSxlOTBnyVOBXF7a9lA6xKP7gKMkX_O1px40IvF9rBc5Gz9ZFMWrIU1_3nknloIBdvGhGLD7C1HKbxa3GFfgeLmmaZKv1jErtrj3zCo_IbY8bNGaFY4xmtKAPdSL33isFqlg6qrtpf8W7DMrlV4oqfF5I1ZnLBKh00IVw_M2eHDMDkr1QCDpkntQhEtD5oueC6OcsT1CkTLD-tBqq_Niqhl2GoFDPL6ixSWI2PIparDjkryzRLeZTn3qu-HVmVaXhbb3BI0u7dxSqIlQVW9uPGIUNqQIy7a7-zCbbO5N-xdW4PtvyOj5DTbet2x9OM1SnbOwQOq1yMv-G0Q","token_type":"Bearer","refresh_token":"OAQABAAAAAAAP0wLlqdLVToOpA4kwzSnxYpNwvhJORhKZrWt9mfsfy1DZ9yoRORMpp4YhXzzRm6CB9l1Q5lHXB4-oy1RKceTIhH8xh-QvE-eXcwsmahjeeKY3JksOxTsauxDtHTasOz5rvkyaFXfWChMjVT_73RGKAkTIOE4JX4-boz33A7bmFaZSa9_YwG8pnIEjOKwW-z3fCRvbTusF0K9eMM8Y8sYEVkfPIxxfFp93tMzYsmsotB3USCKPpoF9w8Oiusq-rrrnvORW2olPv5Z2wSbdeCq4_gQxxxaQk3yIgB1P9slb8JUd32bkqLuXMTbikQNmR6_MOOC423NpQAIZYZpu9YdNwvfl5S3fTY_bIErCAQj7G4NBtkcj4IQYN_6iRpb3i-6ZnTgUYexqW6OxLVClXrXK69cZ6gsBjQXyqlh3LyW4jDDZyznyQQ-XNDTKT7j_HRsH4ElR2HRiKySXxy91PWxe0Jv9o2J4cF9v5HZyy0lM0YkjfSTan8SOwkNCyRijElkJKHbq4pnS76dZ1wUnrbFrcC2IohIzK6qEp6xYe19B0St7mi8vJV1EBcYYrh40EDPt3IFNaOVSmcscMRVEmMbuwGCS6v-Y7WZ0y35IdJwtBYIN97fdYbUR9nxMaWEPxbJu95YY9S9sn-ubeILoXXIxtgVFYIYCmXs_z1wErNHfPenE8yolWTlnahbuGTcmpHUf66Bn_dP5Er7fLgGyp8PibrwIikINgevci143xBvAlKBGPhZjuJHTFyHwkSvXReD6HgqgNcYbwNGZ6ZsHeSi0eU2Uhx4eiytmGCbCg76P5KV6h_ZfJEkNwsonMKTzAB4gAA","expiry":"2019-09-09T07:31:56.879124534+08:00"}
drive_id = b!4Af4WMptvUuoI2lKWmZ8DjTP53Sxc8NErBbI7DaiShy7YVnzONqjSpaHTZFLYIPH
drive_type = business
--------------------
y) Yes this is OK
e) Edit this remote
d) Delete this remote
y/e/d> y                              ——————————点击“y”，就OK了。   
Current remotes:

Name                 Type
====                 ====
OneFine              onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q             ——————————————————点击q退出