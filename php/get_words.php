<?php

include('db_connect.php');
//$_POST['LecID']=1;
if ( isset($_POST['LecID']) OR isset($_POST['TagID'])) {
	//echo "ID:.".$_POST['LecID'].".";
	
// ###########################################################

	if ( isset($_POST['LecID'])){
		$sql1 = 'SELECT b.ID ID, b.ChDate ChDate, b.Level Level, b.ForeignWord FWord, b.NativeWord NWord, b.Comment Comment 
			     FROM voc_lec a, voc b 
			     WHERE a.VocID = b.ID 
			     	AND LecID = "'.$_POST['LecID'].'"
			     ORDER BY b.ForeignWord';
	}
	else {
		$sql1 = 'SELECT b.ID ID, b.ChDate ChDate, b.Level Level, b.ForeignWord FWord, b.NativeWord NWord, b.Comment Comment 
			     FROM voc_tag a, voc b 
			     WHERE a.VocID = b.ID 
			     	AND TagID = "'.$_POST['TagID'].'"
			     ORDER BY b.ForeignWord';
	}


	// get words from one lecture
	$string="[";
	
	if($result1 = mysqli_query($link, $sql1)){
	    while($row = $result1->fetch_assoc()) {
	    	$string=$string.'{"ID":"'.$row["ID"].'", 
	    					  "ChDate":"'.$row["ChDate"].'",
	    					  "Level":"'.$row["Level"].'",
	    					  "FWord":"'.$row["FWord"].'",
	    					  "NWord":"'.$row["NWord"].'",
	    					  "Comment":"'.$row["Comment"].'"},';
	    }
	}
	$string=rtrim($string, ",");
	$string=$string.']';
	echo $string;


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>