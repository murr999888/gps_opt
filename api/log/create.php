<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
	$json = file_get_contents('php://input');
	$obj = json_decode($json, true);
	if ($obj)  {
		if (is_array($obj)) {
			foreach ($obj as $result) {
	              		if (isset($result["id"])){
					unset($result["id"]);
				}

				$strq = "INSERT ?n SET ?u";

				$DB->query($strq, 'calc_log', $result);
				$id = $DB->insertId();
			}

			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    			echo json_encode(array('success'=>true, 'message'=>'', 'data' =>array(array('id'=>$id))));
		} else {
var_dump($obj);
              		if (isset($obj["id"])){
				unset($obj["id"]);
			}

			$strq = "INSERT ?n SET ?u";

			$DB->query($strq, 'calc_log', $obj);
			$id = $DB->insertId();

			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    			echo json_encode(array('success'=>true, 'message'=>'', 'data' =>array(array('id'=>$id))));
		}
	}
}

?>