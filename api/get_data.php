<?php
require 'Curl.php';
$url = 'http://data.benzinga.com/stock/'.$_GET['q'];
use \Curl\Curl;
$cur = new Curl();
$cur->get($url);
$cur->close();
echo json_encode(($cur->response));