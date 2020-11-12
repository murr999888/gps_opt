<?php
/*
session_start();

if (!isset($_SESSION['user'])) {
	header("HTTP/1.1 401 Unauthorized");
    	exit;
}
*/

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

	if ($_GET['param'] == 'getAllHelp') {
		$template = file_get_contents("help/AllHelpTemplate.html");

		$cont = file_get_contents("help/helpTableContent.json");
		if (!$cont) return;
		$decoded = json_decode($cont, TRUE);
		$data  = $decoded['data'];

		$fulltext = '';

		foreach ($data as $part) {
	                $full_name = 'help/' . $part['file'];

			if (file_exists($full_name)){
				$fulltext .= file_get_contents($full_name);
			} else {
				$fulltext .= '';
			}
		}

		$template = str_replace("#CONTENT#", $fulltext, $template);
		echo $template;
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