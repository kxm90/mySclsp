
const util = require('util');
const slcspOperations = require('../myUtil');

//jest.setTimeout(10000);

describe("File Record Count Check", () => {
    const fileNames = [{ fileName: 'slcsp.csv', recordCount: 51 }, { fileName: 'plans.csv', recordCount: 22240 }, { fileName: 'zips.csv', recordCount: 51541 }, { fileName: 'testZips.csv', recordCount: 1 }, { fileName: 'testSlcsp.csv', recordCount: 1 }];

    test.each(fileNames)('Each file %j should have matching record count', ({ fileName, recordCount }) => {
        expect(slcspOperations.read(fileName).length).toEqual(recordCount)
    });

    test("should return sclsp records 'zipRate' info ", () => {

        let input = new slcspOperations.ZipRate();
        input.id = 1;
        input.zipcode = 64148;
        input.state = 'MO';
        input.county_code = '29095';
        input.rate_area = 3;
        input.rate = 245.2;

        let slcspRecords = slcspOperations.read('testSlcsp.csv');
        let zipsRecords = slcspOperations.read('testZips.csv');
        //let zipsRecords = slcspOperations.read('zips.csv');
        let plansRecords = slcspOperations.read('plans.csv');

        let result = slcspOperations.SLCSPRatesByZipCode(slcspRecords, zipsRecords, plansRecords);
        let output = new slcspOperations.ZipRate();
        if (result !== null && result.length === 1) {
            for (let ZipRate in result) {
                output = result[ZipRate];
            }
        }

        expect(1 === result.length).toBeTruthy();
        expect(output.zipcode).toEqual(input.zipcode);
        expect(output.rate).toEqual(input.rate);
        expect(output.state).toEqual(input.state);
        expect(output).toMatchObject(input);
    });

    /*test("should return 2nd lowest silver rate for a given state and rate_area", ({ state, metal, rate_area }) => {
        //jest.useRealTimers();
        let plansRecords = slcspOperations.read('plans.csv');
        var output = 597; //[580, 597, 635, 664, 580, 604, 638];
        var result = +slcspOperations.SLCSPRate(plansRecords, 'AK', 'Silver', 1);
        console.log(" output :" + util.inspect(output) + " result :", util.inspect(result));
        console.log(" output :" + typeof(output) + " result :", typeof(result));
        //expect(output).toBe(result);
        //expect(output === result).toBeTruthy();
        expect(output).toEqual(result);
        //console.log(" output :" + util.inspect(output) + " result :", util.inspect(result));
    }, 10000);
    */
});

