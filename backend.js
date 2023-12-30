require("dotenv").config();

const path = require('path');

const express = require("express");
const app = express();
// Notion SDK for JavaScript
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

// <http://expressjs.com/en/starter/static-files.html>
app.use(express.static("static"));
app.use(express.json()) // for parsing application/json

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, '/templates'));


// <http://expressjs.com/en/starter/basic-routing.html>
//  Script to gather classes currently in my Notion database
//  ID: ef87ade324e544ed93fbe55d04e224f7
//  https://developers.notion.com/reference/post-database-query
app.get("/", async function (request, response) {
    try {
        const notionData = await notion.databases.query({
            database_id: "ef87ade3-24e5-44ed-93fb-e55d04e224f7"
        })
        const len = notionData.results.length;
        let classesList = {};
        for (let index = 0; index < len; index++) {
            classesList[notionData.results[index].properties.Name.title[0].plain_text] = notionData.results[index].id;
        }
        response.render("index", {classesList});
    } catch (error) {
        console.log(error);
        response.json({ message: "error", error });
    }
});




app.post("/api", async function (request, response) {

    console.log(request.body);
    const pageId = process.env.NOTION_PAGE_ID;
    const task_ = request.body.task
    const class_ = request.body.class
    const dueDate_ = request.body.dueDate
    const notes_ = request.body.notes

    try {
        // Notion API request!
        const notionRequest = await notion.pages.create({
            "parent": {
                "type": "database_id",
                "database_id": pageId //hardcoded to To-Do database
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
                            "id": class_                  
                        }
                    ],
                    "has_more": false
                },
                "Due": {
                    "date": {
                        "start": dueDate_
                    }
                },
                "Notes": {
                    "rich_text": [
                        {
                            "type": "text",
                            "text": {
                                "content": notes_
                            }
                        }
                    ]
                }
            }
        });

        response.json({ message: "success!"});
    } catch (error) {
        console.log(error)
        response.json({ message: "error", error });
    }
});


// listen for requests
//const listener = app.listen(process.env.PORT, function () {
//    console.log("Your app is listening on port " + listener.address().port);
//});


// listen for requests
const listener = app.listen(3000, function () {
    console.log("Your app is listening on port " + listener.address().port);
});
