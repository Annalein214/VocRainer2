<?php

$debug=false;

include('db_connect.php');
if ($debug) {
	$_POST['nWords']=6;
	$_POST['sortby']='worst';
	$_POST['tags']=["12"];
	//$_POST['lectures']=["20"];
	$_POST['offset']=0;
}

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
	/*$sql1 = 'SELECT c.ID ID, a.LecID LecID, b.TagID TagID, c.ChDate ChDate, 
					c.Level Level, c.ForeignWord ForeignWord, c.NativeWord NativeWord, c.Comment Comment 
			 FROM voc_lec a, voc c
			 LEFT JOIN voc_tag b
			 ON c.ID = b.VocID
			 WHERE a.VocID=c.ID AND ('.$where.') '.$orderby.' '.$limit.' '.$offset;*/

	$sql1 ='SELECT c.ID ID, a.LecID LecID, b.TagID TagID, c.ChDate ChDate, c.Level Level, c.ForeignWord ForeignWord, 	 c.NativeWord NativeWord, c.Comment Comment, d.Name LName
			FROM voc c 
			INNER JOIN voc_lec a 
			ON a.VocID=c.ID
			LEFT JOIN voc_tag b 
			ON c.ID = b.VocID 
			LEFT JOIN lectures d
			ON d.ID = a.LecID WHERE '.$where.' '.$orderby.' '.$limit.' '.$offset;

	if ($debug) echo 'The call: <br />'.$sql1.'<br /><br />';

	$string="[";
	if ($debug) $string=$string.'<br />';
	$counter=0;
	if($result1 = mysqli_query($link, $sql1)){
	    while($row = $result1->fetch_assoc()) {

	    	// get tag ids and names, not possible in big joint above
	    	// get tag info
	    	$tagids='[';
	    	$tagnames='[';
			$sql3 = 'SELECT b.ID ID, b.Name Name 
				     FROM voc_tag a, tags b 
				     WHERE a.TagID = b.ID 
				     	AND a.VocID = "'.$row["ID"].'"';
			if($result3 = mysqli_query($link, $sql3)){
			    if(mysqli_num_rows($result3) > 0){
				    while($row3 = $result3->fetch_assoc()) {
				    	$tagids=$tagids.''.$row3['ID'].',';
	    				$tagnames=$tagnames.'"'.$row3['Name'].'",';
				    }
				}
			    $tagids=rtrim($tagids, ",");
			    $tagnames=rtrim($tagnames, ",");
			    $tagids=$tagids.']';
	    		$tagnames=$tagnames.']';
			    
			}


	    	$string=$string.'{"ID":"'.$row["ID"].'",
	    				      "LecID":"'.$row["LecID"].'",
	    				      "LecName":"'.$row["LName"].'",
	    				      "TagIDs":'.$tagids.',
	    				      "TagNames":'.$tagnames.',
	    					  "ChDate":"'.$row["ChDate"].'",
	    					  "Level":"'.$row["Level"].'",
	    					  "FWord":"'.$row["ForeignWord"].'",
	    					  "NWord":"'.$row["NativeWord"].'",
	    					  "Comment":"'.$row["Comment"].'",
	    					  "SubLevel":"0",
	    					  "NWrong":"0",
	    					  "Selected":"0"},'; // "TagID":"'.$row["TagID"].'",
	    	if ($debug) $string=$string.'<br />';
	    	$counter+=1;
	    }
	}
	$string=rtrim($string, ",");
	$string=$string.']';
	echo $string;
	if ($debug) echo '<br />Total of entries:'.$counter;


// ###########################################################
}
else{ // no POST data transmitted
	echo "ERROR: Values not transmitted";
	var_dump($_POST);
}


?>