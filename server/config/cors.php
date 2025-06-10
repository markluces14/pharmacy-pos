<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
        'products', // <— add your endpoint if not under api/*
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173', // <-- your Vite dev server
    ],
    'allowed_origins_patterns' => [],


    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,

    'supports_credentials' => true,
];
