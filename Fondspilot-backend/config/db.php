<?php
// db.php
// Connexion à la base de données AeonFree

error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = "sql311.hstn.me";                
$db   = "mseet_40054650_fondspilot"; 
$user = "mseet_40054650";    
$pass = "salomon28"; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // En cas d'erreur, renvoie JSON
    header("Content-Type: application/json");
    echo json_encode(["success" => false, "error" => "Erreur BDD: " . $e->getMessage()]);
    exit;
}
require 'db.php';
echo "Connexion OK";
