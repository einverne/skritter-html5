<?php

include 'db.php';

$user_id = filter_input(INPUT_POST, 'user_id');
$name = filter_input(INPUT_POST, 'name');

mysql_query("INSERT INTO user (user_id,name,last_active,last_login) VALUES ('$user_id','$name',NOW(),NOW()) ON DUPLICATE KEY UPDATE last_login=NOW(),last_active=NOW()") or die(mysql_error());

echo json_encode(array('status' => 200));

mysql_close($link);
