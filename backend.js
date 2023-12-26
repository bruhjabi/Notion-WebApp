require("dotenv").config();

const express = require("express");
const app = express();
// Notion SDK for JavaScript
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

// <http://expressjs.com/en/starter/static-files.html>
app.use(express.static("public"));
app.use(express.json()) // for parsing application/json


// <http://expressjs.com/en/starter/basic-routing.html>
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/templates/index.html");
});


// listen for requests
//const listener = app.listen(process.env.PORT, function () {
//    console.log("Your app is listening on port " + listener.address().port);
//});

app.post("/databases", async function (request, response) {

    console.log(request.body);
    const pageId = process.env.NOTION_PAGE_ID;
    const task_ = request.body.task
    const class_ = request.body.class
    const dueDate_ = request.body.dueDate
    const notes_ = request.body.notes

    try {
        // Notion API request!
        const response = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": "9685de97-a81d-4c81-92d4-e7cb37b8b8a0" //hardcoded to To-Do database
            },
            "properties": {
                "Task": {
                    "title": [
                        {
                            "text": {
                                "content": task_
                            }
                        }
                    ]
                },
                "Class": {
                    "relation": [
                        {
                            "id": "71e393d7-cafc-4c7a-b89a-6c4f0eedabc6"  //hardcoded to Test class 
                        }
                    ],
                    "has_more": false
                },
                "Due": {
                    "date": {
                        "start": "2020-12-08T12:00:00Z"
                    }
                },
                "Notes": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": "Test note"
                            }
                        }
                    ]
                }
            }
        });

        response.json({ message: "success!", data: response });
    } catch (error) {
        response.json({ message: "error", error });
    }
});


// listen for requests
const listener = app.listen(3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});