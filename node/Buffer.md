### ArrayBuffer
ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。ArrayBuffer 不能直接操作，而是要通过[类型数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray)或[DataView]()对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。\
*`TypedArray`一个TypedArray 对象描述一个底层的二进制数据缓存区的一个类似数组(array-like)视图。事实上，没有名为 TypedArray的全局对象，也没有一个名为的 TypedArray构造函数。*
#### 语法
> new ArrayBuffer(length)
- 参数：length表示要创建的ArrayBuffer的大小，单位为字节
- 返回值：一个指定大小的ArrayBuffer对象，其内容被初始化为0
- 异常：如果length大于Number.MAX_SAFE_INTEGER(>=2**53)或为负数，则抛出一个RangeError异常。
### Unit8Array
Uint8Array 数组类型表示一个 8 位无符号整型数组，创建时内容被初始化为 0。创建完后，可以以`对象的方式或使用数组下标索引的方式`引用数组中的元素。
#### 语法
Unit8Array(length);// 创建初始化为0的，包含length个元素的无符号整型数组Unit8Array(typedArray);Unit8Array(object);Unit8Array(buffer[,byteOffset[,length]])
[buffer](./buffer.js)

