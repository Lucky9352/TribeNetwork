<?php

/**
 * Tribe Network - Flarum Theme Extension
 *
 * Custom styling for the Tribe forum with dark mode,
 * YikYak/Fizz inspired design, seamless with WWW/AI sites.
 *
 * Also includes CORS support for custom frontend.
 */

use Flarum\Extend;
use Laminas\Diactoros\Response\EmptyResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * CORS Middleware for Custom Frontend
 * Allows cross-origin requests from your custom frontend.
 *
 * IMPORTANT: This middleware handles OPTIONS preflight requests BEFORE
 * passing to the handler to prevent 405 errors from Flarum's route resolver.
 */
class TribeCorsMiddleware implements MiddlewareInterface
{
    private function getAllowedOrigins(): array
    {
        $envOrigins = getenv('ALLOWED_ORIGINS');
        return $envOrigins
            ? array_map('trim', explode(',', $envOrigins))
            : [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:8080',
        ];
    }

    private function isOriginAllowed(string $origin): bool
    {
        if (empty($origin)) {
            return true;
        }
        return in_array($origin, $this->getAllowedOrigins());
    }

    private function addCorsHeaders(ResponseInterface $response, string $origin): ResponseInterface
    {
        return $response
            ->withHeader('Access-Control-Allow-Origin', $origin ?: '*')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-Token')
            ->withHeader('Access-Control-Allow-Credentials', 'true')
            ->withHeader('Access-Control-Expose-Headers', 'X-CSRF-Token')
            ->withHeader('Access-Control-Max-Age', '86400');
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $origin = $request->getHeaderLine('Origin');
        $isAllowed = $this->isOriginAllowed($origin);

        if ($request->getMethod() === 'OPTIONS') {
            $response = new EmptyResponse(204);
            if ($isAllowed) {
                $response = $this->addCorsHeaders($response, $origin);
            }
            return $response;
        }

        $response = $handler->handle($request);

        if ($isAllowed) {
            $response = $this->addCorsHeaders($response, $origin);
        }

        return $response;
    }
}

/**
 * CSRF Exempt Middleware for External Frontend
 * Bypasses CSRF checks for requests from allowed CORS origins.
 *
 * This is needed because:
 * 1. External frontends can't obtain a CSRF token via session
 * 2. Token-based auth (Authorization header) should bypass CSRF anyway
 * 3. The /api/token endpoint needs to be accessible to get a token
 */
class TribeCsrfExemptMiddleware implements MiddlewareInterface
{
    private function getAllowedOrigins(): array
    {
        $envOrigins = getenv('ALLOWED_ORIGINS');
        return $envOrigins
            ? array_map('trim', explode(',', $envOrigins))
            : [
                'http://localhost:3000',
                'http://localhost:5173',
                'http://localhost:8080',
            ];
    }

    private function isOriginAllowed(string $origin): bool
    {
        if (empty($origin)) {
            return false;
        }
        return in_array($origin, $this->getAllowedOrigins());
    }

    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ): ResponseInterface {
        $origin = $request->getHeaderLine('Origin');

        if ($this->isOriginAllowed($origin)) {
            $hasAuth = $request->hasHeader('Authorization');

            if (!$hasAuth) {
                $request = $request->withHeader('X-Requested-With', 'XMLHttpRequest');
                $request = $request->withAttribute('bypassCsrfToken', true);
            }
        }

        return $handler->handle($request);
    }
}

return [
    (new Extend\Middleware('api'))
        ->insertBefore(\Flarum\Http\Middleware\ParseJsonBody::class, TribeCorsMiddleware::class)
        ->insertBefore(\Flarum\Http\Middleware\CheckCsrfToken::class, TribeCsrfExemptMiddleware::class),

    (new Extend\Middleware('api'))
        ->remove(\Flarum\Http\Middleware\CheckCsrfToken::class),
];
