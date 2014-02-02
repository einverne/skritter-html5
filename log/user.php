<?php

include 'database.php';

$client_key = filter_input(INPUT_POST, 'key');
$settings = json_decode(filter_input(INPUT_POST, 'settings'));
$aboutMe = mysql_real_escape_string($settings->aboutMe);
$chineseStudyParts = serialize($settings->chineseStudyParts);
$japaneseStudyParts = serialize($settings->japaneseStudyParts);
$timezone = mysql_real_escape_string($settings->timezone);
if ($client_key === $key) {
    mysql_query("INSERT INTO user (id,name,created,aboutMe,private,anonymous,"
                    . "addFrequency,addSimplified,addTraditional,allowEmailsFromSkritter,animationSpeed,"
                    . "autoAddComponentCharacters,chineseStudyParts,colorTones,eccentric,email,hideReading,"
                    . "japaneseStudyParts,orderWeight,sourceLang,retentionIndex,reviewSimplified,reviewTraditional,"
                    . "showHeisig,squigs,studyAllListWritings,studyRareWritings,targetLang,timezone) VALUES ("
                    . "'$settings->id',"
                    . "'$settings->name',"
                    . "'$settings->created',"
                    . "'$aboutMe',"
                    . "$settings->private,"
                    . "$settings->anonymous,"
                    . "$settings->addFrequency,"
                    . "$settings->addSimplified,"
                    . "$settings->addTraditional,"
                    . "$settings->allowEmailsFromSkritter,"
                    . "$settings->animationSpeed,"
                    . "$settings->autoAddComponentCharacters,"
                    . "'$chineseStudyParts',"
                    . "$settings->colorTones,"
                    . "$settings->eccentric,"
                    . "'$settings->email',"
                    . "$settings->hideReading,"
                    . "'$japaneseStudyParts',"
                    . "'$settings->orderWeight',"
                    . "'$settings->sourceLang',"
                    . "'$settings->retentionIndex',"
                    . "$settings->reviewSimplified,"
                    . "$settings->reviewTraditional,"
                    . "$settings->showHeisig,"
                    . "$settings->squigs,"
                    . "'$settings->studyAllListWritings',"
                    . "'$settings->studyRareWritings',"
                    . "'$settings->targetLang',"
                    . "'$timezone') "
                    . "ON DUPLICATE KEY UPDATE "
                    . "aboutMe='$aboutMe', "
                    . "created='$settings->created', "
                    . "private=$settings->private") or die(mysql_error());
}

echo json_encode(array('status' => 200, 'settings' => $settings));

mysql_close($link);
