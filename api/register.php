<?php
require_once "config.php";

if($_SERVER["REQUEST_METHOD"] == "POST"){
	if (isset($_POST['name']) && isset($_POST['password'])) {
		$username = strip_tags($_POST['name']);
		$password = strip_tags($_POST['password']);

		if(isset($username) && isset($password) && !empty($username) && !empty($password)){
			$sql = "SELECT ?n FROM ?n WHERE ?n = ?s;";
			$result = $DB->getOne($sql,'id', 'users', 'username', $username);

			if($result) {
    				header('Content-Type: application/json; charset=utf-8');
    				echo json_encode(array('id' => 0));
				exit;
			}
			
			$sql = "INSERT ?n (?n, ?n, ?n) VALUES (?s, PASSWORD(?s), ?i);";
			$result = $DB->query($sql,'users', 'username','isadmin','hash', $username,$password);
			if ($result) {
				session_start();
				$id = $DB->insertId();

				$res = array(
					'id' 		=> $id, 
					'isadmin'	=> 0, 
					'name' 		=> $username
				);

				$_SESSION['user'] = $res;

    				header('Content-Type: application/json; charset=utf-8');
    				echo json_encode($res);
				exit;
			};
		}
	}
}

header("HTTP/1.1 401 Unauthorized");
exit;
?>