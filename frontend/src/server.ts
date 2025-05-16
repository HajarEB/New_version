import { enableProdMode } from '@angular/core';
import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');



const app = express();

enableProdMode(); //activate production mode


//set security headers
function secureHeaders(res: express.Response){
  res.setHeader('X-Frame-Options', 'SAMEORIGIN'); // Missing Anti-clickjacking Header
  res.setHeader('X-Content-Type-Options', 'nosniff'); //X-Content-Type-Options Header Missing
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin"); //Insufficient Site Isolation Against Spectre Vulnerability
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp"); //Insufficient Site Isolation Against Spectre Vulnerability
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin"); //Insufficient Site Isolation Against Spectre Vulnerability
  res.setHeader("Permissions-Policy", "geolocation=(), camera=(), microphone=(), fullscreen=(self)"); // Permissions Policy Header Not Set
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload"); //Strict-Transport-Security (HSTS)
  res.removeHeader("X-Powered-By"); // Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s)
}


// set headers; this is mainly designed for dynamic files
app.use((req, res, next) => {
  secureHeaders(res);
  // no caching headers
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, private');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  next();
});



const angularApp = new AngularNodeAppEngine();


/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
    immutable: true,
    setHeaders: (res, path) => {
      secureHeaders(res);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable'); //allow caching: max-age = 31536000 s = 1 year
    }
  })

);


/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
