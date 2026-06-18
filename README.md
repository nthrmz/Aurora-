# Aurora Tarot

Aurora es un sitio web académico de tarot moderno, responsive y desplegable en Netlify. Incluye landing page, carrito de compras, foro de comentarios, agenda interactiva, modo claro/oscuro, SEO básico, accesibilidad y PWA.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Bootstrap 5 por CDN
- AOS Animation por CDN
- Font Awesome por CDN
- Google Fonts: Cinzel Decorative y Poppins
- LocalStorage
- Service Worker / PWA

## Páginas

- `index.html`: landing page con carrusel hero, CTA, redes, servicios y carta del día.
- `lecturas.html`: tarjetas de servicios de tarot.
- `carrito.html`: carrito con cantidades, subtotales, total y reserva simulada.
- `foro.html`: foro con comentarios, filtro y moderación básica.
- `agenda.html`: calendario interactivo con creación, edición y eliminación de eventos.
- `sobre.html`: presentación de la tarotista.
- `contacto.html`: formulario con validaciones y preparado para Netlify Forms.

## Funcionalidades dinámicas

1. Carrito de compras con LocalStorage.
2. Foro de comentarios con aprobación, ocultar y eliminar.
3. Agenda interactiva con eventos editables.
4. Carta del día con mensaje aleatorio.
5. Modo claro/oscuro persistente en LocalStorage.

## Características adicionales

- SEO básico con meta tags, `sitemap.xml` y `robots.txt`.
- Accesibilidad con atributos `aria`, textos alternativos, skip link y focus visible.
- PWA con `manifest.json`, íconos y página offline.
- Diseño responsive con Bootstrap y CSS personalizado.

## Cómo abrir el proyecto

1. Descomprime la carpeta.
2. Abre la carpeta en Visual Studio Code.
3. Abre `index.html` con Live Server.
4. Edita los textos, enlaces de redes sociales y URLs de Netlify cuando tengas el dominio final.

## Cómo subir a GitHub

```bash
git init
git add .
git commit -m "Inicio del proyecto Aurora Tarot"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/aurora-tarot.git
git push -u origin main
```

## Cómo publicar en Netlify

1. Entra a Netlify.
2. Clic en "Add new site".
3. Selecciona "Import an existing project".
4. Conecta tu repositorio de GitHub.
5. Como el proyecto es HTML/CSS/JS puro, no necesita build command.
6. Public directory: deja vacío o usa `/`.
7. Publica el sitio.

## Importante

Cuando tengas el enlace real de Netlify, reemplaza `https://tu-sitio-netlify.netlify.app` en:

- `sitemap.xml`
- `robots.txt`
- README.md



## Personalización rápida
- Para cambiar la imagen principal de la tarotista, reemplaza el archivo `assets/img/aurora.jpg` conservando el mismo nombre.
- Para cambiar el logo, reemplaza `assets/img/logo-aurora.svg` y `assets/icons/favicon.svg`.
- Las redes sociales actuales son enlaces de ejemplo y puedes reemplazarlas por las reales.


- El modo claro/oscuro se controla con un interruptor animado en el header; el botón se desplaza al cambiar de modo.

## Optimización PageSpeed
- Imagen principal de Aurora incluida como `assets/img/aurora.jpg` y versión optimizada `assets/img/aurora.webp`.
- Animaciones scroll reveal implementadas sin depender de AOS externo para mejorar rendimiento.
- Imágenes con dimensiones, carga diferida y decodificación asíncrona.
- Meta robots, SEO básico, sitemap y robots incluidos.

- La imagen de Aurora fue reemplazada por la fotografía proporcionada y optimizada como JPG/WebP para rendimiento.
