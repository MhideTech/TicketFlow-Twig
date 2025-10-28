require_once __DIR__ . '/../bootstrap.php';

// Fetch ticket stats from database
$totalTickets = $db->query("SELECT COUNT(*) FROM tickets")->fetchColumn();
$openTickets = $db->query("SELECT COUNT(*) FROM tickets WHERE status = 'open'")->fetchColumn();
$resolvedTickets = $db->query("SELECT COUNT(*) FROM tickets WHERE status = 'resolved'")->fetchColumn();

// Prepare data for Twig
$stats = [
    [
        'title' => 'Total Tickets',
        'value' => $totalTickets,
        'icon' => 'ticket',
        'color' => 'text-gray-500',
        'bg' => 'bg-gray-100'
    ],
    [
        'title' => 'Open Tickets',
        'value' => $openTickets,
        'icon' => 'alert-circle',
        'color' => 'text-green-600',
        'bg' => 'bg-green-100'
    ],
    [
        'title' => 'Resolved Tickets',
        'value' => $resolvedTickets,
        'icon' => 'check-circle-2',
        'color' => 'text-gray-600',
        'bg' => 'bg-gray-100'
    ]
];

// Render dashboard.twig and pass $stats
echo $twig->render('dashboard.twig', ['stats' => $stats]);
