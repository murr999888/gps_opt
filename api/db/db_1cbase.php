<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

require_once "../../api/config.php";

$server1c_string = 'http://' . $user_1c.':' . $password_1c . '@' . $server_1c . '/NN4/hs';

$postData = file_get_contents('php://input');

if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['param'])){
	$data = array();

	foreach ($_GET as $key => $value) { 
		if($key != 'param' && $key != 'page' && $key != 'start' && $key != 'limit' && $key != '_dc'){
			$data[$key] = $value;
		}
	}

	$url = $server1c_string . '/opt/' . $_GET['param'];

	$data = http_build_query($data, '', '&');
    	$result = file_get_contents($url . "?" . $data, false);

	if ($result === FALSE) { /* Handle error */ }

    	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(json_decode($result));

	return;
}


	$data = json_decode($postData, true);


	$url = $server1c_string . '/opt/' . $data['param'];

	$options = array(
  		'http' => array(
    			'method'  => 'POST',
    			'content' => json_encode($data),
    			'header'=>  "Content-Type: application/json\r\n" .
                	"Accept: application/json\r\n"
    		)
	);

	$context  = stream_context_create($options);
	$result = file_get_contents($url, false, $context);
	$response = json_decode($result);

    	header('Content-Type: application/json; charset=utf-8');
    	echo json_encode(json_decode($result));

	return;

?>