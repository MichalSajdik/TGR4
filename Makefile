build:
	cp src/parking.js parkingCompile
	touch  parking
	echo '#!/bin/bash' > parking
	echo 'node' 'parkingCompile' >> parking
	chmod +x parking
	cp src/teams.js teamsCompile
	touch  teams
	echo '#!/bin/bash' > teams
	echo 'node' 'teamsCompile' >> teams
	chmod +x teams

clean:
	rm -rf parking
	rm -rf parkingCompile
	rm -rf teams
	rm -rf teamsCompile