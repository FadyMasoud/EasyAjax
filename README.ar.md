# EasyAjax

🌐 [English](README.md) | **العربية**

مشروع تعليمي صغير يشرح **طريقة عمل AJAX**: أولًا بالجافاسكربت العادي (`XMLHttpRequest` و `fetch` والـ Promises و `async/await`)، ثم باستخدام مكتبة **jQuery** (`load` و `$.get` و `$.post` و `$.ajax`). ملفات PHP تعمل كسيرفر خلفي (Back End) بسيط.

---

## 📁 ملفات المشروع

| الملف | وظيفته |
|------|--------------|
| `Main.html` | الصفحة الرئيسية، وفيها كل أمثلة AJAX (جافاسكربت عادي + jQuery). |
| `MainTest.js` | تدريب على الـ Promises: `Promise.all` و `allSettled` و `race` و `async/await` و `fetch`. |
| `auth.php` | تسجيل دخول تجريبي. يقرأ `name` و `password` (بـ GET أو POST) ويرد برسالة. |
| `comments.php` | يستقبل `comment` بطريقة POST، ويحفظه في `comments.json`، ويرد بـ JSON. |
| `comments.json` | "قاعدة البيانات" التي تُحفظ فيها التعليقات. |
| `object.json` | بيانات JSON تجريبية (قائمة أشخاص) للتدريب على `JSON.parse`. |
| `demoONe.html` / `demoTwo.html` | صفحات HTML صغيرة يتم تحميلها داخل الصفحة الرئيسية بـ `.load()`. |
| `Test.txt` | ملف نصي يتم تحميله بـ `.load()`. |
| `Explain.md` | ملاحظات عن `readyState` و `status`. |

### ▶️ طريقة التشغيل

ملفات PHP تحتاج إلى سيرفر، لذلك فتح `Main.html` مباشرة من الجهاز **لن يعمل**.

1. ثبّت [XAMPP](https://www.apachefriends.org/) وشغّل **Apache**.
2. ضع المشروع في المسار `C:\xampp\htdocs\JS_Learninng`.
3. افتح الرابط `http://localhost/JS_Learninng/Main.html`.
4. افتح أدوات المطور في المتصفح **DevTools ← Console** (زر F12) لرؤية النتائج.

> أغلب الأمثلة في `Main.html` موضوعة كتعليقات. أزل التعليق عن **مثال واحد فقط** في كل مرة لتجربته.

---

## 1. ما هو AJAX؟

**AJAX** اختصار لـ **A**synchronous **J**avaScript **A**nd **X**ML، أي "جافاسكربت و XML بشكل غير متزامن".

هو **ليس** لغة برمجة ولا مكتبة، بل **أسلوب عمل**: الجافاسكربت يرسل طلبًا إلى السيرفر **في الخلفية** ويستقبل البيانات **بدون إعادة تحميل الصفحة**، ثم يحدّث الجزء الذي يحتاج للتغيير فقط.

```
 بدون AJAX:  ضغطة زر ← الصفحة كلها تُعاد ← صفحة جديدة
 مع AJAX:    ضغطة زر ← JS يسأل السيرفر بهدوء ← يتغير <div> واحد فقط
```

رغم أن الاسم فيه XML، إلا أن البيانات اليوم غالبًا تكون **JSON** أو HTML أو نصًا عاديًا.

أمثلة من الواقع: اقتراحات البحث أثناء الكتابة، زر "تحميل المزيد"، إضافة تعليق بدون تحديث الصفحة، رسائل الدردشة.

---

## 2. مكونات AJAX

| # | المكوّن | دوره |
|---|-----------|------|
| 1 | **الحدث (Event)** | شيء يفعله المستخدم، مثل الضغط على زر (`onclick="ClickMe2()"`). |
| 2 | **JavaScript** | ينشئ الطلب ويتعامل مع الرد. |
| 3 | **كائن `XMLHttpRequest`** (أو `fetch`) | أداة المتصفح التي تتواصل فعليًا مع السيرفر. |
| 4 | **السيرفر** | هنا: PHP (`auth.php` و `comments.php`). يعالج الطلب. |
| 5 | **صيغة البيانات** | JSON أو HTML أو نص أو XML تنتقل بين الطرفين. |
| 6 | **DOM** | هيكل الصفحة الذي يعدّله الجافاسكربت لعرض النتيجة. |

### خطوات العمل

```
[المستخدم يضغط الزر]
        │
        ▼
[JS ينشئ XMLHttpRequest] ──open() + send()──▶ [السيرفر: auth.php]
                                                      │
                                                يعالج الطلب
                                                      │
[JS يقرأ responseText]   ◀──── الرد (نص / JSON) ──────┘
        │
        ▼
[JS يحدّث الصفحة: #output.innerHTML = ...]
```

### 2.1 استخدام `XMLHttpRequest` في هذا المشروع

من ملف `Main.html` ← الدالة `ClickMe2()`:

```js
function ClickMe2() {
    var myRequest = new XMLHttpRequest();          // 1. إنشاء الكائن

    myRequest.onreadystatechange = function () {   // 3. الاستماع للتغييرات
        if (this.readyState === 4 && this.status === 200) {
            console.log(this.responseText);        // 4. استخدام الرد
        }
    };

    myRequest.open("GET", "auth.php?name=John", true); // 2. تجهيز الطلب
    myRequest.send();                                   //    وإرساله
}
```

### 2.2 أهم الدوال والخصائص

| الاسم | النوع | المعنى |
|------|------|---------|
| `open(method, url, async)` | دالة | تجهّز الطلب. `method` = `"GET"` أو `"POST"`، و `async` = `true` (حتى لا تتجمد الصفحة). |
| `send(body)` | دالة | ترسل الطلب. الـ body يُستخدم مع POST فقط. |
| `setRequestHeader(name, value)` | دالة | تضيف هيدر. مطلوبة مع POST للنماذج: `"Content-Type", "application/x-www-form-urlencoded"`. |
| `onreadystatechange` | حدث | يعمل في كل مرة تتغير فيها قيمة `readyState`. |
| `onload` | حدث | يعمل مرة واحدة عند انتهاء الطلب (طريقة حديثة ومختصرة). |
| `readyState` | خاصية | مرحلة الطلب الحالية (الجدول التالي). |
| `status` | خاصية | كود حالة HTTP القادم من السيرفر. |
| `statusText` | خاصية | نص الحالة، مثل `"OK"` أو `"Not Found"`. |
| `responseText` | خاصية | الرد على شكل نص. |
| `responseXML` | خاصية | الرد على شكل مستند XML (إذا كان الرد XML). |

### 2.3 قيم `readyState`

| القيمة | المعنى |
|-------|---------|
| `0` | الطلب لم يُجهَّز بعد (لم يتم استدعاء `open()`) |
| `1` | تم إنشاء الاتصال بالسيرفر (تم استدعاء `open()`) |
| `2` | السيرفر استلم الطلب (تم استدعاء `send()` ووصلت الهيدرات) |
| `3` | جاري معالجة الطلب (تحميل الرد) |
| `4` | انتهى الطلب والرد جاهز ✅ |

### 2.4 أشهر أكواد `status`

| الكود | المعنى |
|------|---------|
| `200` | تم بنجاح ✅ |
| `201` | تم الإنشاء |
| `400` | طلب غير صحيح |
| `401` / `403` | غير مصرح / ممنوع |
| `404` | غير موجود (رابط أو اسم ملف خاطئ) |
| `500` | خطأ في السيرفر (مشكلة في كود PHP) |

> **الشرط `readyState === 4 && status === 200` معناه: الطلب انتهى ونجح.**

### 2.5 التعامل مع JSON

السيرفر يرسل **نصًا**. لكي نستخدم بيانات JSON في الجافاسكربت يجب تحويلها إلى كائن:

```js
myRequest.open("GET", "object.json", true);
// ...
var myData = JSON.parse(this.responseText);  // نص ← مصفوفة JS
for (var i = 0; i < myData.length; i++) {
    document.getElementById("output").innerHTML += myData[i].name + "<br>";
}
```

- `JSON.parse(text)` ← تحويل النص إلى كائن
- `JSON.stringify(obj)` ← تحويل الكائن إلى نص (لإرساله)
- في PHP: الدالتان `json_decode()` و `json_encode()` تقومان بنفس العمل.

### 2.6 الفرق بين GET و POST

| | GET | POST |
|---|-----|------|
| أين توضع البيانات | في الرابط: `auth.php?name=John&password=1234` | داخل جسم الطلب (لا تظهر في الرابط) |
| قراءتها في PHP | `$_GET['name']` | `$_POST['name']` |
| مناسب لـ | قراءة البيانات والبحث | إرسال وحفظ البيانات وكلمات المرور |
| حجم البيانات | صغير (محدود بطول الرابط) | كبير |

### 2.7 الطريقة الحديثة: `fetch` مع `async/await`

من ملف `MainTest.js`. الدالة `fetch` ترجع **Promise**، لذلك الكود أنظف من الـ callbacks:

```js
async function getzerodata() {
    try {
        let data   = await fetch("https://jsonplaceholder.typicode.com/posts");
        let result = await data.json();     // تحويل JSON
        console.log(result[0]["body"]);
    } catch (error) {
        console.log(error);                 // خطأ في الشبكة
    } finally {
        console.log("Finally block executed");
    }
}
```

دوال الـ Promise التي تم التدرب عليها في هذا الملف:

| الدالة | متى تنتهي |
|--------|---------------|
| `Promise.all([...])` | عندما **تنجح كلها** (وتفشل إذا فشل واحد منها) |
| `Promise.allSettled([...])` | عندما تنتهي كلها، سواء نجحت أو فشلت، وتعطي نتيجة كل واحدة |
| `Promise.race([...])` | عندما تنتهي **أول واحدة** |

---

## 3. ما هي jQuery؟

**jQuery** مكتبة جافاسكربت صغيرة تجعل المهام الشائعة أقصر:

- اختيار العناصر وتعديل الصفحة (DOM)
- التعامل مع الأحداث (الضغط، الكتابة...)
- الحركات (Animations)
- **AJAX** بكود أقل بكثير من `XMLHttpRequest`

شعارها: *"اكتب أقل، وأنجز أكثر"*.

### إضافة jQuery إلى الصفحة

```html
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
```

⚠️ يجب أن يأتي سطر jQuery **قبل** أي كود يستخدم `$`.

### الشكل الأساسي

```js
$(selector).action();
```

- `$` = jQuery
- `selector` = العنصر أو العناصر المطلوبة، بنفس طريقة CSS: `"#id"` أو `".class"` أو `"button"`
- `action()` = ماذا نفعل بها

### انتظار تحميل الصفحة

```js
$(function () {
    // الكود هنا يعمل بعد تحميل HTML بالكامل
});
// نفس: $(document).ready(function () { ... });
```

### مقارنة بين الجافاسكربت العادي و jQuery

| المهمة | JavaScript عادي | jQuery |
|------|------------|--------|
| اختيار عنصر بالـ id | `document.getElementById("output")` | `$("#output")` |
| وضع HTML | `el.innerHTML = "Hi"` | `$("#output").html("Hi")` |
| وضع نص | `el.textContent = "Hi"` | `$("#output").text("Hi")` |
| حدث الضغط | `el.addEventListener("click", fn)` | `$("button").on("click", fn)` |
| قراءة `data-page` | `el.dataset.page` | `$(this).data("page")` |
| طلب AJAX بـ GET | أكثر من 8 أسطر بـ `XMLHttpRequest` | `$.get(url, fn)` |

---

## 4. تفاعل الجافاسكربت مع الصفحة (DOM)

**DOM** (Document Object Model) هو **شجرة من الكائنات** يبنيها المتصفح من كود HTML. الجافاسكربت يستطيع **قراءة وتعديل** هذه الشجرة، فتتحدث الصفحة فورًا.

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

### أشهر العمليات على DOM

```js
// 1. الاختيار
let out = document.getElementById("output");
let btns = document.querySelectorAll("button");

// 2. تغيير المحتوى
out.innerHTML = "<b>Hello</b>";   // HTML
out.textContent = "Hello";        // نص عادي (أكثر أمانًا)

// 3. الاستماع للأحداث
btns[0].addEventListener("click", function () { ... });

// 4. قراءة الخصائص المخصصة (data-*)
// <button data-page="demoONe.html">
btns[1].dataset.page;             // "demoONe.html"
```

### AJAX + DOM = صفحات ديناميكية

**AJAX يجلب البيانات، و DOM يعرضها.** مثال من `MainTest.js`:

```js
function ClickMe() {
    document.getElementById("output").innerHTML = body; // body جاء من fetch()
}
```

ومع jQuery باستخدام أزرار `data-page` الموجودة في `Main.html`:

```js
$("button").on("click", function () {
    var page = $(this).data("page");            // نقرأ data-page من الزر المضغوط
    $("#jquery-content-test").load(page);       // نحمّل الملف داخل الـ div
});
```

> 🔐 **نصيحة:** عند عرض نص قادم من المستخدمين (مثل التعليقات)، استخدم `textContent` أو `.text()` بدلًا من `innerHTML` أو `.html()` لتجنب هجمات XSS.

---

## 5. دوال AJAX في jQuery وبارامتراتها

### 5.1 `.load()`: تحميل ملف داخل عنصر

```js
$(selector).load(url, data, callback);
```

| البارامتر | إجباري؟ | المعنى |
|-------|----------|---------|
| `url` | ✅ | الملف المطلوب تحميله. يمكن إضافة selector لتحميل جزء منه فقط: `"demoONe.html #content1"` |
| `data` | ❌ | بيانات للإرسال. إذا كانت كائنًا تُرسل بـ POST، وإذا كانت نصًا تُرسل بـ GET |
| `callback(responseTxt, statusTxt, xhr)` | ❌ | دالة تعمل عند الانتهاء |

بارامترات الـ callback:
- `responseTxt` ← المحتوى الذي وصل
- `statusTxt` ← `"success"` أو `"error"`
- `xhr` ← كائن `XMLHttpRequest` (`xhr.status` و `xhr.statusText`)

```js
$("#jquery-content-test").load("demoONe.html", function (responseTxt, statusTxt, xhr) {
    if (statusTxt == "success") alert("Loaded!");
    if (statusTxt == "error")   alert("Error: " + xhr.status + ": " + xhr.statusText);
});
```

### 5.2 `$.get()`: طلب GET

```js
$.get(url, data, callback, dataType);
```

```js
$.get("auth.php?name=admin&password=1234", function (Data, Status, Xhr) {
    console.log(Data);   // رد السيرفر
    console.log(Status); // "success"
});

// أو نرسل البيانات ككائن (و jQuery تبني الرابط تلقائيًا):
$.get("auth.php", { name: "admin", password: "1234" }, function (Data) { ... });
```

### 5.3 `$.post()`: طلب POST

```js
$.post(url, data, callback, dataType);
```

```js
$.post("auth.php", { name: "admin", password: "1234" }, function (Data, Status, Xhr) {
    console.log(Data);   // "Login successful!"
});
```

بارامترات `$.get` و `$.post`:

| البارامتر | إجباري؟ | المعنى |
|-------|----------|---------|
| `url` | ✅ | المكان الذي يُرسل إليه الطلب |
| `data` | ❌ | كائن أو نص للإرسال |
| `callback(data, status, xhr)` | ❌ | دالة تعمل عند النجاح |
| `dataType` | ❌ | نوع الرد المتوقع: `"json"` أو `"html"` أو `"text"` أو `"xml"` أو `"script"` |

### 5.4 `$.ajax()`: تحكم كامل

هذه هي الدالة "الأم"، فالدوال `.load` و `$.get` و `$.post` كلها اختصارات لها. مثال من `Main.html`:

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

#### أشهر خيارات `$.ajax()`

| الخيار | القيمة الافتراضية | المعنى |
|--------|---------|---------|
| `url` | الصفحة الحالية | المكان الذي يُرسل إليه الطلب |
| `type` / `method` | `"GET"` | نوع الطلب: `GET` أو `POST` أو `PUT` أو `DELETE` |
| `data` | — | البيانات المرسلة (كائن أو نص أو مصفوفة) |
| `dataType` | تلقائي | نوع الرد المتوقع: `"json"` أو `"html"` أو `"text"` أو `"xml"` أو `"script"` أو `"jsonp"`. مع `"json"` تقوم jQuery بتحويله تلقائيًا |
| `contentType` | `"application/x-www-form-urlencoded; charset=UTF-8"` | نوع البيانات التي **ترسلها**. استخدم `"application/json"` عند إرسال `JSON.stringify(...)` |
| `async` | `true` | القيمة `false` تجمّد الصفحة حتى ينتهي الطلب (تجنّبها) |
| `cache` | `true` | القيمة `false` تضيف وقتًا للرابط حتى لا يستخدم المتصفح نسخة قديمة |
| `timeout` | لا يوجد | أقصى وقت بالمللي ثانية قبل اعتبار الطلب فاشلًا |
| `headers` | `{}` | هيدرات إضافية، مثل `{ "Authorization": "Bearer ..." }` |
| `processData` | `true` | ضعها `false` عند إرسال `FormData` (رفع الملفات) |
| `beforeSend(xhr)` | — | تعمل **قبل** الإرسال (لإظهار علامة تحميل). إرجاع `false` يلغي الطلب |
| `success(data, status, xhr)` | — | تعمل إذا **نجح** الطلب |
| `error(xhr, status, error)` | — | تعمل إذا **فشل** الطلب (404 أو 500 أو انتهاء الوقت...) |
| `complete(xhr, status)` | — | تعمل **دائمًا** في النهاية، بعد النجاح أو الفشل (لإخفاء علامة التحميل) |
| `statusCode` | — | دوال لكل كود حالة: `{ 404: function(){...} }` |

#### ترتيب تنفيذ الدوال

```
beforeSend  →  [الطلب]  →  success  أو  error  →  complete
```

#### أسلوب الـ Promise (في jQuery الحديثة)

الدالة `$.ajax` ترجع كائنًا يشبه الـ Promise، لذلك يمكنك الكتابة هكذا:

```js
$.ajax({ url: "comments.php", type: "POST", data: { comment: "Hi" }, dataType: "json" })
    .done(function (data)  { console.log(data.message); })
    .fail(function (xhr)   { console.log("Error", xhr.status); })
    .always(function ()    { console.log("Finished"); });
```

---

## 6. جانب PHP (السيرفر)

### `auth.php`: فحص تسجيل دخول بسيط

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

أي شيء يطبعه PHP بـ **echo** يصبح هو `responseText` أو `Data` في الجافاسكربت.

### `comments.php`: حفظ التعليق وإرجاع JSON

1. يقرأ `comments.json` ← `json_decode`
2. يضيف التعليق الجديد `comment` مع وقت الإضافة `timestamp`
3. يحفظ الملف ← `json_encode`
4. يرد بـ JSON:

```json
{ "status": "success", "message": "Comment added successfully.", "comment": { ... } }
```

> 💡 أضف `dataType: "json"` في `$.ajax` (أو `header('Content-Type: application/json');` في PHP) حتى يصل `Data` ككائن جاهز بدلًا من نص.

---

## 7. الخلاصة

- **AJAX** = التواصل مع السيرفر في الخلفية بدون إعادة تحميل الصفحة.
- **المكونات:** حدث ← JS ← `XMLHttpRequest` أو `fetch` ← سيرفر ← بيانات (JSON) ← تحديث DOM.
- **`readyState === 4 && status === 200`** = نجاح الطلب مع `XMLHttpRequest`.
- **jQuery** تختصر الكود: `.load()` و `$.get()` و `$.post()` و `$.ajax()`.
- **`$.ajax()`** تعطيك تحكمًا كاملًا عن طريق `type` و `url` و `data` و `dataType` و `success` و `error` و `complete`.
- **DOM** هو الطريقة التي يعرض بها الجافاسكربت النتيجة على الصفحة.

برمجة سعيدة! 🚀
