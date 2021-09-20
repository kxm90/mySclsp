
const slcspOperations = {

    /** @function ...
     * Read a given file and return the records if present or log an error
     */
    read: function readFile(fileName) {
        let fs = require('fs');
        let parse = require('csv-parse/lib/sync');
        let records;
        try {
            const data = fs.readFileSync(fileName, 'utf8')
            records = parse(data, { columns: true });
        } catch (err) {
            console.log("error reading file : " + err);
        }
        return records;
    }//end read
    ,

    /** @function ...
     * Get the second lowest silver plan rate for a given state, metal_level and rate_area
     */
    SLCSPRate: function determineSLCSPRate(plansRecords, state, metal, rate_area) {
        let matchingPlanRates = new Array();
        let matchingPlans = new Array();
        let id = 0;
        for (let p = 0; p < plansRecords.length; p++) {
            //only collect matching entries are covered before picking up another plan record
            let planFlag = false;
            let plan = new slcspOperations.Plan();
            for (let planRecord in plansRecords[p]) {

                if ((planRecord === 'state') && (plansRecords[p]['state'] === state) && (planFlag === false)) {
                    planFlag = true;
                    plan.id = ++id;
                    plan.state = plansRecords[p][planRecord];
                    //console.log("FOUND..." + planRecord + ": " + plansRecords[p][planRecord] + " plan.state: " + plan.state +  "\n");
                } else if (planFlag && (planRecord === 'metal_level') && plansRecords[p]['metal_level'] === metal) {
                    plan.metal = plansRecords[p][planRecord];
                } else if (planFlag && (planRecord === 'rate') && plansRecords[p]['rate'] !== null) {
                    plan.rate = plansRecords[p][planRecord];
                } else if (planFlag && (planRecord === 'rate_area') && (+plansRecords[p]['rate_area']) === rate_area) {
                    plan.rate_area = plansRecords[p][planRecord];
                    //console.log("plan :", util.inspect(plan, false, null, true));
                    if (plan.metal != null && plan.rate != null) { matchingPlans.push(plan); }
                    //console.log("matchingPlans :" + util.inspect(matchingPlans, false, null, true));
                    planFlag = false;
                }
            }
        }
        for (let p = 0; p < matchingPlans.length; p++) {

            for (let plan in matchingPlans[p]) {
                if (plan !== null && plan === 'rate') {
                    if (matchingPlanRates.indexOf(+matchingPlans[p][plan]) !== -1) {
                        //console.log(matchingPlans[p][plan] + " Value exists! ")
                    } else {//value doesn't exists
                        matchingPlanRates.push(+matchingPlans[p][plan]);
                    }
                }
            }
            //console.log("matchingPlanRates :" + util.inspect(matchingPlanRates, false, null, true));
        }

        if (matchingPlanRates.length === 1) {
            return matchingPlanRates[0];
        }

        let sorttedRated = matchingPlanRates.sort();
        return matchingPlanRates[1];
    }//slcspRate
    ,

    /** @function ... 
     *  Print/retrun all zip code SLCSP Rates for a given slcsp, zips and plans record files
     */
    SLCSPRatesByZipCode: function (slcspRecords, zipsRecords, plansRecords) {
        console.log("Total SLCSP records : " + slcspRecords.length + ". ZipCodes followed by corresponding SLCSP Rate below in the same order as SLCSP.csv");
        let zipRates = new Array();//track zipRate objects
        for (let i = 0; i < slcspRecords.length; i++) { //slcsp records
            let id = 0; //Counter for SLCSP zipcodes
            //if(i === 1) {i = records.length } //need to remove to process through all 
            for (let key in slcspRecords[i]) {
                //console.log(typeof(key) + " " + typeof(records[i]) + " " + (records[i]['zipcode']) );
                if (key === 'zipcode') { //only need to get zipcode 
                    //console.log(key + ": " + records[i][key]); 
                    let curZip = slcspRecords[i][key];
                    //todo:  check if slcsp zipcode exists in zipsRecords

                    for (let zi = 0; zi < zipsRecords.length; zi++) {
                        let zipFlag = false;
                        let zipRate = new slcspOperations.ZipRate();
                        // if(zi === 2) {zi = zipsRecords.length }
                        for (let zipRecord in zipsRecords[zi]) {
                            if ((+zipsRecords[zi]['zipcode'] === +curZip) && (zipFlag === false)) {
                                zipFlag = true;
                                zipRate.id = ++id;
                                zipRate.zipcode = +zipsRecords[zi][zipRecord];
                                // console.log("FOUND..." + zipRecord + ": " + zipsRecords[zi][zipRecord] + " zipRate.zipcode: " + zipRate.zipcode + " zipRate.id: " + zipRate.id + "\n");
                            } else if ((zipFlag) && (zipRecord === 'state')) {
                                zipRate.state = zipsRecords[zi][zipRecord];

                            } else if ((zipFlag) && (zipRecord === 'county_code')) {
                                zipRate.county_code = zipsRecords[zi][zipRecord];
                            } else if ((zipFlag) && (zipRecord === 'rate_area')) {
                                zipFlag = false;
                                // console.log("rate_area: " + zipsRecords[zi][zipRecord]);
                                zipRate.rate_area = +zipsRecords[zi][zipRecord];
                                if (zipRate.state !== null && zipRate.rate_area !== null) {
                                    zipRate.rate = slcspOperations.SLCSPRate(plansRecords, zipRate.state, 'Silver', zipRate.rate_area);
                                    if (zipRate.rate !== null) {
                                        zipRates.push(zipRate)
                                    }
                                }
                                //console.log("zipRates :", util.inspect(zipRates, false, null, true));
                            }

                        }
                    }
                    break;
                }
            }
            console.log(i < 10 ? (' Zipcode[ ' + i + ']: ' + zipRates[i].zipcode + "     SLCSP Rate: " + zipRates[i].rate) : (' Zipcode[' + i + "]: " + zipRates[i].zipcode + "     SLCSP Rate: " + zipRates[i].rate));
        }//End for slcspRecords
        return zipRates;
    }//END printSlcspRate
    ,

    /** @class 
     * ZipRate class is to help store all details related to zipcode and related slcsp plan rate information
     */

    ZipRate: class ZipRate {
        constructor(id, zipcode, state, county_code, name, rate_area, rate) {
            this.id = id;
            this.zipcode = zipcode;
            this.state = state;
            this.county_code = county_code;
            this.name = name;
            this.rate_area = rate_area;
            this.rate = rate;
        }
    }//END ZipRate class
    ,

    /** @class
     * Plan class is to store plan related information obtained from the file
    */
    Plan: class Plan {
        constructor(id, state, metal, rate, rate_area) {
            this.id = id;
            this.state = state;
            this.metal = metal;
            this.rate = rate;
            this.rate_area = rate_area;
        }
    }//END Plan class

}
module.exports = slcspOperations;


const { Console } = require('console');
const util = require('util');

let slcspRecords = slcspOperations.read('slcsp.csv');
//let zipsRecords = slcspOperations.read('testZips.csv');
let zipsRecords = slcspOperations.read('zips.csv');
let plansRecords = slcspOperations.read('plans.csv');

slcspOperations.SLCSPRatesByZipCode(slcspRecords, zipsRecords, plansRecords);

