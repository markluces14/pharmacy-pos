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

    'allowed_headers' => ['*'],

    'supports_credentials' => true,
];
