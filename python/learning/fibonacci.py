def fibonacci(n):
    if n == 1 or n == 2:
        return 1
    return factorial(n - 1) + fibonacci(n - 2)


def factorial(n):
    print('factorial() called! n=' + str(n))
    if n == 0:
        return 1
    return n * factorial(n - 1)


assert factorial(0) == 1
assert factorial(1) == 1
assert factorial(3) == 6
assert factorial(10) == 3628800
