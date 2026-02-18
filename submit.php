<?php
declare(strict_types=1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed.'
    ]);
    exit;
}

$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'All fields are required.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address.'
    ]);
    exit;
}

$lead = [
    'lead_id' => strtoupper(bin2hex(random_bytes(6))),
    'created_at' => gmdate('c'),
    'name' => $name,
    'email' => $email,
    'subject' => $subject,
    'message' => $message
];

$file = __DIR__ . DIRECTORY_SEPARATOR . 'forms-submissions.json';

if (!file_exists($file)) {
    file_put_contents($file, json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE), LOCK_EX);
}

$fp = fopen($file, 'c+');
if ($fp === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not open storage file.'
    ]);
    exit;
}

if (!flock($fp, LOCK_EX)) {
    fclose($fp);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not lock storage file.'
    ]);
    exit;
}

rewind($fp);
$existing = stream_get_contents($fp);
$data = json_decode($existing ?: '[]', true);
if (!is_array($data)) {
    $data = [];
}

$data[] = $lead;

rewind($fp);
ftruncate($fp, 0);
fwrite($fp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

echo json_encode([
    'success' => true,
    'id' => $lead['lead_id'],
    'message' => 'Lead saved.'
]);
