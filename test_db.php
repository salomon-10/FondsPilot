<?php
// testdb.php — Upload sur ton hébergeur et ouvre https://fondspilot.zya.me/testdb.php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "sql311.hstn.me";
$db   = "mseet_40054650_fondspilot";
$user = "mseet_40054650";
$pass = "salomon28";

try {
    $pdo = new PDO("mysql:host=$host;port=3306;dbname=$db;charset=utf8", $user, $pass);
    echo json_encode(["success"=>true,"msg"=>"Connexion BDD OK"]);
} catch (PDOException $e) {
    echo json_encode(["success"=>false,"error"=>$e->getMessage()]);
}
