/*
This file is just an example of how this library could be used


*/

let tick = require('./tick.js')

async function main() {
    try {
        let t = await new tick({ username: "email@email.com", password: "supersecurestuff" });
        console.log("end");
        await t.addTask("Put on heroku");
    } catch (e) {
        console.log(e);
    }
}

main();
