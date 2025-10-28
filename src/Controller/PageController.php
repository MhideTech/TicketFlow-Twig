<?php
// src/Controller/PageController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PageController extends AbstractController
{
    #[Route('/', name: 'app_landing')]
    public function landing(): Response
    {
        return $this->render('pages/landing.twig');
    }

    #[Route('/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        $error = $authenticationUtils->getLastAuthenticationError();
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('pages/login.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route('/register', name: 'app_register')]
    public function register(): Response
    {
        return $this->render('pages/register.twig');
    }

    #[Route('/dashboard', name: 'app_dashboard')]
    public function dashboard(): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Optionally redirect to tickets or show dashboard
        // Example: show dashboard stats, but pass dummy tickets:
        $tickets = []; // no tickets yet
        return $this->render('pages/dashboard.twig', [
            'tickets' => $tickets,
        ]);
    }

    #[Route('/tickets', name: 'app_tickets')]
    public function tickets(): Response
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        // Here, fetch tickets from DB or API. For now empty.
        $tickets = [];

        return $this->render('pages/tickets/index.twig', [
            'tickets' => $tickets,
        ]);
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout()
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }
}
