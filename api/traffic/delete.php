<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

$json = file_get_contents('php://input');
$obj = json_decode($json, true);

// Processing form data when form is submitted
if($_SERVER["REQUEST_METHOD"] == "POST"){

	if ($obj)  {
		if (is_array($obj)) {
			foreach ($obj as $result) {
				$strq = "DELETE FROM ?n WHERE ?n = ?s";
				$DB->query($strq, 'traffic_points', 'parent_id', $result["id"]);

				$strq = "DELETE FROM ?n WHERE ?n = ?s";
				$DB->query($strq, 'traffic', 'id', $result["id"]);
			}

			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    			echo json_encode(array('success'=>true, 'message'=>'', 'data' =>''));
		} else {
      			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    			echo json_encode(array('success'=>false, 'message'=>'Нужен массив', 'data' =>''));
		}
	}
}

?>