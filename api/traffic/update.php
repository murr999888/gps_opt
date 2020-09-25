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
				$strq = "DELETE FROM ?n WHERE ?n = ?s";
				$DB->query($strq, 'traffic_points', 'parent_id', $result["id"]);

				$strq = "UPDATE ?n SET name=?s, speed=?s, begin_lat=?s, begin_lon=?s, end_lat=?s, end_lon=?s, geometry=?s, both_direction=?s WHERE id=?s";
				$DB->query($strq, 'traffic', $result["name"], $result["speed"], $result["begin_lat"], $result["begin_lon"], $result["end_lat"], $result["end_lon"], $result["geometry"], $result["both_direction"], $result["id"]);
				
				foreach ($result["points"] as $point) {				
					$strq = "INSERT INTO ?n (parent_id, num, osm_id) VALUES (?s,?s,?s)";				
					$DB->query($strq, 'traffic_points', $result["id"], $point["num"], $point["osm_id"]);
				}
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
		    	echo json_encode(array('success'=>true, 'message'=>'', 'data' =>''));
		}
	}
}

?>