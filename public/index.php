<?php
require_once dirname(__DIR__) . '/vendor/autoload.php';

use Twig\Environment;
use Twig\Loader\FilesystemLoader;
use Twig\Extension\DebugExtension;

session_start();

$loader = new FilesystemLoader(dirname(__DIR__) . '/templates');
$twig = new Environment($loader, [
    'cache' => false,
    'debug' => true,
]);

$twig->addExtension(new DebugExtension());

// CSRF Token
if (!isset($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}
$csrf_token = $_SESSION['csrf_token'];

// Current Path
$current_path = rtrim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
if ($current_path === '') $current_path = '/';

// Inject globals
$twig->addGlobal('app', [
    'user' => $_SESSION['ticketapp_session'] ?? null,
    'request' => [
        'uri' => $_SERVER['REQUEST_URI'],
        'method' => $_SERVER['REQUEST_METHOD'],
    ],
]);
$twig->addGlobal('current_path', $current_path);

// Simple demo user DB
$users = [
    'test@ticketapp.dev' => 'Password123!',
];

// ROUTING
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Initialize tickets array if not present
if (!isset($_SESSION['tickets'])) {
    $_SESSION['tickets'] = [];
}

switch ($uri) {
    case '/':
    case '/index':
        echo $twig->render('pages/landing.twig');
        break;

    case '/login':
        $error = null;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_POST['_csrf_token']) || $_POST['_csrf_token'] !== $_SESSION['csrf_token']) {
                $error = "Invalid CSRF token.";
                break;
            }

            $email = trim($_POST['email'] ?? '');
            $password = trim($_POST['password'] ?? '');

            if (isset($users[$email]) && $users[$email] === $password) {
                $_SESSION['ticketapp_session'] = [
                    'email' => $email,
                    'name' => 'Test User',
                ];
                header('Location: /dashboard');
                exit;
            } else {
                $error = "Invalid credentials. Please try again.";
            }
        }

        echo $twig->render('pages/login.twig', [
            'csrf_token' => $csrf_token,
            'error' => $error,
        ]);
        break;

    case '/signup':
        echo $twig->render('pages/register.twig', [
            'csrf_token' => $csrf_token,
        ]);
        break;

    case '/tickets':
        if (!isset($_SESSION['ticketapp_session'])) {
            header('Location: /login');
            exit;
        }

        // Handle ticket creation or deletion
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!isset($_POST['_csrf_token']) || $_POST['_csrf_token'] !== $_SESSION['csrf_token']) {
                die("Invalid CSRF token");
            }

            // CREATE TICKET
            if (isset($_POST['action']) && $_POST['action'] === 'create') {
                $newTicket = [
                    'id' => time(),
                    'title' => trim($_POST['title']),
                    'description' => trim($_POST['description']),
                    'status' => $_POST['status'] ?? 'open',
                    'priority' => $_POST['priority'] ?? 'medium',
                ];
                $_SESSION['tickets'][] = $newTicket;
                header('Location: /tickets');
                exit;
            }
            

            // DELETE TICKET
            if (isset($_POST['action']) && $_POST['action'] === 'delete') {
                $id = $_POST['id'] ?? null;
                if ($id) {
                    $_SESSION['tickets'] = array_filter($_SESSION['tickets'], fn($t) => $t['id'] != $id);
                }
                header('Location: /tickets');
                exit;
            }
        }

        echo $twig->render('pages/tickets/index.twig', [
            'tickets' => $_SESSION['tickets'],
            'csrf_token' => $csrf_token,
        ]);
        break;

    case '/dashboard':
        if (!isset($_SESSION['ticketapp_session'])) {
            header('Location: /login');
            exit;
        }

        $tickets = $_SESSION['tickets'] ?? [];
        $total = count($tickets);
        $open = count(array_filter($tickets, fn($t) => $t['status'] === 'open'));
        $resolved = count(array_filter($tickets, fn($t) => $t['status'] === 'closed'));

        $stats = [
            ['title' => 'Total Tickets', 'value' => $total, 'icon' => 'ticket', 'color' => 'text-gray-500', 'bg' => 'bg-gray-100'],
            ['title' => 'Open Tickets', 'value' => $open, 'icon' => 'alert-circle', 'color' => 'text-green-600', 'bg' => 'bg-green-100'],
            ['title' => 'Resolved Tickets', 'value' => $resolved, 'icon' => 'check-circle-2', 'color' => 'text-gray-600', 'bg' => 'bg-gray-100'],
        ];

        echo $twig->render('pages/dashboard.twig', [
            'stats' => $stats,
        ]);
        break;

    case '/logout':
        session_destroy();
        header('Location: /login');
        exit;

    default:
        http_response_code(404);
        echo $twig->render('pages/404.twig');
        break;
}
