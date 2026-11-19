<?php

$comments = json_decode(file_get_contents('comments.json'), true);

if(isset($_POST['comment']) && !empty($_POST['comment'])) {

    $newComment = [
        'comment' => $_POST['comment'],
        'timestamp' => date('Y-m-d H:i:s')
    ];

    $comments[] = $newComment;

    file_put_contents('comments.json', json_encode($comments, JSON_PRETTY_PRINT));

    echo json_encode(['status' => 'success', 'message' => 'Comment added successfully.', 'comment' => $newComment]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Comment cannot be empty.', 'comment' => null]);
}



?>