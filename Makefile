build:
	cp src/parking.js parkingCompile
	touch  parking
	echo '#!/bin/bash' > parking
	echo 'node' 'parkingCompile' >> parking
	chmod +x parking

clean:
	rm -rf parking
	rm -rf parkingCompile