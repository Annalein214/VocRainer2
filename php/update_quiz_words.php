<?php

include('db_connect.php');

//var_dump($_POST);
//echo '<br /><br />';
if ( isset($_POST["Data"])) {
	
// ###########################################################

	$counter=0;
	foreach ($_POST["Data"] as $word) {
		//var_dump($word);
		//echo '<br /><br />';
		$sql = 'UPDATE voc SET Level = "'.$word["Level"].'" WHERE ID = "'.$word["ID"].'"';
		if ($link->query($sql) === TRUE) {
			$counter+=1;
		}
	}
	
	echo 'Updated '.$counter.' words.';


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>