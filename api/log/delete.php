<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

$json = file_get_contents('php://input');
$obj = json_decode($json);

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){
	$strq = "DELETE FROM ?n WHERE ?n = ?i";

	$DB->query($strq, 'calc_log', 'id', htmlspecialchars($obj->id) );
    
	header("Access-Control-Allow-Origin: *");
	header("Content-Type: application/json; charset=UTF-8");
	header("Access-Control-Allow-Methods: POST");
	header("Access-Control-Max-Age: 3600");
	header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    	echo json_encode(array('success'=>true, 'message'=>'', 'data' =>''));
}

?>