<?php
	//error_reporting(E_ALL);

	if($_SERVER["REQUEST_METHOD"] == "GET"){
		$output = shell_exec('curl -sb -m 600000 127.0.0.1:55555 2>&1');

		header("Access-Control-Allow-Origin: *");
		header("Content-Type: application/json; charset=UTF-8");
		header("Access-Control-Allow-Methods: GET");
		header("Access-Control-Max-Age: 3600");
		header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    		echo json_encode(array('success'=>true, 'message'=>'Запрос выполнен успешно!', 'data' => $output));
	}

	if($_SERVER["REQUEST_METHOD"] == "POST"){
		$json = file_get_contents('php://input');
		$obj = json_decode($json, true);
		if ($obj)  {
			if (is_array($obj)) {
	    			$fp = fopen('/var/osrm/working/traffic/traffic.csv', 'w');
        			foreach ($obj as $result) {
					$first = true;
					$last_point = null;
					foreach ($result["points"] as $point) {
						$str = '';
						
						if (!$first) {
							$str = $last_point . "," . $point["osm_id"] . "," . $result["speed"] . "," . $result["rate"] . "," . $result["name"] . "\r\n";
							fwrite($fp, $str);
							if ($result["both_direction"]) {
								$str = $point["osm_id"] . "," . $last_point . "," . $result["speed"]. "," . $result["rate"] . "," . $result["name"] . "\r\n";
								fwrite($fp, $str);
							}
						} else {
							$first = false;
						}

						$last_point = $point["osm_id"];
        				}
				}

	    			fclose($fp);

				$output = shell_exec('curl -sb -m 600000 127.0.0.1:55555 2>&1');

				header("Access-Control-Allow-Origin: *");
				header("Content-Type: application/json; charset=UTF-8");
				header("Access-Control-Allow-Methods: POST");
				header("Access-Control-Max-Age: 3600");
				header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    				echo json_encode(array('success'=>true, 'message'=>'Запрос выполнен успешно!', 'data' => $output));
			} else {
				header("Access-Control-Allow-Origin: *");
				header("Content-Type: application/json; charset=UTF-8");
				header("Access-Control-Allow-Methods: POST");
				header("Access-Control-Max-Age: 3600");
				header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
	    			echo json_encode(array('success'=>false, 'message'=>'Нужен массив', 'data' =>''));
			}
		}       	
	}
?>