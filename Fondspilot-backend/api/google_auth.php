<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Vérification de la méthode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Récupération du JSON envoyé
$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['id_token'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing id_token"]);
    exit;
}

$id_token = $data['id_token'];

// Validation du token Google
$googleData = json_decode(file_get_contents("https://oauth2.googleapis.com/tokeninfo?id_token=".$id_token), true);
if (!isset($googleData['email'])) {
    echo json_encode(["success" => false, "error" => "Invalid token"]);
    exit;
}

// Connexion à la BDD AeonFree
$host = "sql311.hstn.me";                 
$db   = "mseet_40054650_fondspilot"; 
$user = "mseet_40054650";    
$pass = "salomon28"; 

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => "BDD error: " . $e->getMessage()]);
    exit;
}

// Vérifier si l'utilisateur existe
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$googleData['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Créer l’utilisateur si inexistant + compte principal
if (!$user) {
    $stmt = $pdo->prepare("INSERT INTO users (name,email,picture) VALUES (?,?,?)");
    $stmt->execute([$googleData['name'], $googleData['email'], $googleData['picture']]);
    $userId = $pdo->lastInsertId();

    // Créer le compte principal
    $stmt2 = $pdo->prepare("INSERT INTO accounts (user_id, balance) VALUES (?, 0)");
    $stmt2->execute([$userId]);

    $user = [
        "id" => $userId,
        "name" => $googleData['name'],
        "email" => $googleData['email'],
        "picture" => $googleData['picture']
    ];
}

// Retour JSON
echo json_encode([
    "success" => true,
    "token" => $id_token,
    "id" => $user['id'],
    "name" => $user['name'],
    "email" => $user['email'],
    "picture" => $user['picture']
]);
?>
