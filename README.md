# EasyAjax

A small learning project that shows **how AJAX works**: first with plain JavaScript (`XMLHttpRequest`, `fetch`, Promises, `async/await`), then with **jQuery** (`load`, `$.get`, `$.post`, `$.ajax`). PHP files act as a tiny back end.

---

## 📁 Project Files

| File | What it does |
|------|--------------|
| `Main.html` | Main page. Holds every AJAX example (vanilla JS + jQuery). |
| `MainTest.js` | Promise practice: `Promise.all`, `allSettled`, `race`, `async/await`, `fetch`. |
| `auth.php` | Fake login. Reads `name` and `password` (GET or POST) and answers with a message. |
| `comments.php` | Receives a `comment` by POST, saves it into `comments.json`, and returns JSON. |
| `comments.json` | The "database" of saved comments. |
| `object.json` | Sample JSON data (list of people) for `JSON.parse` practice. |
| `demoONe.html` / `demoTwo.html` | Small HTML pages loaded into the main page with jQuery `.load()`. |
| `Test.txt` | Plain text file loaded with `.load()`. |
| `Explain.md` | Notes on `readyState` and `status`. |

### ▶️ How to run

The PHP files need a server, so opening `Main.html` straight from the disk will **not** work.

1. Install [XAMPP](https://www.apachefriends.org/) and start **Apache**.
2. Put the project in `C:\xampp\htdocs\JS_Learninng`.
3. Open `http://localhost/JS_Learninng/Main.html`.
4. Open the browser **DevTools → Console** (F12) to see the results.

> Most examples in `Main.html` are commented out. Uncomment **one** example at a time to try it.

---

## 1. What is AJAX?

**AJAX** = **A**synchronous **J**avaScript **A**nd **X**ML.

It is **not** a language or a library. It is a *technique*: JavaScript sends a request to the server **in the background** and gets data back **without reloading the page**. Then JavaScript updates only the part of the page that needs to change.

```
 Without AJAX:  click → whole page reloads → new page
 With AJAX:     click → JS asks server quietly → JS updates one <div>
```

Despite the name, data today is usually **JSON**, HTML, or plain text, not XML.

Real-life examples: live search suggestions, "Load more" buttons, posting a comment without refreshing, chat messages.

---

## 2. Components of AJAX

| # | Component | Role |
|---|-----------|------|
| 1 | **Event** | Something the user does, like a button click (`onclick="ClickMe2()"`). |
| 2 | **JavaScript** | Creates the request and handles the answer. |
| 3 | **`XMLHttpRequest` object** (or `fetch`) | The browser tool that actually talks to the server. |
| 4 | **Server** | Here: PHP (`auth.php`, `comments.php`). Processes the request. |
| 5 | **Data format** | JSON / HTML / text / XML that goes back and forth. |
| 6 | **DOM** | The page structure JS changes to show the result. |

### The flow

```
[User clicks button]
        │
        ▼
[JS creates XMLHttpRequest] ──open() + send()──▶ [Server: auth.php]
                                                        │
                                                 processes request
                                                        │
[JS reads responseText]   ◀──── response (text/JSON) ───┘
        │
        ▼
[JS updates the DOM: #output.innerHTML = ...]
```

### 2.1 `XMLHttpRequest` in this project

From `Main.html` → `ClickMe2()`:

```js
function ClickMe2() {
    var myRequest = new XMLHttpRequest();          // 1. create the object

    myRequest.onreadystatechange = function () {   // 3. listen for changes
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);        // 4. use the response
        }
    };

    myRequest.open("GET", "auth.php?name=John", true); // 2. set up request
    myRequest.send();                                   //    and send it
}
```

### 2.2 Main methods and properties

| Name | Type | Meaning |
|------|------|---------|
| `open(method, url, async)` | method | Prepares the request. `method` = `"GET"`/`"POST"`, `async` = `true` (don't freeze the page). |
| `send(body)` | method | Sends the request. Body is only used for POST. |
| `setRequestHeader(name, value)` | method | Adds a header. Needed for POST forms: `"Content-Type", "application/x-www-form-urlencoded"`. |
| `onreadystatechange` | event | Runs every time `readyState` changes. |
| `onload` | event | Runs once when the request finishes (modern shortcut). |
| `readyState` | property | Stage of the request (table below). |
| `status` | property | HTTP status code from the server. |
| `statusText` | property | Text of the status, like `"OK"` or `"Not Found"`. |
| `responseText` | property | The answer as a string. |
| `responseXML` | property | The answer as an XML document (if it is XML). |

### 2.3 `readyState` values

| Value | Meaning |
|-------|---------|
| `0` | Request not initialized (`open()` not called yet) |
| `1` | Server connection established (`open()` called) |
| `2` | Request received (`send()` called, headers arrived) |
| `3` | Processing request (downloading the response) |
| `4` | Request finished and response is ready ✅ |

### 2.4 Common `status` codes

| Code | Meaning |
|------|---------|
| `200` | OK, success ✅ |
| `201` | Created |
| `400` | Bad request |
| `401` / `403` | Not authorized / Forbidden |
| `404` | Not found (wrong URL or file name) |
| `500` | Server error (bug in the PHP) |

### 2.5 Working with JSON

The server sends **text**. To use JSON data in JS, turn it into an object:

```js
myRequest.open("GET", "object.json", true);
// ...
var myData = JSON.parse(this.responseText);  // text → JS array
for (var i = 0; i < myData.length; i++) {
    document.getElementById("output").innerHTML += myData[i].name + "<br>";
}
```

- `JSON.parse(text)` → text to object
- `JSON.stringify(obj)` → object to text (to send it)
- In PHP: `json_decode()` / `json_encode()` do the same.

### 2.6 GET vs POST

| | GET | POST |
|---|-----|------|
| Where the data goes | In the URL: `auth.php?name=John&password=1234` | In the request body (hidden from URL) |
| Read in PHP with | `$_GET['name']` | `$_POST['name']` |
| Good for | Reading / searching data | Sending / saving data, passwords |
| Size limit | Small (URL length) | Large |

### 2.7 Modern way: `fetch` + `async/await`

From `MainTest.js`. `fetch` returns a **Promise**, so it is cleaner than callbacks:

```js
async function getzerodata() {
    try {
        let data   = await fetch("https://jsonplaceholder.typicode.com/posts");
        let result = await data.json();     // parse JSON
        console.log(result[0]["body"]);
    } catch (error) {
        console.log(error);                 // network error
    } finally {
        console.log("Finally block executed");
    }
}
```

Promise helpers practiced in this file:

| Method | Resolves when |
|--------|---------------|
| `Promise.all([...])` | **All** succeed (fails if one fails) |
| `Promise.allSettled([...])` | All are finished, success or fail; gives the result of each |
| `Promise.race([...])` | The **first** one finishes |

---

## 3. What is jQuery?

**jQuery** is a small JavaScript **library** that makes common jobs shorter:

- Selecting elements and changing the page (the DOM)
- Handling events (clicks, typing…)
- Animations
- **AJAX**, with much less code than `XMLHttpRequest`

The motto is *"write less, do more."*

### Add jQuery to the page

```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
```

⚠️ The jQuery `<script>` must come **before** any script that uses `$`.

### Basic syntax

```js
$(selector).action();
```

- `$` = jQuery
- `selector` = which element(s), the same as CSS: `"#id"`, `".class"`, `"button"`
- `action()` = what to do with them

### Wait for the page to be ready

```js
$(function () {
    // code here runs after the HTML is loaded
});
// same as: $(document).ready(function () { ... });
```

### Vanilla JS vs jQuery

| Task | Vanilla JS | jQuery |
|------|------------|--------|
| Select by id | `document.getElementById("output")` | `$("#output")` |
| Set HTML | `el.innerHTML = "Hi"` | `$("#output").html("Hi")` |
| Set text | `el.textContent = "Hi"` | `$("#output").text("Hi")` |
| Click event | `el.addEventListener("click", fn)` | `$("button").on("click", fn)` |
| Read `data-page` | `el.dataset.page` | `$(this).data("page")` |
| AJAX GET | 8+ lines with `XMLHttpRequest` | `$.get(url, fn)` |

---

## 4. How JavaScript works with the Document (DOM)

The **DOM** (Document Object Model) is the browser's **tree of objects** built from your HTML. JavaScript can **read and change** this tree, and the page updates right away.

```
document
 └── html
      ├── head
      └── body
           ├── h1
           ├── button  (onclick="ClickMe2()")
           ├── p#output
           └── div#jquery-content-test
```

### Common DOM operations

```js
// 1. Select
let out = document.getElementById("output");
let btns = document.querySelectorAll("button");

// 2. Change content
out.innerHTML = "<b>Hello</b>";   // HTML
out.textContent = "Hello";        // plain text (safer)

// 3. Listen to events
btns[0].addEventListener("click", function () { ... });

// 4. Read custom attributes (data-*)
// <button data-page="demoONe.html">
btns[1].dataset.page;             // "demoONe.html"
```

### AJAX + DOM = dynamic pages

AJAX **gets** the data, the DOM **shows** it. Example from `MainTest.js`:

```js
function ClickMe() {
    document.getElementById("output").innerHTML = body; // body came from fetch()
}
```

And in jQuery with the `data-page` buttons in `Main.html`:

```js
$("button").on("click", function () {
    var page = $(this).data("page");            // read data-page from the clicked button
    $("#jquery-content-test").load(page);       // load that file into the div
});
```

> 🔐 **Tip:** When showing text that came from users (like comments), use `textContent` / `.text()` instead of `innerHTML` / `.html()` to avoid XSS attacks.

---

## 5. jQuery AJAX methods & their parameters

### 5.1 `.load()`: load a file into an element

```js
$(selector).load(url, data, callback);
```

| Param | Required | Meaning |
|-------|----------|---------|
| `url` | ✅ | File to load. Add a selector to load only part of it: `"demoONe.html #content1"` |
| `data` | ❌ | Data to send. An object → sent as POST; a string → GET |
| `callback(responseTxt, statusTxt, xhr)` | ❌ | Runs when done |

Callback arguments:
- `responseTxt` → the content that came back
- `statusTxt` → `"success"` or `"error"`
- `xhr` → the `XMLHttpRequest` object (`xhr.status`, `xhr.statusText`)

```js
$("#jquery-content-test").load("demoONe.html", function (responseTxt, statusTxt, xhr) {
    if (statusTxt == "success") alert("Loaded!");
    if (statusTxt == "error")   alert("Error: " + xhr.status + ": " + xhr.statusText);
});
```

### 5.2 `$.get()`: GET request

```js
$.get(url, data, callback, dataType);
```

```js
$.get("auth.php?name=admin&password=1234", function (Data, Status, Xhr) {
    console.log(Data);   // server answer
    console.log(Status); // "success"
});

// or send data as an object (jQuery builds the query string for you):
$.get("auth.php", { name: "admin", password: "1234" }, function (Data) { ... });
```

### 5.3 `$.post()`: POST request

```js
$.post(url, data, callback, dataType);
```

```js
$.post("auth.php", { name: "admin", password: "1234" }, function (Data, Status, Xhr) {
    console.log(Data);   // "Login successful!"
});
```

`$.get` / `$.post` parameters:

| Param | Required | Meaning |
|-------|----------|---------|
| `url` | ✅ | Where to send the request |
| `data` | ❌ | Object or string to send |
| `callback(data, status, xhr)` | ❌ | Runs on success |
| `dataType` | ❌ | Expected answer: `"json"`, `"html"`, `"text"`, `"xml"`, `"script"` |

### 5.4 `$.ajax()`: full control

This is the "master" method. `.load`, `$.get`, `$.post` are all shortcuts for it. Example from `Main.html`:

```js
$.ajax({
    type: "POST",
    url: "comments.php",
    data: { comment: "This is a comment from the main page." },
    success: function (Data, Status, Xhr) {
        console.log("Request successful", Data);
    },
    error: function (Xhr, Status, Error) {
        console.log("Request failed", Error);
    },
    complete: function (Xhr, Status) {
        console.log("Request completed");
    }
});
```

#### All the common `$.ajax()` options

| Option | Default | Meaning |
|--------|---------|---------|
| `url` | current page | Where to send the request |
| `type` / `method` | `"GET"` | HTTP method: `GET`, `POST`, `PUT`, `DELETE` |
| `data` | — | Data to send (object, string, or array) |
| `dataType` | auto | Expected response type: `"json"`, `"html"`, `"text"`, `"xml"`, `"script"`, `"jsonp"`. With `"json"`, jQuery parses it for you |
| `contentType` | `"application/x-www-form-urlencoded; charset=UTF-8"` | Type of data you **send**. Use `"application/json"` when sending `JSON.stringify(...)` |
| `async` | `true` | `false` freezes the page until done (avoid) |
| `cache` | `true` | `false` adds a timestamp to the URL so the browser doesn't use an old copy |
| `timeout` | none | Max time in ms before it fails |
| `headers` | `{}` | Extra headers, e.g. `{ "Authorization": "Bearer ..." }` |
| `processData` | `true` | `false` when sending `FormData` (file uploads) |
| `beforeSend(xhr)` | — | Runs **before** sending (show a loading spinner). Return `false` to cancel |
| `success(data, status, xhr)` | — | Runs if the request **succeeds** |
| `error(xhr, status, error)` | — | Runs if it **fails** (404, 500, timeout…) |
| `complete(xhr, status)` | — | Runs **always** at the end, after success or error (hide the spinner) |
| `statusCode` | — | Handlers per code: `{ 404: function(){...} }` |

#### Callback order

```
beforeSend  →  [request]  →  success  OR  error  →  complete
```

#### Promise style (modern jQuery)

`$.ajax` also returns a promise-like object, so you can write:

```js
$.ajax({ url: "comments.php", type: "POST", data: { comment: "Hi" }, dataType: "json" })
    .done(function (data)  { console.log(data.message); })
    .fail(function (xhr)   { console.log("Error", xhr.status); })
    .always(function ()    { console.log("Finished"); });
```

---

## 6. The PHP side (back end)

### `auth.php`: simple login check

```php
if (isset($_POST['name']) && isset($_POST['password'])) {
    if ($_POST['name'] === 'admin' && $_POST['password'] === '1234') {
        echo "Login successful!";
    } else {
        echo "Invalid credentials.";
    }
} else {
    echo "Please provide both name and password.";
}
```

Whatever PHP **echoes** becomes the `responseText` / `Data` in JavaScript.

### `comments.php`: save and return JSON

1. Reads `comments.json` → `json_decode`
2. Adds the new `comment` with a `timestamp`
3. Saves the file → `json_encode`
4. Echoes a JSON answer:

```json
{ "status": "success", "message": "Comment added successfully.", "comment": { ... } }
```

> 💡 Add `dataType: "json"` in `$.ajax` (or `header('Content-Type: application/json');` in PHP) so `Data` arrives as a ready object instead of a string.

---

## 7. Quick Summary

- **AJAX** = talk to the server in the background, no page reload.
- **Parts:** event → JS → `XMLHttpRequest`/`fetch` → server → data (JSON) → DOM update.
- **`readyState === 4 && status === 200`** = success with `XMLHttpRequest`.
- **jQuery** makes it short: `.load()`, `$.get()`, `$.post()`, `$.ajax()`.
- **`$.ajax()`** gives full control with `type`, `url`, `data`, `dataType`, `success`, `error`, `complete`.
- **DOM** is how JS shows the result on the page.

Happy coding! 🚀
