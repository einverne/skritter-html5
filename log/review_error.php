<?php

include 'db.php';

$client_key = filter_input(INPUT_POST, 'key');
$user_id = filter_input(INPUT_POST, 'user_id');
$date = filter_input(INPUT_POST, 'date');
$item_id = filter_input(INPUT_POST, 'item_id');
$reason = filter_input(INPUT_POST, 'reason');

if ($client_key === $key) {
    mysql_query("INSERT INTO review_error VALUES ('$user_id','$date','$item_id','$reason')") or die(mysql_error());
}

echo json_encode(array('status' => 200));

mysql_close($link);