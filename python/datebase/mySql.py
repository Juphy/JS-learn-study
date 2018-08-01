# pymysql中的SQL不支持？的占位符，执行INSERT等操作后要调用commit()提交事务
import pymysql
conn = pymysql.connect(user='root', password='123456',
                       host='localhost', db='test', port=3306)
cursor = conn.cursor()
cursor.execute(
    'create table user (id varchar(20) primary key , name varchar(20))')
cursor.execute('insert into user (id ,name)  values (%s, %s)', ['1', 'Michael'])
print(cursor.rowcount)
conn.commit()  # 提交事务
cursor.close()
cursor = conn.cursor()
cursor.execute('select * from user where id = %s', ('1',))
values = cursor.fetchall()
print(values)
cursor.close()
conn.close()

conn = pymysql.connect(user='root', password='123456')
