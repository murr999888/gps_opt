<?php
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}

if($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['param'])){
	if ($_GET['param'] == 'getHelp') {
		$full_name = 'help/' . $_GET['filename'];
		if (file_exists($full_name)){
			$text = file_get_contents($full_name);
		} else {
			$text = '';
		}
		echo $text;
	}

	if ($_GET['param'] == 'getHelpTableContent') {
		$text = file_get_contents("help/helpTableContent.json");
	    	header('Content-Type: application/json; charset=utf-8');
    		echo $text;
		return;
	}
}

if($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['param'])){
	if ($_POST['param'] == 'saveHelp') {
		$filename = 'help/' . $_POST['filename'];
		$text = $_POST['text'];
		file_put_contents($filename, $text);
	}
}
?>