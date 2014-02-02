<?php

include 'database.php';

$client_key = filter_input(INPUT_POST, 'key');
$user_id = filter_input(INPUT_POST, 'user_id');
$date = filter_input(INPUT_POST, 'date');
$version = filter_input(INPUT_POST, 'version');
$user_agent = filter_input(INPUT_POST, 'user_agent');

if ($client_key === $key) {
    mysql_query("INSERT INTO user_access_log (user_id,date,version,user_agent) VALUES ("
                    . "'$user_id',"
                    . "'$date',"
                    . "'$version',"
                    . "'$user_agent')") or die(mysql_error());
}

echo json_encode(array('status' => 200));

mysql_close($link);
