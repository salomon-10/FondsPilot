<?php
header("Content-Type: application/json");
require_once("../config/db.php");

// Autoriser toutes les origines (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Pour les prévols OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "POST") {
    // Ajouter une transaction
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data["userId"] ?? null;
    $amount = $data["amount"] ?? null;
    $type = $data["type"] ?? null;
    $origin = $data["origin"] ?? null;
    $reference = $data["reference"] ?? null;

    if (!$user_id || !$amount || !$type) {
        echo json_encode(["status" => "error", "message" => "Champs manquants"]);
        exit;
    }

    // Récupérer le compte principal de l'utilisateur
    $stmt = $pdo->prepare("SELECT id, balance FROM accounts WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user_id]);
    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        echo json_encode(["status" => "error", "message" => "Compte utilisateur introuvable"]);
        exit;
    }

    $account_id = $account["id"];
    $new_balance = $account["balance"];

    // Mettre à jour le solde selon le type
    if (in_array($type, ["deposit", "credit", "save"])) {
        $new_balance += $amount;
    } elseif ($type === "withdraw") {
        if ($amount > $new_balance) {
            echo json_encode(["status" => "error", "message" => "Solde insuffisant"]);
            exit;
        }
        $new_balance -= $amount;
    }

    // Insérer la transaction
    $stmt = $pdo->prepare("INSERT INTO transactions (user_id, account_id, amount, type, origin, reference, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$user_id, $account_id, $amount, $type, $origin, $reference]);

    // Mettre à jour le solde
    $stmt = $pdo->prepare("UPDATE accounts SET balance = ? WHERE id = ?");
    $stmt->execute([$new_balance, $account_id]);

    echo json_encode(["status" => "success", "message" => "Transaction ajoutée"]);
    exit;
}

if ($method === "GET") {
    $user_id = $_GET["user_id"] ?? null;

    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID manquant"]);
        exit;
    }

    // Récupérer le compte principal
    $stmt = $pdo->prepare("SELECT id FROM accounts WHERE user_id = ? LIMIT 1");
    $stmt->execute([$user_id]);
    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        echo json_encode(["status" => "error", "message" => "Compte introuvable"]);
        exit;
    }

    $account_id = $account["id"];

    // Lister les transactions
    $stmt = $pdo->prepare("SELECT * FROM transactions WHERE account_id = ? ORDER BY createdAt DESC");
    $stmt->execute([$account_id]);
    $transactions = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "transactions" => $transactions]);
    exit;
}
?>
