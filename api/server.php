<?php
	require_once "config.php";

       	$sql = "SELECT * FROM ?n";
	$result = $DB->getRow($sql, 'servers');

	if (!$result) {
		exit;
	} else {
		$ret = array(
			'id' 		=> $result['id'], 
			'registration' 	=> $result['registration'],
			'lat' 		=> $result['latitude'],
			'lng' 		=> $result['longitude'],
			'zoom'		=> $result['zoom'],
			'readonly'	=> $result['readonly'],
		);

	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($ret);
	exit;
	}
?>