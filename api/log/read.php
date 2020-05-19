<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

if($_SERVER["REQUEST_METHOD"] == "GET"){
	$strq = "SELECT * FROM `calc_log`";

	$results = $DB->getAll($strq);

	$res = array();

	header("Access-Control-Allow-Origin: *");
   	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(array('success'=>true, 'message'=>'', 'data' => $results));
}

?>