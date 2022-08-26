
<?php

include('db_connect.php');
//$_POST['Search']='sehr nah';
if ( isset($_POST['Search'])) {
	//echo "ID:.".$_POST['LecID'].".";
	
// ###########################################################

	$substrings = explode(" ", $_POST['Search']);

	$regex = '';

	foreach($substrings as $ss){
		$regex = $regex.''.$ss.'|';
	}
	$regex=rtrim($regex, "|");

	$sql1 = 'SELECT ID, ForeignWord FWord, NativeWord NWord, Comment 
		     FROM voc
		     WHERE  (ForeignWord REGEXP "'.$regex .'") OR 
		     	    (NativeWord REGEXP "'.$regex .'") OR 
		     	    (Comment REGEXP "'.$regex .'")';
	

	// get words from one lecture
	$string="[";
	
	if($result1 = mysqli_query($link, $sql1)){
	    while($row = $result1->fetch_assoc()) {
	    	$string=$string.'{"ID":"'.$row["ID"].'", 
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