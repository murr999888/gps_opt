<?php
	session_start();
	if (isset($_SESSION['user'])){
        	unset($_SESSION['user']);
	}

    	header("HTTP/1.1 401 Unauthorized");
	exit;
?>