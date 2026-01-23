<?php
error_reporting(E_ALL & ~E_WARNING & ~E_DEPRECATED);

set_error_handler(function($errno, $errstr, $errfile, $errline) {
    if ($errno === E_WARNING || $errno === E_DEPRECATED) {
        if (strpos($errfile, '/vendor/thecodingmachine/safe/') !== false) {
            if (strpos($errstr, 'is not a supported builtin type') !== false ||
                strpos($errstr, 'will be interpreted as a class name') !== false) {
                return true;
            }
        }
    }
    return false;
}, E_WARNING | E_DEPRECATED);

require __DIR__.'/vendor/autoload.php';
return Flarum\Foundation\Site::fromPaths([
    'base' => __DIR__,
    'public' => __DIR__,
    'storage' => __DIR__.'/storage',
]);
