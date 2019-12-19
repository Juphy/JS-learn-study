function isPrimeNum(num) {
    if (!isNum(num)) {
        return false;
    }
    if (!isInteger(num)) {
        return false;
    }
    for (var i = 2; i <= Math.sqrt(num); i++) {
        if (num % i == 0) {
            return false;
        }
    };
    return true;
}

function isInteger(num) {
    return num == ~~num ? true : false;
}

function isNum(num) {
    return num == +num ? true : false;
}

function isPrimeNum1(num) {
    
}