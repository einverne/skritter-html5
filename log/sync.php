<?php

include 'database.php';

$client_key = filter_input(INPUT_POST, 'key');
$user_id = filter_input(INPUT_POST, 'user_id');
$started = filter_input(INPUT_POST, 'started');
$completed = filter_input(INPUT_POST, 'completed');
$received = filter_input(INPUT_POST, 'received');
$sent = filter_input(INPUT_POST, 'sent');

if ($client_key === $key) {
    mysql_query("INSERT INTO sync (user_id,started,completed,items_received,items_sent) VALUES ("
                    . "'$user_id',"
                    . "'$started',"
                    . "'$completed',"
                    . "'$received',"
                    . "'$sent')") or die(mysql_error());
}

echo json_encode(array('status' => 200));

mysql_close($link);
