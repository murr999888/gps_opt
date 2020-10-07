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
				$strq = "INSERT ?n (name, speed, rate, icon, prim, begin_lat, begin_lon, end_lat, end_lon, geometry, distance, both_direction) VALUES (?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s, ?s)";
				$DB->query($strq, 'traffic', 
					$result["name"], 
					$result["speed"], 
					$result["rate"], 
					$result["icon"], 
					$result["prim"], 
					$result["begin_lat"], 
					$result["begin_lon"], 
					$result["end_lat"], 
					$result["end_lon"], 
					$result["geometry"], 
					$result["distance"], 
					$result["both_direction"]
				);

				$id = $DB->insertId();
				
				foreach ($result["points"] as $point) {				
					$strq = "INSERT INTO ?n (parent_id, num, osm_id) VALUES (?s,?s,?s)";				
					$DB->query($strq, 'traffic_points', $id, $point["num"], $point["osm_id"]);
				}
			}

			header("Access-Control-Allow-Origin: *");
			header("Content-Type: application/json; charset=UTF-8");
			header("Access-Control-Allow-Methods: POST");
			header("Access-Control-Max-Age: 3600");
			header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    			echo json_encode(array('success'=>true, 'message'=>'', 'data' =>array(array('id'=>$id))));
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