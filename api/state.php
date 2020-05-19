<?php
	session_start();

	if (!isset($_SESSION['user'])) {
		header("HTTP/1.1 401 Unauthorized");
    		exit;
	}

	require_once "config.php";
	// Define variables and initialize with empty values
	//$username = $password  = "";

	if($_SERVER["REQUEST_METHOD"] == "GET"){
		$userId = strip_tags($_GET['userId']);

		$sql = "SELECT state_key, state_value FROM ?n WHERE state_user_id = ?s";
		$results = $DB->getAll($sql, 'app_state', $userId);

		$res = array();

		foreach ($results as $result) {
			$res[$result['state_key']] = $result['state_value'];
		}

		header('Content-Type: application/json; charset=utf-8');
		echo json_encode($res, JSON_FORCE_OBJECT);
		exit;
	}

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$userId = strip_tags($_POST['userId']);
		$key = strip_tags($_POST['key']);
		$value = $_POST['value'];

		$sql = "INSERT IGNORE INTO ?n (?n, ?n, ?n) VALUES (?s, ?s, ?s)";
		$DB->query($sql, 'app_state', 'state_user_id', 'state_key', 'state_value', $userId, $key, $value);
	}

	if($_SERVER["REQUEST_METHOD"] == "DELETE"){
		$userId = strip_tags($_DELETE['userId']);
		$key = strip_tags($_DELETE['key']);

		$sql = "delete FROM ?n WHERE ?n = ?s and ?n = ?s";
		$DB->query($sql, 'app_state', 'state_user_id', 'state_key', $userId, $key);
	}

?>