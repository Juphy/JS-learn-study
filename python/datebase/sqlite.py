# 导入SQLite驱动，SQLite的特点是轻量级，可嵌入，但不能承受高并发访问，适合桌面和移动应用。
# SQLite是一种嵌入式数据库，它的数据库就是一个文件，由于SQLite本身是C写的，而且体积小，python内置SQLite3。
# 表是数据库中存放关系数据的集合，一个数据库里面通常包含多个表。
# 要操作数据库，首先需要连接到数据库，一个数据库连接称为Connection，连接到数据库后，需要打开游标，称之为cursor，通过cursor执行SQL语句，然后获得执行结果。
import sqlite3
# # 链接到SQLite数据库，数据库文件是test.db，如果文件不存在，会自动在当前目录创建
# conn = sqlite3.connect('test.db')
# cursor = conn.cursor()  # 创建一个cursor
# # 执行一条SQL语句，创建user表
# cursor.execute(
#     'create table user (id vachar(20) primary key, name varchar(20))')
# # SQL语句，插入一条记录
# cursor.execute('insert into user (id, name) values (\'1\', \'Michael\')')
# print(cursor.rowcount)  # rowcount获得插入的行数
# cursor.close()
# conn.commit()
# conn.close()

conn = sqlite3.connect('test.db')
cursor = conn.cursor()
cursor.execute('select * from user where id =?', ('1',))

values = cursor.fetchall()
print(values)
cursor.close()
conn.close()

# cursor 对象执行insert，update，delete语句时，执行结果有rowcount返回影响的行数，，就可以拿到执行结果。
# 使用cursor执行select语句时，通过fetchall()可以拿到结果集。结果集是一个list，每个元素都是一个tuple，对应一行记录。
# SQL语句带有参数，那么需要把参数按照位置传递给execute()方法，有几个?占位符就必须对应几个参数。
# cursor.execute('select * from user where name=? and pwd=?', ('abc', 'password'))
