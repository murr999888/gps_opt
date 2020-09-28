<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

if($_SERVER["REQUEST_METHOD"] == "GET"){
	$strq = "SELECT * FROM ?n ORDER BY `name`";
	$results_traffic = $DB->getAll($strq, "traffic");

	$strq = "SELECT * FROM ?n ORDER BY `parent_id`, `num`";
	$results_points = $DB->getAll($strq, "traffic_points");

	$res = array();

	foreach ($results_traffic as $traffic) {				
		$points = array();

         	foreach ($results_points as $point) {	
			if ($traffic["id"] == $point["parent_id"]) {
				$points[] = array(
					"num" => $point["num"],
					"osm_id" => $point["osm_id"]
				);
			}			
		}

		$res[] = array(
			"id" => $traffic["id"],
			"name" => $traffic["name"],
			"speed" => $traffic["speed"],
			"rate" => $traffic["rate"],
			"icon" => $traffic["icon"],
			"begin_lat" => $traffic["begin_lat"],
			"begin_lon" => $traffic["begin_lon"],
			"end_lat" => $traffic["end_lat"],
			"end_lon" => $traffic["end_lon"],
			"geometry" => $traffic["geometry"],
			"both_direction" => $traffic["both_direction"],
			"points" => $points
		);
	}

	header("Access-Control-Allow-Origin: *");
   	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(array('success'=>true, 'message'=>'', 'data' => $res));
}

?>