require('dotenv-defaults').config();
const fs = require('fs');

const Board = require('./src/models/Board');
const Time = require('./src/models/Time');

const logger = require('./src/utils/log.utils');

(async () => {
    // It works as expected, as long as you use the await keyword.
    const example = await new Board('SMC');
    console.log("===================================================")
    console.log("")
    const week2Issues = example.getIssues('2019-12-09', '2019-12-13');

    fs.writeFileSync('./file.json', JSON.stringify(week2Issues));

    const monthIssues = example.getIssues('2019-12-01', '2019-12-13');
    const week1Issues = example.getIssues('2019-12-02', '2019-12-08');

    const totalSecsWeek2 = week2Issues.reduce((prev, curr) => prev + curr.getTotalTime(), 0);
    const totalSecsWeek1 = week1Issues.reduce((prev, curr) => prev + curr.getTotalTime(), 0);
    const totalSecsMonth = monthIssues.reduce((prev, curr) => prev + curr.getTotalTime(), 0);

    console.log(`Total hours: ${totalSecsMonth/3600}`)
    console.log(`Total hours week 1: ${totalSecsWeek1/3600}`)
    console.log(`Total hours week 2: ${totalSecsWeek2/3600}`)


    console.log("===================================================")
    console.log("MONTH SUMMARY")

    monthIssues.map((is) => {
        console.log("===================================================")
        console.log(` [ISSUE][${is.name}] Total time: ${new Time(is.getTotalTime()).getHours()}`);
        is.worklogs.map(wl => {
            console.log(` [ISSUE][${is.name}][WORKLOG] ${wl.created}  => Author: ${wl.author.name} ,Time: ${wl.time.getHours()}`);
        })
    });


})();