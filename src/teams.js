#!/usr/bin/env node

let debugPass = false;

let firstLine = true;

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin,
});

var dict = [];
var matrix = {};

function debug(s) {
    if (debugPass) {
        console.log(s);
    }
}

function createMatrix(line) {
    var i = 0;

    lines = line.split(',');
    lines.forEach(function (line) {
        dict[i] = line.trim();
        i++;
    })

    dict.forEach(function (person) {
        matrix[person] = {};
        dict.forEach(function (person2) {
            matrix[person][person2] = 0;
        })
    })
}


function writeEdgeToMatrix(line) {
    if (line.length === 0) {
        return;
    }

    debug("line: " + line);
    let edge = line.split("-");

    if (edge.length !== 2 || edge[0].length === 0 || edge[1].length === 0) {
        console.error("ERROR: Line is ignored because of unexpected format: " + line);
        return;
    }

    edge = edge.map(function (node) {
        return node.trim();
    })

    matrix[edge[0]][edge[1]] = 1;
    matrix[edge[1]][edge[0]] = 1;
}


rl.on('line', function (line) {
    if (firstLine) {
        firstLine = false;

        createMatrix(line);

        dict.forEach(function (person) {
            matrix[person][person] = 0;
        })

        return;
    }

    writeEdgeToMatrix(line);
})

// team can be empty
function isBlockedByTeamMember(team, person) {
    for (let i = 0; i < team.length; i++) {
        if (matrix[team[i]][person] === 1) {
            return true;
        }
    }
    return false;
}

function getTeamMemberFromPreviousTeams(person) {

    for (let i = 0; i < teams.length; i++) {
        let team = teams[i];
        if(team.length <= 2){
            continue;
        }
        for (let j = 0; j < team.length; j++) {
            if (matrix[team[j]][person] === 0) {
                return team.splice(j, 1)[0];
            }
        }
    }
}

let teams = [];
rl.on('close', (input) => {

    for (let i = 0; i < dict.length; i++) {
        let team = [];
        for (let j = i; j < dict.length; j++) {
            if (matrix[dict[j]][dict[j]] === 0) {
                if (matrix[dict[i]][dict[j]] === 0) {
                    if (!isBlockedByTeamMember(team, dict[j])) {
                        matrix[dict[j]][dict[j]] = 1;
                        team.push(dict[j]);
                    }
                }
            }

        }

        if (team.length === 1) {
            team.push(getTeamMemberFromPreviousTeams(team[0]));
        }

        if (team.length) {
            teams.push(team);
        }
    }

    // console.log(teams);

    for (let i = 0; i < teams.length; i++) {
        for (let j = 0; j < teams[i].length; j++) {
            process.stdout.write(teams[i][j]);

            if (j+1 !== teams[i].length) {
                process.stdout.write(", ");
            }
        }
        console.log();
    }

});