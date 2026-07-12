<?php
// Liveness check para Docker. Liviano: NO valida JWT ni toca la base de datos,
// solo confirma que Apache + PHP responden.
http_response_code(200);
header('Content-Type: application/json');
echo json_encode(['status' => 'ok']);
