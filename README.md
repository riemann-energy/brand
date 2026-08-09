🌐 **Repositorio público** — no entra acá nada que identifique a un cliente.

# brand — el sistema de marca de Riemann Energy

Tokens de diseño, marca y tipografías. **La fuente única** de color, tipografía y medidas para
el sitio, el deck, los impresos y la plataforma.

> 🔒 **El sistema está congelado** (paleta, marca, tipografía y medidas). No es sagrado: es caro.
> Cambiar el acento obliga a reauditar los pares de contraste y a regenerar todo lo que lo
> consume. Se puede — con la decisión registrada.

---

## Consumirlo

**Sin build** — marketing, impresos, prototipos:

```html
<link rel="stylesheet"
      href="https://cdn.jsdelivr.net/gh/riemann-energy/brand@v1.0.0/dist/tokens.css">
```

**Con build** — el sitio y la plataforma:

```json
"dependencies": {
  "@riemann-energy/tokens": "github:riemann-energy/brand#v1.0.0"
}
```

**Siempre con un tag.** Apuntar a `main` significa que el sistema puede cambiarte abajo de los
pies sin aviso.

### Usarlo

```html
<html data-theme="dark">   <!-- o "light" -->
```

```css
.tarjeta {
  background: var(--color-bg-surface);
  color: var(--color-fg-default);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-box);
  padding: var(--space-4);
}
```

---

## Qué hay adentro

```
tokens/
├── primitives/    los valores crudos, sin significado — NO se usan directo
└── semantic/      los roles: bg, fg, accent, status, utility… — esto es lo que se usa
brand-assets/      marca, versión mono, favicon, og
fonts/             las tres OFL, self-hosted
dist/              ⚠️ GENERADO — nunca se edita a mano
scripts/           build y chequeo de contraste
```

**Primitivos y semánticos están separados a propósito.** Un primitivo es `celadon.3 = #BADDCE`;
un semántico es `color.accent.default = {celadon.3}`. Así "cambiamos el celadón" es **un valor**,
y no una búsqueda del hex por todos lados. Los primitivos no salen al CSS.

## Trabajar en él

```bash
npm install
npm run build     # tokens/**.json → dist/
npm run check     # build + contraste WCAG en ambos temas
```

**Nunca edites `dist/`.** Es salida generada: tu cambio se pierde en el siguiente build. Se
commitea igual porque jsDelivr sirve archivos del repo, no artefactos de build.

Guía paso a paso: [`meta/how-to/cambiar-un-token.md`](https://github.com/riemann-energy/meta/blob/main/how-to/cambiar-un-token.md)

## Publicar una versión

```
build → check → commit → tag → los consumidores suben su tag
```

El tag no es opcional: es lo que ven jsDelivr y `package.json`. Sin tag, el cambio no existe
para nadie.

---

## Decisiones

| | |
|---|---|
| [ADR-0002](https://github.com/riemann-energy/meta/blob/main/why/0002-brand-publico.md) | Por qué este repo es público |
| [ADR-0004](https://github.com/riemann-energy/meta/blob/main/why/0004-tokens-dtcg.md) | Por qué los tokens están en formato DTCG |
| [ADR-0006](https://github.com/riemann-energy/meta/blob/main/why/0006-idioma.md) | Por qué los nombres están en inglés y los comentarios en español |

Los tokens siguen el formato [DTCG del W3C](https://www.designtokens.org/) y se compilan con
[Style Dictionary](https://styledictionary.com/).
