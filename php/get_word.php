<?php

include('db_connect.php');
//$_POST['WordID']=1;
if ( isset($_POST['WordID'])) {
	//echo "ID:.".$_POST['WordID'].".";
	
// ###########################################################

	// get word info
	$string="";

	if ($_POST['WordID']!=0){
		// ----------------------------
		$sql1 = 'SELECT ID, ChDate, Level, ForeignWord, NativeWord, Comment 
			     FROM voc 
			     WHERE ID = "'.$_POST['WordID'].'"
			     LIMIT 1';
		if($result1 = mysqli_query($link, $sql1)){
			$row = $result1->fetch_assoc();
		    $string=$string.'{"ID":"'.$row["ID"].'", 
				  "ChDate":"'.$row["ChDate"].'",
				  "Level":"'.$row["Level"].'",
				  "ForeignWord":"'.$row["ForeignWord"].'",
				  "NativeWord":"'.$row["NativeWord"].'",
				  "Comment":"'.$row["Comment"].'",';
		}
	}
	// ----------------------------
	
	// get lec info
	$sql2 = 'SELECT b.ID ID, b.Name Name
		     FROM voc_lec a, lectures b 
		     WHERE a.LecID = b.ID 
		     	AND a.VocID = "'.$row["ID"].'"
		     LIMIT 1';
    
	if($result2 = mysqli_query($link, $sql2)){
		$row2 = $result2->fetch_assoc();
	    $string=$string.'"LectureID":"'.$row2["ID"].'", 
	    				"LectureName":"'.$row2["Name"].'"';
	}

	// ----------------------------

	// get tag info
	$sql3 = 'SELECT b.ID ID, b.Name Name 
		     FROM voc_tag a, tags b 
		     WHERE a.TagID = b.ID 
		     	AND a.VocID = "'.$row["ID"].'"';
	if($result3 = mysqli_query($link, $sql3)){
	    $string=$string.', "Tags":[';
	    if(mysqli_num_rows($result3) > 0){
		    while($row3 = $result3->fetch_assoc()) {
		    	$string=$string.'{"TagID":"'.$row3["ID"].'", 
		    					 "TagName":"'.$row3["Name"].'"},';
		    }
		}
	    $string=rtrim($string, ",");
	    $string=$string.']'; // Tags
	    
	}

	$string=$string.'}'; // Word




	
	echo $string;


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>