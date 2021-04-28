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
	cp src/evacuation.js evacuationCompile
	touch  evacuation
	echo '#!/bin/bash' > evacuation
	echo 'node' 'evacuationCompile' >> evacuation
	chmod +x evacuation

clean:
	rm -rf parking
	rm -rf parkingCompile
	rm -rf teams
	rm -rf teamsCompile
	rm -rf evacuation
	rm -rf evacuationCompile