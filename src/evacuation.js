#!/usr/bin/env node
let debugPass = false;

var readline = require('readline');
var rl = readline.createInterface({
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

rl.on('close', (input) => {

    console.log(firstRoom);
    console.log(routes);
    createMatrix();

    console.log(fordFulkerson(cleanMatrix, 0, rooms.length -1))

    console.log(graphWithActualFlow)

});


let matrix = {};
let cleanMatrix = [];
let rooms = [];
function createMatrix() {

    let allRooms = [firstRoom[0]];
    routes.forEach(function(route){
        allRooms.push(route[1]);
        allRooms.push(route[2]);
    })
    // console.log(allRooms);


    allRooms = allRooms.filter(function(room){
        return room !== 'EXIT';
    })
    // console.log(allRooms);

    allRooms.push('EXIT');

    rooms = allRooms.reduce(function(a,b){
        if (a.indexOf(b) < 0 ) a.push(b);
        return a;
    },[]);

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

function getCapacityForEdge(room, room2){
    let capacity = 0;
    routes.forEach(function(route){
        if(route[1] === room && route[2] === room2){
            capacity = route[3];
        }
    })
    return parseInt(capacity);
}




function bfs(rGraph, s, t, parent) {
    var visited = [];
    var queue = [];
    var V = rGraph.length;
    // Create a visited array and mark all vertices as not visited
    for (var i = 0; i < V; i++) {
        visited[i] = false;
    }
    // Create a queue, enqueue source vertex and mark source vertex as visited
    queue.push(s);
    visited[s] = true;
    parent[s] = -1;

    while (queue.length != 0) {
        var u = queue.shift();
        for (var v = 0; v < V; v++) {
            if (visited[v] == false && rGraph[u][v] > 0) {
                queue.push(v);
                parent[v] = u;
                visited[v] = true;
            }
        }
    }
    //If we reached sink in BFS starting from source, then return true, else false
    return (visited[t] == true);
}

let graphWithActualFlow = [];
function fordFulkerson(graph, s, t) {
    /* Create a residual graph and fill the residual graph
     with given capacities in the original graph as
     residual capacities in residual graph
     Residual graph where rGraph[i][j] indicates
     residual capacity of edge from i to j (if there
     is an edge. If rGraph[i][j] is 0, then there is
     not)
    */
    if (s < 0 || t < 0 || s > graph.length-1 || t > graph.length-1){
        throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid sink or source");
    }
    if(graph.length === 0){
        throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph");
    }
    var rGraph = [];
    for (var u = 0; u < graph.length; u++) {
        var temp = [];
        if(graph[u].length !== graph.length){
            throw new Error("Ford-Fulkerson-Maximum-Flow :: invalid graph. graph needs to be NxN");
        }
        for (v = 0; v < graph.length; v++) {
            temp.push(graph[u][v]);
        }
        rGraph.push(temp);
    }
    var parent = [];
    var maxFlow = 0;

    // console.log(rGraph)

    while (bfs(rGraph, s, t, parent)) {
        var pathFlow = Number.MAX_VALUE;
        for (var v = t; v != s; v = parent[v]) {
            u = parent[v];
            pathFlow = Math.min(pathFlow, rGraph[u][v]);
        }
        for (v = t; v != s; v = parent[v]) {
            u = parent[v];
            rGraph[u][v] -= pathFlow;
            rGraph[v][u] += pathFlow;
        }
        maxFlow += pathFlow;
    }
    // Return the overall flow
    // console.log(rGraph)


    let graph2 = [];
    for(let i = 0 ; i < rGraph.length ; i++){
        let f = [];
        let f2 = [];
        for(let j = 0 ; j < rGraph[i].length ; j++){
            // if(graph[i][j] === 0){
            //     f.push(0);
            // }else{
            //     f.push(rGraph[j][i]);
            // }
            let a = graph[i][j] - rGraph[i][j];
            if(a < 0){
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

