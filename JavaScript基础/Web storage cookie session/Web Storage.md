## LocalStorage与SessionStorage
HTML5中的Web Storage包括了两种存储方式：sessionStorage和localStorage。sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问，会话结束后数据也随之销毁。localStorage用于存储一个域名下的需要永久存在本地的数据，这些数据可以被一直访问，直到这些数据被删除。因此sessionStorage和localStorage的主要区别在于存储数据的声明周期，sessionStorage存储的数据的生命周期是一个会话，而localStorage存储的数据的生命周期是永久的，直到被主动删除，否则数据永远不会过期。

### Web Storage和Cookie的异同点及优劣势
Web Storage和Cookie的相同之处：
- 用于存储用户数据
- 存储数据的格式都是字符串形式
- 存储数据都有大小限制

Web Storage和cookie不同之处：
- 生命周期不同。sessionStorage的生命周期是一个会话，localStorage的生命周期是永久的，cookie的生命周期可以自定义，cookie可以设置过期时间，数据在过期时间之前可以访问。
- 存储大小限制不同。大部分现代浏览器Storage的存储限制大小为5M，cookie的存储大小限制为4k。
- 浏览器支持不同，API调用方式不同。

相比cookie，Web Storage的优点主要表现在存储空间更大，可存储的内容更多。cookie每次都随请求数据发送到服务端，Web Storage不会和请求数据一同发送到服务器端，占用带宽更少。缺点主要表现在，现在所有浏览器都支持cookie操作，而只有现代浏览器才支持Web Storage操作，如果需要兼容老旧浏览器，就不能用Web Storage。

### Web Storage API
localStorage和sessionStorage有着统一的API接口，这位二者的操作提供了极大的ss便利。ssss
- 添加键值对：localStorage.setItem(key, value)`setItem`用于把值value存储到键key上，除了使用`setItem`，还可以使用`localStorage.key = value`或者`localStorage['key'] = value`这两种形式。另外需要注意的是：key和value值必须是字符串形式的，如果不是字符串，会调用它们相应的`toString()`方法来转换成字符串在存储。当我们要存储对象时，应先转换成我们识别的字符串形式（比如JSON格式）在进行存储。
```
// 把一个用户名(lilei)存储到name的键上
localStorage.setItem('name', 'lilei');
// localStorage.name = 'lilei';
// localStorage['name'] = "lilei";
// 把一个用户存储到user的键上
localStorage.setItem('user', JSON.stringify({id: 1, name: 'lilei'}))
```
- 获取键值：localStorage.getItem(key)`gteItem`用于获取键key对应的数据，和`setItem`一样，`getItem`也有两种等效形式`value = localStorage.key`和`value = localStorage['key']`。获取到的value值是字符串类型，如果需要其他类型，需要手动进行转换。
```
// 获取存储到name的键上的值
var name = localStorage.getItem('name');
// var name = localStorage.name;
// var name = localStorage['name']
// 获取存储到user键上的值
var user = JSON.parse(localStorage.getItem('user'));
```
- 删除键值对：localStorage.removeItem(key)`removeItem`用于删除指定键的项，localStorage没有数据过期的概念，所有数据如果失效了，需要开发者手动删除。
```
var name = localStorage.getItem('name'); // 'lilei'
// 删除存储到name键上的值
localStorage.removeItem('name');
name = localStorage.getItem('name'); // null
```
- 清除所有键值对：localStorage.clear()`clear`用于删除所有存储的内容，它和`removeItem`不同的地方是`removeItem`删除的是某一项，而clear是删除所有。
```
// 清除 localStorage
localStorage.clear();
var len = localStorage.length; // 0
```
- 获取localStorage的属性名称(键名称): localStorage.key(index)`key`方法用于获取指定索引的键名称。需要注意的是赋值早的键值对应的索引值大，赋值晚的键值对应的索引小，`key`方法可用于遍历localStorage存储的键值
```
localStorage.setItem('name', 'lilei');
var key = localStorage.key(0); // 'name'
localStorage.setItem('age', 10);
key = localStorage.key(0); // 'age'
key = localStorage.key(1); // 'name'
```
- 获取localStorage中保存的键值对数量：localStorage.length`length`属性用于获取localStorage中键值对的数量
```
localStorage.setItem('name', 'lilei');
var len = localStorage.len; // 1
localStorage.setItem('age', 10);
len = localStorage.len; // 2
```

### Web Storage事件
- storage事件当存储的数据发生变化时，会触发storage事件。但要注意的是它不同于click类的事件会事件捕获和冒泡。
storage事件更像是一个通知，不可取消。`触发这个事件会调用同域下其他窗口的storage事件，不过触发storage的窗口（即当前窗口）不触发这个事件`。storage的event对象的常用属性：
```
oldValue：更新前的值。如果该键为新增加，则这个属性为null
newValue：更新后的值。如果该键被删除，则这个属性为null
url：原始触发storage事件的那个网页的网址
key：存储store的key名
```
```
function storageChanged(){
    console.log(arguments)
}
window.addEventListener('storage', storageChanged, false);
```
### 使用场景
基于Web Storage的特点，它主要被用于存储一些不经常改动的，不敏感的数据，比如全国省市区县信息，还可以存储一些不太重要的跟用户相关的数据，比如说用户的头像地址、主题颜色等，这些信息可以先存储在用户本地一份，便于快速呈现，等真正从服务器端读取成功后更改头像地址，主题颜色。另外，基于storage事件特点，Web Storage还可以用于同域不同窗口间的通信。