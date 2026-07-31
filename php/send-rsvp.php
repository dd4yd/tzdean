<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$attending = trim($_POST['attending'] ?? '');
$notes = trim($_POST['notes'] ?? '');

if ($name === '' || $email === '' || $attending === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please complete the required fields.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

$to = 'bollwerkt@gmail.com, daviddeanstl@gmail.com';
$subject = 'New RSVP from the wedding website';
$message = "New RSVP received.\n\n";
$message .= "Name: {$name}\n";
$message .= "Email: {$email}\n";
$message .= "Attending: {$attending}\n";
$message .= "Notes: {$notes}\n";

$headers = [];
$headers[] = 'From: Wedding Website <no-reply@yourdomain.com>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail($to, $subject, $message, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'RSVP sent successfully.']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'The RSVP could not be delivered right now.']);
}
