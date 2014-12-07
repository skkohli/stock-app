<?php
require 'Curl.php';
//Not filtering $_GET as data is filtered at front end and at the API layer
$url = 'http://data.benzinga.com/stock/'.$_GET['q'];
use \Curl\Curl;
$cur = new Curl();
$cur->get($url);
$cur->close();
echo json_encode(($cur->response));
