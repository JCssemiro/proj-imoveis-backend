import { Controller, Get, Header } from '@nestjs/common';

const SWAGGER_UI_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0';

/**
 * Serve a página da documentação Swagger carregando CSS/JS do CDN.
 * Usado na Vercel (serverless), onde os assets do Nest Swagger não funcionam.
 * O spec é carregado de /api/v1/docs-json (servido pelo SwaggerModule com ui: false).
 */
@Controller('docs')
export class SwaggerDocsController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getDocs(): string {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>ImobiConnect API - Documentação</title>
  <link rel="stylesheet" href="${SWAGGER_UI_CDN}/swagger-ui.css"/>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-bundle.js"></script>
  <script src="${SWAGGER_UI_CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/api/v1/docs-json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [SwaggerUIBundle.plugins.DownloadUrl],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`;
  }
}
