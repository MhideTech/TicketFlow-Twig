<?php
session_start();
header('Content-Type: application/json');

// If you're using sessions for tickets
$tickets = $_SESSION['tickets'] ?? [];

// Calculate stats
$total = count($tickets);
$open = count(array_filter($tickets, fn($t) => $t['status'] === 'open'));
$resolved = count(array_filter($tickets, fn($t) => $t['status'] === 'resolved'));

// Return JSON
echo json_encode([
    'total' => $total,
    'open' => $open,
    'resolved' => $resolved
]);
