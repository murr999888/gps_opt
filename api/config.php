<?php
require_once "dblib/safemysql.class.php";
// параметры соединение с базой точек GPS
$opts = array(
	'user'    => 'gps_script',
	'pass'    => 'NsKffjdvjeUxsxEZ',
	'db'      => 'gps_opt',
	'charset' => 'utf8'
);

$server_1c ='1s83.strumok.local';
$user_1c = 'IUSR';
$password_1c = 'IUSR';

$DB = new SafeMySQL($opts); // with some of the default settings overwritten
?>