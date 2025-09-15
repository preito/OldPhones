@echo off
REM Change to the MongoDB bin directory
cd /d "C:\Program Files\MongoDB\Server\8.0\bin"

REM Import JSON array into the 'COMP5347' database, 'mobile_website' collection
mongoimport --jsonArray --db COMP5347 --collection phonelisting --file "C:\Users\sharm\OneDrive - The University of Victoria (Students)\COMP5347 - WAD\A2\TUT3-G6\app\data\phonelisting.json"

REM Import JSON array into the 'COMP5347' database, 'mobile_website' collection
mongoimport --jsonArray --db COMP5347 --collection userlist --file "C:\Users\sharm\OneDrive - The University of Victoria (Students)\COMP5347 - WAD\A2\TUT3-G6\app\data\userlist.json"

pause
