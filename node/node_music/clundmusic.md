## cloudMusic
search_type

|search_type|含义|
|:--:|:--:|
|1|单曲|
|10|专辑|
|100|歌手|
|1000|歌单|
|1006|歌词|


## kuwoMusic

`http://search.kuwo.cn/r.s?client=kt&all={$word}&pn={$page}&rn={$size}&uid=221260053&ver=kwplayer_ar_99.99.99.99&vipver=1&ft=music&cluster=0&strategy=2012&encoding=utf8&rformat=json&vermerge=1&mobi=1`

|名称|类型|说明|
|:--|:--|:--|
|word|string|关键词|
|page|string|起始页|
|size|string|每页数量|
|返回值|||
|MUSICRID|string|ID|
|SONGNAME|string|歌名|
|ARTIST|string|人名|
|ARTISTID|string|人ID|
|ALBUM|string|专辑|
|ALBUMID|string|专辑ID|
|FORMATS|string|各种格式|
