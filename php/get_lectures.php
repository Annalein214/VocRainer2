<?php

include('db_connect.php');
/*
$servername = "localhost:3306";
$username = "pollmann.co";
$password = "Lisa214#";
$dbname = "vocrainer";

$link = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if($link === false){
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
*/
// ###########################################################

// get lecture list
$string="[";
$sql1 = "SELECT ID,Name FROM lectures ORDER BY Name";
if($result1 = mysqli_query($link, $sql1)){
    while($row_lecs = $result1->fetch_assoc()) {
    	$string=$string.'{"ID":"'.$row_lecs["ID"].'", "Name":"'.$row_lecs["Name"].'",';
    		$sql2='SELECT VocID from voc_lec WHERE LecID = "'.$row_lecs["ID"].'"';
    		if($result2 = mysqli_query($link, $sql2)){
    			$n_words=(int)mysqli_num_rows($result2);
    			$string=$string.'"Nwords":"'.$n_words.'",';
    			$sum_of_levels=0;
    			while($row_vl = $result2->fetch_assoc()) {
    				$sql3 = 'SELECT Level FROM voc WHERE ID="'.$row_vl["VocID"].'"';
    				if($result3 = mysqli_query($link, $sql3)){
    					while($row_words = $result3->fetch_assoc()) {
    						$sum_of_levels = $sum_of_levels + (int)$row_words["Level"];
    					}
    					
    				}
    			}
    			$string=$string.'"Average":"'.($sum_of_levels/$n_words).'"';
    			$string=$string."},";
    		}
    }
}
$string=rtrim($string, ",");
$string=$string.']';
echo $string;


// ###########################################################
//mysqli_close($link);

?>