#!/usr/bin/env node
let debugPass = false;

let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
});

function debug(s) {
    if (debugPass) {
        console.log(s);
    }
}

//TODO totally rework from distribution to evacuation

function getCombinations(valuesArray, nLengthOfCombinations) {
    let combinations = [];
    let length = valuesArray.length;
    for (let i = 0; i < Math.pow(2, length); i++) {
        let tmp = [];
        for (let j = 0; j < length; j++) {
            if ((i & Math.pow(2, j))) {
                tmp.push(valuesArray[j]);
            }
        }
        if (tmp.length > 0) {
            combinations.push(tmp);
        }
    }
    combinations = combinations.filter(function (comb) {
        return comb.length === nLengthOfCombinations
    });
    return combinations;
}

function validateLine(line) {
    if (line.length < 2) {
        return false;
    }
    // TODO add more validation for input
    return true;
}

let firstLine = true;
let storageStops = [];
let firstRoom = [];
let routes = [];

rl.on('line', function (line) {
    if (firstLine) {
        firstLine = false;

        firstRoom = line.split(':');
        firstRoom[1] = firstRoom[1].trim();
        return;

    }

    let route = [];
    route.push(line.split(":")[0]);
    route.push(line.split(":")[1].split(">")[0].trim());
    route.push(line.split(":")[1].split(">")[1].trim().split(" ")[0].trim());
    route.push(line.split(":")[1].split(">")[1].trim().split(" ")[1].trim());

    routes.push(route);

})


function getIndex(place) {
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i] === place) {
            return i;
        }
    }
}

function getLengthOfLongestPath() {
    let stack = [];
    let index = 0;
    for (let i = 0; i < graphWithActualFlow[index].length; i++) {
        if (graphWithActualFlow[index][i]) {
            stack.push(i + "");
        }
    }
    index = stack.pop();

    let possiblePaths = [];
    let maxLength = 0;
    while (index) {
        let j = parseInt(index[index.length-1]);
        let b = false;

        for (let i = 0; i < graphWithActualFlow[j].length; i++) {

            if (graphWithActualFlow[j][i]) {
                b = true;
                stack.push(index.concat(i));
            }
        }

        if(!b){
            possiblePaths.push(index);
        }
        index = stack.pop();
    }

    possiblePaths = possiblePaths.sort(function(a,b){
        return  b.length - a.length ;
    })

    return possiblePaths[0].length;
}

rl.on('close', function (input) {
    // console.log(firstRoom);
    // console.log(routes);
    createMatrix();
    // console.log(rooms);
    let groupSize = fordFulkerson(cleanMatrix, 0, rooms.length - 1);
    console.log("Group size: " + groupSize);
    // console.log(graphWithActualFlow);


    for (let i = 0; i < routes.length; i++) {
        let route = routes[i];
        let index1 = getIndex(route[1]);
        let index2 = getIndex(route[2]);
        let optimalFlow = graphWithActualFlow[index1][index2];
        process.stdout.write(route[0]);
        process.stdout.write(": ");
        if (optimalFlow === parseInt(route[3])) {
            process.stdout.write("!");
        }
        process.stdout.write(optimalFlow.toString());
        if (optimalFlow === parseInt(route[3])) {
            process.stdout.write("!");
        }
        console.log();
    }

    let lengthOfLongestPath = getLengthOfLongestPath();
    console.log("Time: " + (Math.ceil(parseInt(firstRoom[1]) / groupSize) + lengthOfLongestPath - 1));
});


let matrix = {};
let cleanMatrix = [];
let rooms = [];

function createMatrix() {

    let allRooms = [firstRoom[0]];
    routes.forEach(function (route) {
        allRooms.push(route[1]);
        allRooms.push(route[2]);
    })
    // console.log(allRooms);


    allRooms = allRooms.filter(function (room) {
        return room !== 'EXIT';
    })
    // console.log(allRooms);

    allRooms.push('EXIT');

    rooms = allRooms.reduce(function (a, b) {
        if (a.indexOf(b) < 0) a.push(b);
        return a;
    }, []);

    // console.log(rooms);

    rooms.forEach(function (room) {
        matrix[room] = {};
        rooms.forEach(function (room2) {
            matrix[room][room2] = getCapacityForEdge(room, room2);
        })
    })

    // console.log(matrix);

    rooms.forEach(function (room) {
        let row = [];
        rooms.forEach(function (room2) {
            row.push(matrix[room][room2]);
        })
        cleanMatrix.push(row);
    })
    // console.log(cleanMatrix);

}

function getCapacityForEdge(room, room2) {
    let capacity = 0;
    routes.forEach(function (route) {
        if (route[1] === room && route[2] === room2) {
            capacity = route[3];
        }
    })
    return parseInt(capacity);
}


// inspired from https://github.com/prabod/Graph-Theory-Ford-Fulkerson-Maximum-Flow/blob/master/index.js
function bfs(rGraph, sourcePlace, destinationPlace, parent) {
    let visited = [];
    let queue = [];
    // Create a visited array and mark all vertices as not visited
    for (let i = 0; i < rGraph.length; i++) {
        visited[i] = false;
    }
    // Create a queue, enqueue source vertex and mark source vertex as visited
    queue.push(sourcePlace);
    visited[sourcePlace] = true;
    parent[sourcePlace] = -1;

    while (queue.length != 0) {
        let p = queue.shift();
        for (let i = 0; i < rGraph.length; i++) {
            if (visited[i] == false && rGraph[p][i] > 0) {
                queue.push(i);
                parent[i] = p;
                visited[i] = true;
            }
        }
    }
    return visited[destinationPlace] == true;
}

let graphWithActualFlow = [];

// inspired from https://github.com/prabod/Graph-Theory-Ford-Fulkerson-Maximum-Flow/blob/master/index.js
function fordFulkerson(graph, sourcePlace, destinationPlace) {

    let rGraph = [];
    for (let i = 0; i < graph.length; i++) {
        let tmp = [];
        for (let j = 0; j < graph.length; j++) {
            tmp.push(graph[i][j]);
        }
        rGraph.push(tmp);
    }
    let parent = [];
    let maxFlow = 0;

    // console.log(rGraph)

    while (bfs(rGraph, sourcePlace, destinationPlace, parent)) {
        let pathFlow = Number.MAX_VALUE;
        for (let i = destinationPlace; i != sourcePlace; i = parent[i]) {
            let p = parent[i];
            pathFlow = Math.min(pathFlow, rGraph[p][i]);
        }
        for (let i = destinationPlace; i != sourcePlace; i = parent[i]) {
            let p = parent[i];
            rGraph[p][i] -= pathFlow;
            rGraph[i][p] += pathFlow;
        }
        maxFlow += pathFlow;
    }
    // Return the overall flow
    // console.log(rGraph)


    let graph2 = [];
    for (let i = 0; i < rGraph.length; i++) {
        let f = [];
        let f2 = [];
        for (let j = 0; j < rGraph[i].length; j++) {
            let a = graph[i][j] - rGraph[i][j];
            if (a < 0) {
                a = 0;
            }
            f2.push(a);
        }
        graph2.push(f2)
    }
    // console.log(graph2)

    graphWithActualFlow = graph2;
    return maxFlow;
}

