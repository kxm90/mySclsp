# mySlcsp - Code is built and tested on Node.js V16.9.0 and requires 'fs', 'util' and 'console'
# All the *csv files need to be in the same location where myUtil.js file is present
# There are three csv files (slcsp.csv, zips.csv & plans.csv downloaded from the project page)...
# and two csv files that starts with test for testing purpose only which contains a single record each (testSlcsp.csv & testZips.csv)
# From any unix/linux or windows command prompt - cd to the location where myUtil.js installed
# 1) Enter the command below to check the second lowest cost of silver plan for all the zip codes present in slcsp.csv file.
#  node app.js 
# 2) Run below to check on the test cases
#  npm test
# 3) run below to check on the test coverage 
#  npx jest --coverage

# Note: Code is not implemented to handle cases where there are more than one county with same zipcode for a given state and rate_area
