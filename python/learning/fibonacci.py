def fibonacci():
    a, b, counter, ary = 0, 1, 0, []
    while True:
        ary.append(a)
        a, b = b, a + b
        counter += 1



a = fibonacci()
print(a)
# print(next(a))
# print(next(a))
# print(next(a))
# print(next(a))
print(a[10: 20])
