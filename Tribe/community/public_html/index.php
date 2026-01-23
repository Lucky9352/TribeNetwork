<?php
$site = require './site.php';
$server = new Flarum\Http\Server($site);
$server->listen();
