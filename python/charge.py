from mymodularity import timestamp

print("Press RETURN for the time (costs 2 cents).")
print("Press Q RETURN to quit.")

total = 0

while True:
    kbd = input()
    if  kbd.lower() == 'q':
        print("You owe $" + str(total))
        exit()
    else:
        charge = timestamp.Timer('Time is ')
        total = total + charge
            