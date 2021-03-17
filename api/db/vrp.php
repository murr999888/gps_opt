<?php
session_start();

set_time_limit(12000);

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

$server_string = 'http://10.10.1.2/traffic/';

$postData = file_get_contents('php://input');

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

	if ($result === FALSE) { /* Handle error */ }

    	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(json_decode($result));

	return;
}


	$data = json_decode($postData, true);

	$url = $server_string . $data['param'];

	$curlstr = "curl -s -m 600000 -d '" . json_encode($data["data"]) . "' -H 'Content-Type: application/json' -H 'Accept: application/json' -X POST " . $url;
	$result = shell_exec($curlstr);

    	header('Content-Type: application/json; charset=utf-8');
    	echo $result;

	return;

?>