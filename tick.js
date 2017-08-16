'use strict';
var request = require('request');

module.exports = class tick {
    constructor(options) {
        this.request = request.defaults({'jar':true});
        login(options.username, options.password);
    }

    login() {
        
    }

    verifyLogin() {
        
    }

    addTask() {
        
    }
}