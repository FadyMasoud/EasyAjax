<?php

// if(isset($_GET['name']) && isset($_GET['password'])) {
//     $name = $_GET['name'];
//     $password = $_GET['password'];

//     if($name === 'admin' && $password === '1234') {
//         echo "Login successful!";
//     } else {
//         echo "Invalid credentials.";
//     }
// } else {
//     echo "Please provide both name and password.";
// }



if(isset($_POST['name']) && isset($_POST['password'])) {
    $name = $_POST['name'];
    $password = $_POST['password'];

    if($name === 'admin' && $password === '1234') {
        echo "Login successful!";
    } else {
        echo "Invalid credentials.";
    }
} else {
    echo "Please provide both name and password.";
}


?>

