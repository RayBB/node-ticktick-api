# TickTick API

A Node.js module for using the UNOFFICIAL API for TickTick.com

There is no official API available so this uses the API based on calls their site makes. Since it's undocumented it may change at any time and this module may stop working.

## Usage

All you need is your TickTick login and you can begin adding tasks.

```javascript
let tick = require('./tick.js')

async function main() {
    let t = await new tick({ username: "email@email.com", password: "supersecurestuff" });
    let due = new Date("04 August 2018 14:48");
    due = due.toISOString().replace("Z", "+0000");  // The api only accepts dates in this format
    options = {title: "Update the API wrapper", dueDate: due}
    await t.addTask(options);
}

main();
```

## Promises

Each function returns a promise. The login function returns a promise with a new object that has the cookies stored for the login session.

If an error occurs at any part of the request a request will be thrown.

## API

### tick.addTask(options);

Adds a task to the inbox of the logged in user.

```javascript
tick.addTask({title: "my great task"});
```
## Contributing
As you can see, this repo is still in it's infancy. If you're like to contribute feel free to open an issue or make a pull request.

## TODO
These are features I may add in the future
* Mark task completed
* Get list of current tasks
* Add task with due date

