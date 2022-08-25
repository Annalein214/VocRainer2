<?php

$servername = "localhost:3306";
$username = "pollmann.co";
$password = "Lisa214#";
$dbname = "vocrainer";

$link = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}

// ###########################################################

// get all distinct lectures from the csv voc list and add them to the lecture table
/*
$sql = "SELECT DISTINCT Lecture FROM voc";
if($result = mysqli_query($link, $sql)){
    if(mysqli_num_rows($result) > 0){
	  // output data of each row
	  while($row = $result->fetch_assoc()) {
	  	echo $row["Lecture"]."<br />";
	    $sql = 'INSERT INTO lectures (Name) VALUES ("'.$row[Lecture].'")';
	    if(mysqli_query($link, $sql)){
		    echo "SUCCESS: Records inserted successfully.";
		} else{
		    echo "ERROR: Could not able to execute $sql. " . mysqli_error($link);
		}
	  }
	} else {
	  echo "0 results";
	}
}
*/

// connect lectures and voc
/*
$sql1 = "SELECT ID, Lecture FROM voc";
if($result1 = mysqli_query($link, $sql1)){
    while($row_word = $result1->fetch_assoc()) {
    	echo "Word ID".$row_word["ID"]." <br/>";
    	$sql2 = 'SELECT ID FROM lectures WHERE Name="'.$row_word["Lecture"].'" LIMIT 1';
    	if($result2 = mysqli_query($link, $sql2)){
    		$row_lec = $result2->fetch_assoc();
    		echo "Lec ID".$row_lec["ID"]." <br/>";
    		$sql3 = 'INSERT INTO voc_lec (LecID, VocID) VALUES ('.$row_lec[ID].', '.$row_word["ID"].')';
    		if(mysqli_query($link, $sql3)){
			    echo "SUCCESS: Records inserted successfully.<br />";
			} else{
			    echo "ERROR: Could not able to execute $sql. <br />" . mysqli_error($link);
			}
    	}
    }
}
*/


// ###########################################################
mysqli_close($link);

?>