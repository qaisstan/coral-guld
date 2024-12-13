<?php
$data = json_decode($_POST['data'], true);
header('Content-Type: application/json');
echo json_encode($data, JSON_PRETTY_PRINT);
?>
