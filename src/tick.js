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
    getAllUncompletedTasks() {
        console.log("Get all Uncompleted tasks started")
        const url = "https://ticktick.com/api/v2/batch/check/1";
        const options = {
            method: "GET",
            url: url,
            headers: {
                Origin: "https://ticktick.com"
            },
        };

        return new Promise((resolve, reject) => {
            this.request(options, function (error, response, body) {
                body = JSON.parse(body);
                var tasks = body["syncTaskBean"]["update"];
                console.log("Retrevied all uncompleted tasks");
                resolve(tasks);
            });
        });
    }
    //the default list will be inbox
    addTask(jsonOptions) {
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
                modifiedTime: (jsonOptions.modifiedTime) ? jsonOptions.modifiedTime : new Date().toISOString().replace("Z", "+0000"), //"2017-08-12T17:04:51.982+0000",
                id: (jsonOptions.id) ? jsonOptions.id : ObjectID(),
                title: jsonOptions.title,
                priority: (jsonOptions.priority) ? jsonOptions.priority :0,
                status: (jsonOptions.status) ? jsonOptions.status : 0,
                deleted: (jsonOptions.deleted) ? jsonOptions.deleted : 0,
                timeZone: (jsonOptions.timeZone) ? jsonOptions.timeZone : "America/New_York", // This needs to be updated to grab dynamically
                content: (jsonOptions.content) ? jsonOptions.content : "",
                sortOrder: (jsonOptions.sortOrder) ? jsonOptions.sortOrder : this.sortOrder,
                projectId: (jsonOptions.projectId) ? jsonOptions.projectId : this.inboxId,
                startDate: (jsonOptions.startDate) ? jsonOptions.startDate : null,
                dueDate: (jsonOptions.dueDate) ? jsonOptions.dueDate : null,
                items: (jsonOptions.items) ? jsonOptions.items : [],
                assignee: (jsonOptions.assignee) ? jsonOptions.assignee : null,
                progress: (jsonOptions.progress) ? jsonOptions.progress : 0,
                tags: (jsonOptions.tags) ? jsonOptions.tags : [],
                isAllDay: (jsonOptions.isAllDay) ? jsonOptions.isAllDay : null,
                reminder: (jsonOptions.reminder) ? jsonOptions.reminder : null,
                reminders: (jsonOptions.reminders) ? jsonOptions.reminders : null,
                remindTime: (jsonOptions.remindTime) ? jsonOptions.remindTime : null,
                local: (jsonOptions.local) ? jsonOptions.local : true,
                desc: (jsonOptions.desc) ? jsonOptions.desc : "" // this is a hidden text field not desplayed to the user
            }
        };

        return new Promise((resolve, reject) => {
            this.request(options, function (error, response, body) {
                console.log("Added: " + jsonOptions.title);
                this.sortOrder = body.sortOrder - 1;
                resolve(body);
            });
        });
    }
}
