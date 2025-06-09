<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        Gate::define('add-user', function ($user) {
            return $user->role === 'admin';
        });
        Gate::define('view-transactions', function ($user) {
            return in_array($user->role, ['admin', 'manager']);
        });

        Gate::define('add-transaction', function ($user) {
            return in_array($user->role, ['admin', 'manager', 'cashier']);
        });
        Gate::define('view-feedback', fn($user) => $user->role === 'admin');

        // $this->registerPolicies(); // Removed because registerPolicies() does not exist in this class
    }
}
