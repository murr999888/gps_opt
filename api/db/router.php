<?php
session_start();

set_time_limit(12000);

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

// через прокси не работает (длина запроса)
$server_string = 'http://10.10.1.2:5000/table/v1/driving/';

$postData = file_get_contents('php://input');
/*
if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['param'])){
	$data = array();

	foreach ($_GET as $key => $value) { 
		if($key != 'param' && $key != 'page' && $key != 'start' && $key != 'limit' && $key != '_dc'){
			$data[$key] = $value;
		}
	}

	$url = $server_string . $_GET['param'];

	$data = http_build_query($data, '', '&');
    	$result = file_get_contents($url . "?" . $data, false);

	if ($result === FALSE) { }

    	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(json_decode($result));

	return;
}
*/

if($_SERVER['REQUEST_METHOD'] == 'POST'){
	$data = json_decode($postData, true);

	if ($data['param'] == 'convert'){

		$url = $server_string;
		$radiusesStr = '';
		$radius = $data['radius'];
		$sources = $data['sources'];

		foreach ($data['data'] as $coords) { 
			$url = $url . $coords[0] . ',' . $coords[1] . ';';
			if($radius > 0) {
				$radiusesStr = $radiusesStr . (string)($radius) . ';';
			}
		}
		$url = rtrim($url,';');
		$radiusesStr = rtrim($radiusesStr,';');
	}

	$params = array();
	$params['radiuses'] = $radiusesStr;
	$params['sources'] = $sources;

	$url = $url . '?sources=' . $sources . '&radiuses=' . $radiusesStr;
	$result = shell_exec('curl -sb -m 600000 "' . $url . '"');

    	header('Content-Type: application/json; charset=utf-8');
    	echo $result;
	return;
}
?>