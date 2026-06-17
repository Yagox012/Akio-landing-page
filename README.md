# AKIO Studio — Landing Page

Landing page oficial de **AKIO Studio**, agencia digital boutique que crea páginas web de alta conversión con entrega express (48 horas) para negocios locales y profesionales independientes.

## 🧱 Stack

Sitio estático puro, sin frameworks ni librerías de animación externas — máxima velocidad y portabilidad.

- **HTML5** semántico
- **Tailwind CSS** (vía CDN Play, fase de lanzamiento)
- **Vanilla JavaScript** para interacciones
- **CSS nativo** (`@keyframes`, transiciones) para los efectos visuales

## 🎨 Sistema de diseño

- **Liquid Glass (Glassmorphism):** contenedores de vidrio esmerilado con `backdrop-filter`, bordes sutiles y reflejo interno.
- **Spring Physics:** micro-interacciones con curva de overshoot `cubic-bezier(0.34, 1.56, 0.64, 1)`, compresión al presionar y entrada en cascada.
- **Accesibilidad:** animaciones desactivadas con `@media (prefers-reduced-motion: reduce)`.

## 📁 Estructura

```
.
├── index.html        # Estructura + Nav Flotante + Hero (fase 1)
├── css/styles.css    # Liquid Glass, Spring physics, keyframes
├── js/app.js         # Nav scroll, menú móvil, reveal por scroll
├── assets/           # Logo, imágenes (pendiente)
└── vercel.json       # Configuración de deploy estático
```

## 🚀 Desarrollo local

Al ser estático, basta con servir la carpeta:

```bash
# Opción 1: Python
python3 -m http.server 3000

# Opción 2: Node
npx serve .
```

Luego abre <http://localhost:3000>.

## ☁️ Deploy en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new)
2. Importa este repositorio de GitHub
3. Framework Preset: **Other** (sitio estático)
4. Deploy — Vercel publica automáticamente con cada push a la rama

## 📋 Estado del proyecto

- [x] **Fase 1:** Sistema de diseño + Nav Flotante + Hero
- [ ] **Fase 2:** Sección de Beneficios
- [ ] **Fase 3:** Oferta de lanzamiento + contador de cupos
- [ ] **Fase 4:** Formulario de contacto + WhatsApp

## ⚙️ Pendientes (TODO)

- Reemplazar el número de WhatsApp placeholder (`521000000000`) por el real.
- Añadir logo/favicon en `assets/`.
- (Opcional) Migrar Tailwind CDN a build compilado para producción.
