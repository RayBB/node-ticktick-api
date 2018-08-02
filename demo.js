/*
Example of how this library could be used
*/

let tick = require('./src/tick.js')

async function main() {
    try {
        let t = await new tick({ username: "email@email.com", password: "supersecurestuff" });
        let due = new Date("04 August 2018 14:48");
        due = due.toISOString().replace("Z", "+0000"); // The api only accepts dates in this format
        options = {title: "put on aawww yeah ", dueDate: due}
        await t.addTask(options);
    } catch (e) {
        console.log(e);
    }
}

main();
