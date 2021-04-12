### padStart
padStart: 用另一个字符串填充当前字符串（如果需要的话，会重复对次）以便产生的字符串达到给定的长度。从当前字符串的左侧开始填充。
```
star.padStart(targetLength[, padString])
```
> 参数

- targetLength: 当前字符串需要填充到的目标长度，如果这个数值小于当前字符串的长度，则返回当前字符串本身。
- padString: 可选。填充的字符串。如果字符串太长，使填充后的字符串长度超过目标长度，则只保留最左侧的部分，其他部分会被截断。此参数的默认值是""。

> 返回值

在原字符串开头填充指定的填充字符串直到目标长度所形成的新字符串

```
'abc'.padStart(10);               // "       abc"
'abc'.padStart(10, 'foo');      // "foofoofabc"
'abc'.padStart(6,"123465"); // "123abc"
'abc'.padStart(8, "0");          // "00000abc"
'abc'.padStart(1);                 // "abc"
```

### padEnd
padEnd: 用另一个字符串填充当前字符串（如果需要的话则重复填充），返回填充后达到指定长度的字符串。从当前字符串的末尾（右侧）开始填充。
```
str.padEnd(targetLength[, padString])
```
> 参数

- targetLength: 当前字符串需要填充到的目标长度。如果这个数值小于当前字符串的长度，则返回当前字符串本身。
- padString: 可选。填充的字符串。如果字符串太长，使填充后的字符串长度超过了目标长度，则只保留最左侧的部分，其他部分会被截断。此参数的默认值是""。

> 返回值

在原字符串末尾填充指定的填充字符串直到目标长度所形成的新字符串。

```
'abc'.padEnd(10);          // "abc       "
'abc'.padEnd(10, "foo");   // "abcfoofoof"
'abc'.padEnd(6, "123456"); // "abc123"
'abc'.padEnd(1);           // "abc"
```