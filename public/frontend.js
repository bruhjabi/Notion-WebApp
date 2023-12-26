const appendApiResponse = function (apiResponse, el) {
  console.log(apiResponse)

  // Add success message to UI
  const newParagraphSuccessMsg = document.createElement("p")
  newParagraphSuccessMsg.innerHTML = "Result: " + apiResponse.message
  el.appendChild(newParagraphSuccessMsg)
  // See browser console for more information
  if (apiResponse.message === "error") return

  // Add ID of Notion item (db, page, comment) to UI
  const newParagraphId = document.createElement("p")
  newParagraphId.innerHTML = "ID: " + apiResponse.data.id
  el.appendChild(newParagraphId)

  // Add URL of Notion item (db, page) to UI
  if (apiResponse.data.url) {
    const newAnchorTag = document.createElement("a")
    newAnchorTag.setAttribute("href", apiResponse.data.url)
    newAnchorTag.innerText = apiResponse.data.url
    el.appendChild(newAnchorTag)
  }
}

// Assign the database form to a variable for later use
const toDoForm = document.getElementById("toDoForm");
// Assign the empty table cell to a variable for later use
const dbResponseEl = document.getElementById("dbResponse");

// Add a submit handler to the form
toDoForm.onsubmit = async function (event) {
  event.preventDefault()

// Get the database name from the form
  console.log(event.target.taskVal.value)
  const task_ = event.target.taskVal.value
  const class_ = event.target.classVal.value
  const dueDate_ = event.target.dueDateVal.value
  const notes_ = event.target.notesVal.value

  const body = JSON.stringify({ 
    task: task_,
    class: class_,
    dueDate: dueDate_,
    notes: notes_
  })

// Make a request to /databases endpoint in backend.js
  const newDBResponse = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  })
  const newDBData = await newDBResponse.json()

// Pass the new database info and the empty table cell
// to a function that will append it.
  console.log(newDBData)
}
