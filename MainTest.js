

// let MyRequest =new XMLHttpRequest();

// console.log(MyRequest);

// try using promises in js First
// const Mypromise = new Promise ((resolveFunc , rejectFunc) => {
// let x=true;
// if(!x){
//     resolveFunc("True First Promise")
// }else{
//     rejectFunc(Error("False First Promise"))
// }
// });


// console.log(Mypromise);

// Mypromise.then(
//     (value) =>  console.log(value), 
//     (error) =>  console.log(error)
// );

// ----------------------------
// All Promises are resolved in the below code

const MyFirstpromise = new Promise ((resolve , reject) => {

    resolve("Promise First resolved successfully");

});


const MySecondepromise = new Promise ((resolve , reject) => {
;
    resolve("Promise Second resolved successfully");

});

const Mythirdpromise = new Promise ((resolve , reject) => {

    resolve("Promise Third rejected successfully");

});


// Promise.all([MyFirstpromise, MySecondepromise, Mythirdpromise]).then(
//     (resolvesvalue) =>  console.log(resolvesvalue),
//     (rejectvalue) =>  console.log(rejectvalue)
// );


// Promise.allSettled([MyFirstpromise, MySecondepromise, Mythirdpromise]).then(
//     (resolvesvalue) =>  console.log(resolvesvalue),
//     (rejectvalue) =>  console.log(rejectvalue)
// );



// Promise.race([MyFirstpromise, MySecondepromise, Mythirdpromise]).then(
//     (resolvesvalue) =>  console.log(resolvesvalue),
//     (rejectvalue) =>  console.log(rejectvalue)
// );


// ---------------------------------------------------------------


// Use promise in function 
// function Gedata(){
//     return new Promise ((resolve , reject) => {
//         let users = [1];
//         if (users.length > 0){
//             resolve("Users found: " + users.join(", "));
//         } else {
//             reject("No users found");
//         }
//     })
// }

// Gedata().then(
//     (value) => console.log("value: " + value),
//     (error) => console.log("error: " + error)
// );

// async function GetDataAsync(){
//   let users = [1];
//         if (users.length > 0){
//             return "Users found: " + users.join(", ");
//         } else {
//             throw new Error("No users found");
//         }
// }


// console.log(GetDataAsync());
//  GetDataAsync().then(
//     (value) => console.log("value: " + value),
//     (error) => console.log("error: " + error)
// );

var body = "";
async function getzerodata(){
    try{
        let data = await fetch("https://jsonplaceholder.typicode.com/posts");

        let result = await data.json();

        body = result[0]["body"];

        console.log(result[0]["body"]);
    }catch(error){
        console.log(error);
    }finally{
        console.log("Finally block executed");
    }
}


getzerodata();


function ClickMe(){
    document.getElementById("output").innerHTML = body;
}