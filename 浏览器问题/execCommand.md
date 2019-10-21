### firefox 中 execCommand('copy')无效

```
<div class="share-box">
    <input type="text" class="share-link" value="分享链接">
    <button class="share-btn">分享</button>
</div>

$('.share-btn').on('click', function(){
    $.ajax({
        url: '',
        method: 'post'
    }).then(res => {
        $('.share-link').val('https://xxx.xxx.com/share/xxx').select();
        document.execCommand('copy');
    })
})
```

在 firefox 中，document.execCommand('cut'/'copy')返回 false，被拒绝，因为它不是从短时运行的用户生成的事件处理程序内部进行调用。
document.execCommand('cut'/'copy')必须是由用户触发，并且这个操作是同步的，关键之处在于有input框，存在内容被select选中的效果。
```
<div class="share-box">
  <input type="text" class="share-link" value="分享链接" />
  <button class="share-btn">分享</button>
  <button class="copy-link">复制链接</button>
</div>

$('.share-btn').on('click', function() {
  $.ajax({
    url: '/echo/json/',
    method: 'post'
  }).then(rs => {
     $('.share-link').val('https://xxx.xxx.com/share/xxx')
  })
})

$('.copy-link').on('click', function() {
  $('.share-link').select()
  document.execCommand('copy')
})
```
