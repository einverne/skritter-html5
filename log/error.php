<?php

include 'db.php';

$client_key = filter_input(INPUT_POST, 'key');
$user_id = filter_input(INPUT_POST, 'user_id');
$quantity = filter_input(INPUT_POST, 'quantity');

if ($client_key === $key) {
    mysql_query("INSERT INTO review VALUES ('$user_id',NOW(),'$quantity')") or die(mysql_error());
}

echo json_encode(array('status' => 200));

mysql_close($link);