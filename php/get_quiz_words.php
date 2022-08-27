<?php

include('db_connect.php');
/*$_POST['nWords']=2;
$_POST['sortby']='random';
//$_POST['tags']=["1","10"];
$_POST['lectures']=["20"];
$_POST['offset']=52;*/

//var_dump($_POST);
if ( isset($_POST['nWords'])) {
	
// ###########################################################

	/*
	choose worsd from lec or tags
	then mix them 50:50
	*/

	// --- lectures and tags
	$where=''; // keep space!
	if (isset($_POST['tags'])){
		foreach ($_POST['tags'] as $tagID) {
			$where=$where.'b.TagID = "'.$tagID.'" OR ';
		}
	}
	if (isset($_POST['lectures'])){
		foreach ($_POST['lectures'] as $lecID) {
			$where=$where.'a.LecID = "'.$lecID.'" OR ';
		}
	}
	$where=rtrim($where, "OR ");
	//echo $where.'<br />';

	// ---- sorting 
	if ($_POST['sortby']=='worst'){
		// worst levels first
		$orderby = 'ORDER BY c.Level';
	}
	elseif ($_POST['sortby']=='oldest'){
		// order by oldest access
		$orderby = 'ORDER BY c.ChDate';
	}
	else{ // == 'random'
		// random choice
		$orderby = 'ORDER BY RAND()';
	}

	// ---- limit
	if ($_POST['nWords']!=0){
		$limit= 'LIMIT '.$_POST['nWords'];
	}
	else {
		$limit='';
	}

	if ($_POST['offset']!=0){
		$offset= 'OFFSET '.$_POST['offset'];
	}
	else {
		$offset='';
	}

	// ----- query 
	$sql1 = 'SELECT c.ID ID, a.LecID LecID, b.TagID TagID, c.ChDate ChDate, 
					c.Level Level, c.ForeignWord ForeignWord, c.NativeWord NativeWord, c.Comment Comment 
			 FROM voc_lec a, voc c
			 LEFT JOIN voc_tag b
			 ON c.ID = b.TagID
			 WHERE a.VocID=c.ID AND ('.$where.') '.$orderby.' '.$limit.' '.$offset;

	$string="[";
	$counter=0;
	if($result1 = mysqli_query($link, $sql1)){
	    while($row = $result1->fetch_assoc()) {
	    	$string=$string.'{"ID":"'.$row["ID"].'",
	    				      "LecID":"'.$row["LecID"].'",
	    				      "TagID":"'.$row["TagID"].'",
	    					  "ChDate":"'.$row["ChDate"].'",
	    					  "Level":"'.$row["Level"].'",
	    					  "FWord":"'.$row["ForeignWord"].'",
	    					  "NWord":"'.$row["NativeWord"].'",
	    					  "Comment":"'.$row["Comment"].'",
	    					  "SubLevel":"0",
	    					  "NWrong":"0",
	    					  "Selected":"0"},';
	    	$counter+=1;
	    }
	}
	$string=rtrim($string, ",");
	$string=$string.']';
	echo $string;
	//echo '<br />'.$counter;


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>