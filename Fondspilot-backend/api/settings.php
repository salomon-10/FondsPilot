<?php
header("Content-Type: application/json");
require_once("../config/db.php");

$method = $_SERVER["REQUEST_METHOD"];

if ($method === "GET") {
    $user_id = $_GET["user_id"] ?? null;
    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID manquant"]);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM user_settings WHERE user_id = ?");
    $stmt->execute([$user_id]);
    $settings = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "settings" => $settings]);
}

if ($method === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $user_id = $data["user_id"] ?? null;
    $theme = $data["theme"] ?? "light";
    $notifications = $data["notifications"] ?? 1;

    if (!$user_id) {
        echo json_encode(["status" => "error", "message" => "User ID manquant"]);
        exit;
    }

    $stmt = $pdo->prepare("REPLACE INTO user_settings (user_id, theme, notifications) VALUES (?, ?, ?)");
    $stmt->execute([$user_id, $theme, $notifications]);

    echo json_encode(["status" => "success", "message" => "Paramètres mis à jour"]);
}
?>

