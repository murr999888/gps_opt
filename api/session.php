<?php
	session_start();

	require_once "config.php";

	$username = FALSE;
	$password = FALSE;

//error_log(print_r($_COOKIE, true));


	if (isset($_COOKIE['user'])) {
		$username = $_COOKIE['user'];
	}

	if (isset($_COOKIE['password'])) {
		$password = $_COOKIE['password'];
	}
		
	if($username && $password) {
		$sql = "SELECT ?n, ?n FROM ?n WHERE ?n = ?s AND ?n = PASSWORD(?s);";
		$result = $DB->getRow($sql, 'id', 'isadmin', 'users', 'username', base64_decode($username), 'hash', base64_decode($password));
		if ($result) {
       			$res = array(
	                        'id' 		=> $result['id'],
				'isadmin' 	=> $result['isadmin'],
				'name' 		=> $username,
				'host_ip'	=> $_SERVER['REMOTE_ADDR'],
				'host_name'	=> gethostbyaddr($_SERVER['REMOTE_ADDR'])
			);

			$_SESSION['user'] = $res;
    			header('Content-Type: application/json; charset=utf-8');
    			echo json_encode($res);
			exit;
		}
	}

	if (isset($_SESSION['user'])) {
		header('Content-Type: application/json; charset=utf-8');
		$res = $_SESSION['user'];
		echo json_encode($res);
		exit;
	}

    	header("HTTP/1.1 401 Unauthorized");
	exit;

?>