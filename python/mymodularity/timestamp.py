#!/usr/bin/env python3
import time

total = 0

def Timer(msg=''):
    print(str(msg) + str(time.time()))
    charge = 0.02
    return charge

print("Press RETURN for the time (costs 2 cents).")
print("Press Q RETURN to quit.")
while True:
    kbd = input()
    if kbd.lower() == "q":
        print("You owe $" + str(total))
        exit()
    else:
        charge = Timer("Time is ")
        total = total + charge
