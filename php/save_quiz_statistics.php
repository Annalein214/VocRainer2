<?php

include('db_connect.php');


//$_POST['Learned']=2;
//$_POST['Duration']=15;//sec


if ( isset($_POST['Learned'])) {
	
// ###########################################################

	// make sure all levels exist
	$levels = array(
	    0 => 0,
	    1 => 0,
	    2 => 0,
	    3 => 0,
	    4 => 0,
	);

	$sql1='SELECT Level, COUNT(*) Count FROM voc GROUP BY Level';
	if($result1 = mysqli_query($link, $sql1)){
	  while($row1 = $result1->fetch_assoc()) {
	  	echo 'Words on level '.$row1["Level"].': '.$row1["Count"].'<br />';
	  	$levels[$row1["Level"]]=$row1["Count"];
	  }
	}

	//var_dump($levels);
	//echo "<br />";

	$ddate=date("Y-m-d");
	//echo $ddate."<br />";

	$sql='INSERT INTO quiz (Duration, Learned, Day,L0, L1, L2, L3, L4) 
			VALUES ("'.$_POST['Duration'].'", "'.$_POST['Learned'].'", "'.$ddate.'", 
				"'.$levels[0].'", "'.$levels[1].'", "'.$levels[2].'", "'.$levels[3].'", "'.$levels[4].'")';
	if ($link->query($sql) === TRUE) {
		$id=$link->insert_id;
		echo "Statistics saved at entry: ".$id."<br />";
	}
	
	

// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>