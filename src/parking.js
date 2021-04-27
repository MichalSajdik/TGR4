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

rl.on('close', (input) => {

    let combParkingPlaces = getCombinationsOfParkingPlaces(parkingPlaces);
    // console.log("asd");
    // console.log(combParkingPlaces);
    // console.log("asd");
    let minDistance = Number.MAX_VALUE;
    let minimalCombParkingPlace = 0;
    for (let i = 0; i < combParkingPlaces.length; i++) {
        let localDistance = 0;
        for (let j = 0; j < combParkingPlaces[i].length; j++) {
            let distance = Math.abs(cars[j].avenue - combParkingPlaces[i][j].avenue) + Math.abs(cars[j].street - combParkingPlaces[i][j].street);
            // process.stdout.write(cars[j].element);
            // process.stdout.write(" -> ");
            // process.stdout.write(combParkingPlaces[i][j].element);
            // process.stdout.write(": ");
            // process.stdout.write(distance.toString());
            // console.log();
            localDistance += distance;
        }
        if (localDistance < minDistance) {
            minDistance = localDistance;
            minimalCombParkingPlace = i;
        }
    }

    // console.log(cars);
    // console.log(parkingPlaces);
    // console.log(originalLinks);

    let totalDistance = 0;
    for (let j = 0; j < cars.length; j++) {
        let distance = Math.abs(cars[j].avenue - combParkingPlaces[minimalCombParkingPlace][j].avenue) + Math.abs(cars[j].street - combParkingPlaces[minimalCombParkingPlace][j].street);
        process.stdout.write(cars[j].element);
        process.stdout.write(" -> ");
        process.stdout.write(combParkingPlaces[minimalCombParkingPlace][j].element);
        process.stdout.write(": ");
        process.stdout.write(distance.toString());
        console.log();
        totalDistance += distance;
    }
    console.log("Celkem: " + totalDistance);
});