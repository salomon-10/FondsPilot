<?php
header("Content-Type: application/json");
require_once("../config/db.php");

// Autoriser toutes les origines (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$user_id = $_GET["user_id"] ?? null;

if (!$user_id) {
    echo json_encode(["status" => "error", "message" => "User ID manquant"]);
    exit;
}

// Récupérer le compte principal de l'utilisateur
$stmt = $pdo->prepare("SELECT balance FROM accounts WHERE user_id = ? LIMIT 1");
$stmt->execute([$user_id]);
$account = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$account) {
    echo json_encode(["status" => "error", "message" => "Compte introuvable"]);
    exit;
}

// Retourner le solde
echo json_encode([
    "status" => "success",
    "balance" => floatval($account["balance"])
]);
?>
