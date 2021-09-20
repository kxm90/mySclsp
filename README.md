# mySlcsp - Code is built and tested on Node.js V16.9.0 
# Create a directory (say mySlcsp) and download the homework.zip 
# unzip homework.zip in the same location (i.e. under mySlcsp) and run below 
# From any unix/linux or windows command prompt - change directory to mySlcsp (cd mySlcsp) and run below 
# npm install 
# Now under mySlcsp, you will see 3 csv files (slcsp.csv, zips.csv & plans.csv) 
# and 2 csv files ((testSlcsp.csv & testZips.csv)) that starts with test for testing purpose only which contains a single record each 
# 1) Enter the command below to check the second lowest cost of silver plan for all the zip codes present in slcsp.csv file.
#  node app.js 
# 2) Run below to check on the test cases
#  npm test
# 3) run below to check on the test coverage 
#  npx jest --coverage

# Note: Code is not implemented to handle cases where there are more than one county with same zipcode for a given state and rate_area
