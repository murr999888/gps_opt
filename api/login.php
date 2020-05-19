<?php
	require_once "config.php";
	// Define variables and initialize with empty values
	//$username = $password  = "";

	// Processing form data when form is submitted
	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$username = strip_tags($_POST['username']);
		$password = strip_tags($_POST['password']);
	}

	if((isset($username) && isset($password)) && (!empty($username) && !empty($password))){

		$sql = "SELECT ?n, ?n FROM ?n WHERE ?n = ?s AND ?n = PASSWORD(?s);";
		$result = $DB->getRow($sql, 'id', 'isadmin', 'users', 'username', $username, 'hash', $password);

		if (!$result) {
		    	header("HTTP/1.1 401 Unauthorized");
    			exit;
		} else {
			session_start();
			$res = array(
	                        'id' 		=> $result['id'],
				'isadmin' 	=> $result['isadmin'],
				'name' 		=> $username
			);

			$_SESSION['user'] = $res;

    			header('Content-Type: application/json; charset=utf-8');
    			echo json_encode($res);
			exit;
		}
	}

	header("HTTP/1.1 401 Unauthorized");
	exit;
?>