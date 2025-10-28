<?php
session_start();
header('Content-Type: application/json');

// Initialize session storage for tickets
if (!isset($_SESSION['tickets'])) {
    $_SESSION['tickets'] = [];
}

$method = $_SERVER['REQUEST_METHOD'];
$body = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    // 🟢 READ all tickets
    case 'GET':
        echo json_encode($_SESSION['tickets']);
        break;

    // 🟠 CREATE a new ticket
    case 'POST':
        $newTicket = [
            'id' => uniqid(),
            'title' => $body['title'] ?? 'Untitled',
            'description' => $body['description'] ?? '',
            'priority' => $body['priority'] ?? 'Low',
            'status' => 'open',
            'created_at' => date('Y-m-d H:i:s'),
        ];
        $_SESSION['tickets'][] = $newTicket;
        echo json_encode(['success' => true, 'ticket' => $newTicket]);
        break;

    // 🔵 UPDATE a ticket (status, title, etc.)
    case 'PUT':
        $id = $body['id'] ?? null;
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'No ID provided']);
            exit;
        }
        foreach ($_SESSION['tickets'] as &$ticket) {
            if ($ticket['id'] === $id) {
                $ticket = array_merge($ticket, $body);
                break;
            }
        }
        echo json_encode(['success' => true]);
        break;

    // 🔴 DELETE a ticket
    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'No ID provided']);
            exit;
        }
        $_SESSION['tickets'] = array_filter($_SESSION['tickets'], fn($t) => $t['id'] !== $id);
        $_SESSION['tickets'] = array_values($_SESSION['tickets']); // reindex array
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
