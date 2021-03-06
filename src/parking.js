#!/usr/bin/env node

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
});

let cars = [];
let parkingPlaces = [];
let originalLinks = [];

function createCarsOrParkingSlots(line) {
    let s = line.split(" ");
    // console.log(s)
    for (let i = 0; i < parseInt(s[2]); i++) {
        let item = {};
        item.element = s[0] + "_" + (i + 1);
        item.street = s[1][0];
        item.avenue = s[1][2];
        if (line[0] === "B") {
            cars.push(item);
        }
        if (line[0] === "P") {
            parkingPlaces.push(item);
        }
    }
}

rl.on('line', function (line) {
    originalLinks.push(line);
    createCarsOrParkingSlots(line);
})

let permArr = [], usedChars = [];

function getCombinationsOfParkingPlaces(parkingPlaces) {
    var i, ch;
    for (i = 0; i < parkingPlaces.length; i++) {
        ch = parkingPlaces.splice(i, 1)[0];
        usedChars.push(ch);
        if (parkingPlaces.length === 0) {
            permArr.push(usedChars.slice());
        }
        getCombinationsOfParkingPlaces(parkingPlaces);
        parkingPlaces.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
}


// gonna take permutations of indexes from here, and use it to mix
// string_nth_permutation from https://www.javaer101.com/en/article/2074170.html
function string_nth_permutation(str, n) {
    var len = str.length, i, f, res;

    for (f = i = 1; i <= len; i++)
        f *= i;

    if (n >= 0 && n < f) {
        for (res = ""; len > 0; len--) {
            f /= len;
            i = Math.floor(n / f);
            n %= f;
            res += str.charAt(i);
            str = str.substring(0, i) + str.substring(i + 1);
        }
    }
    return res;
}

// factorial function from https://www.freecodecamp.org/news/how-to-factorialize-a-number-in-javascript-9263c89a4b38/
function factorial(num) {
    if (num === 0 || num === 1)
        return 1;
    for (var i = num - 1; i >= 1; i--) {
        num *= i;
    }
    return num;
}

function getKeysForPermutation() {
    let sResult = "";
    for (let i = 0; i < parkingPlaces.length; i++) {
        sResult = sResult.concat(String.fromCharCode(i));
    }
    return sResult;
}

// maximum of parking places is 170
rl.on('close', (input) => {

    let keyStringForPermutations = getKeysForPermutation();
    // console.log(keyStringForPermutations);

    let numberOfPermutations = factorial(cars.length);

    // let combParkingPlaces = getCombinationsOfParkingPlaces(parkingPlaces);
    // console.log("asd");
    // console.log(combParkingPlaces);
    // console.log("asd");
    let minDistance = Number.MAX_VALUE;
    let finalKey = "";
    for (let i = 0; i < numberOfPermutations; i++) {
        let localDistance = 0;

        let key = string_nth_permutation(keyStringForPermutations, i);

        for (let j = 0; j < cars.length; j++) {
            let distance = Math.abs(cars[j].avenue - parkingPlaces[key.charCodeAt(j)].avenue) + Math.abs(cars[j].street - parkingPlaces[key.charCodeAt(j)].street);
            localDistance += distance;
        }
        if (localDistance < minDistance) {
            minDistance = localDistance;
            finalKey = key;
        }
    }
    // console.log(cars);
    // console.log(parkingPlaces);
    // console.log(originalLinks);

    let totalDistance = 0;
    for (let j = 0; j < cars.length; j++) {
        let distance = Math.abs(cars[j].avenue - parkingPlaces[finalKey.charCodeAt(j)].avenue) + Math.abs(cars[j].street - parkingPlaces[finalKey.charCodeAt(j)].street);
        process.stdout.write(cars[j].element);
        process.stdout.write(" -> ");
        process.stdout.write(parkingPlaces[finalKey.charCodeAt(j)].element);
        process.stdout.write(": ");
        process.stdout.write(distance.toString());
        console.log();
        totalDistance += distance;
    }
    console.log("Celkem: " + totalDistance);
});