'use strict';
var request = require('request');
var ObjectID = require("bson-objectid");

module.exports = class tick {
    constructor(options) {
        /*
        options should include {
            username: "email@email.com"
            password: "user password here"
        }
        */
        this.sortOrder = 0;
        this.request = request.defaults({ 'jar': true });
        return new Promise((resolve, reject) => {
            this.login(options.username, options.password)
                .then(async () => {
                    await this.getSortOrder();
                    resolve(this);
                })
        })
    }

    login(username, password) {
        const url = "https://ticktick.com/api/v2/user/signon?wc=true&remember=true";
        console.log("login started");
        const options = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                Origin: "https://ticktick.com"
            },
            json: {
                username: username,
                password: password
            }
        };
        return new Promise((resolve, reject) => {
            this.request(options, function (error, request, body) {
                console.log("login done");
                if (body.username !== undefined) {
                    resolve();
                } else {
                    throw new Error("Could not login");
                }
            });
        });
    }
    getSortOrder() {
        console.log("get sort order started");
        return new Promise((resolve, reject) => {
            var parent = this;
            const url = "https://ticktick.com/api/v2/batch/check/0";

            this.request(url, function (error, response, body) {
                body = JSON.parse(body);
                parent.inboxId = body.inboxId;
                body.syncTaskBean.update.forEach(task => {
                    if (task.projectId == parent.inboxId && task.sortOrder < parent.sortOrder) {
                        parent.sortOrder = task.sortOrder;
                    }
                });
                parent.sortOrder--;
                console.log("the sort order is: ", parent.sortOrder);
                resolve();
            });
        });
    }

    //the default list will be inbox
    addTask(title, projectId = this.inboxId) {
        const url = "https://ticktick.com/api/v2/task";
        console.log("Add task started");
        const options = {
            method: "POST",
            url: url,
            headers: {
                "Content-Type": "application/json",
                Origin: "https://ticktick.com"
            },
            json: {
                modifiedTime: new Date().toISOString().replace("Z", "+0000"), //"2017-08-12T17:04:51.982+0000",
                id: ObjectID(),
                title: title,
                priority: 0,
                status: 0,
                deleted: 0,
                timeZone: "America/New_York", // This needs to be updated to grab dynamically
                content: "",
                sortOrder: this.sortOrder,
                projectId: projectId,
                startDate: null,
                dueDate: null,
                items: [],
                assignee: null,
                progress: 0,
                tags: [],
                isAllDay: null,
                reminder: null,
                reminders: null,
                remindTime: null,
                local: true
            }
        };

        return new Promise((resolve, reject) => {
            this.request(options, function (error, response, body) {
                console.log("Added: " + title);
                this.sortOrder = body.sortOrder - 1;
                resolve(body);
            });
        });
    }
}
