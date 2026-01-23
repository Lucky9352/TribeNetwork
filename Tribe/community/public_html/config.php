<?php

$dbOptions = [];
if (file_exists('/etc/ssl/certs/ca-certificates.crt')) {
    $dbOptions[PDO::MYSQL_ATTR_SSL_CA] = '/etc/ssl/certs/ca-certificates.crt';
}

return array (
    'debug' => filter_var(getenv('FLARUM_DEBUG'), FILTER_VALIDATE_BOOLEAN),
    'url' => getenv('FLARUM_URL'),
    'database' => array (
        'driver' => 'mysql',
        'host' => getenv('MYSQL_HOST') ?: getenv('MYSQLHOST'),
        'port' => (int)(getenv('MYSQL_PORT') ?: getenv('MYSQLPORT')),
        'database' => getenv('MYSQL_DATABASE') ?: getenv('MYSQLDATABASE'),
        'username' => getenv('MYSQL_USER') ?: getenv('MYSQLUSER'),
        'password' => getenv('MYSQL_PASSWORD') ?: getenv('MYSQLPASSWORD'),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => 'flarum_',
        'strict' => true,
        'engine' => 'InnoDB',
        'prefix_indexes' => true,
        'options' => $dbOptions,
    ),
    'paths' => array (
        'api' => 'api',
        'admin' => 'admin',
    ),
    'headers' => array (
        'poweredByHeader' => false,
        'referrerPolicy' => 'same-origin',
    ),
);
