const csv = require('csv-parser');
const { json } = require('express/lib/response');
const fs = require('fs');
const results = [];

fs.createReadStream('../asset/IPL_Matches_Data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        fs.writeFileSync('../asset/IPL_Matches_Data.json', JSON.stringify(results.filter(val => val.season === '2019')), err => {
            if (err) {
                console.error(`csvReader - ${err}`);
                return;
            }
        });
    });