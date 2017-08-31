# TickTick API

A Node.js module for using the UNOFFICIAL api for TickTick.com

There is no official API available so this uses the api based on the website. Since it's undocumented it may change at any time and this module may stop working.

## Usage

All you need is your TickTick login and you can begin adding tasks.

```javascript
let tick = require('./tick.js')

async function main() {
    let t = await new tick({ username: "email@email.com", password: "supersecurestuff" });
    await t.addTask("Put on heroku");
}

main();
```

## Promises

Each function returns a promise. The login function returns a promise with a new object that has the cookies stored for the login session.

If an error occurs at any part of the request a request will be thrown.

## API

### tick.addTask("Update readme");

Adds a task to the inbox of the logged in user.

```javascript
tick.addTask("Update readme");
```
## Contributing
As you can see, this repo is still in it's infancy. If you're like to contribute feel free to open an issue or make a pull request.

## TODO
These are features I may add in the future
* Mark task completed
* Get list of current tasks
* Add task with due date

