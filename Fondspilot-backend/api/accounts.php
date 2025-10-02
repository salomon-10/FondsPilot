<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$user_id = $_GET["user_id"] ?? null;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User ID manquant"]);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM accounts WHERE user_id = ?");
$stmt->execute([$user_id]);
$accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(["status" => "success", "accounts" => $accounts]);
?>

