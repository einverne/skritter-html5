<?php

$key = 'LzHnQTQNkfsT2e4aA4Hlkj6I';
$link = mysql_connect('localhost', 'skritter-user', 'Y28&=Q<huQ6YZz8');
if (!$link) {
    die('Could not connect: ' . mysql_error());
} else {
    mysql_select_db("skritter") or die(mysql_error());
}