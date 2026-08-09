# brand/ADR-0003 · `dist/` se commitea al repo

**Fecha:** 2026-08-09 · **Estado:** Aceptada · **Decide:** Marco

---

## Contexto

La regla general en cualquier proyecto es no versionar artefactos de build: ensucian los diffs,
generan conflictos de merge y se pueden regenerar.

## Decisión

**`dist/` se commitea.** Y el CI verifica que lo commiteado coincida con lo que produce el build.

## Por qué

**Porque jsDelivr sirve archivos del repositorio, no artefactos de build.** La vía de consumo sin
autenticación —la que usan marketing e impresos, que no tienen Node— es un `<link>` a
`cdn.jsdelivr.net/gh/riemann-energy/brand@<tag>/dist/tokens.css`. Si `dist/` no está en el repo,
esa URL no existe.

Y una vez commiteado, habilita de paso el consumo por dependencia git sin paso de build del lado
del consumidor, que es lo que hace innecesario publicar en npm todavía.

**El chequeo del CI es la parte que lo hace seguro.** Sin él, la objeción de siempre se cumple:
alguien edita `dist/` a mano o se olvida de correr el build, y los consumidores reciben algo que
no sale de los tokens. Con él, ese caso rompe el build en vez de llegar a producción.

## Consecuencias

**A favor**
- Consumo por CDN sin auth, sin build, sin npm.
- El repo, en cualquier tag, es autosuficiente.

**En contra**
- **Ruido en los diffs.** Cada cambio de token toca dos lugares. Se mitiga con
  `.gitattributes` marcando `dist/** linguist-generated=true`, que hace que GitHub colapse esos
  diffs por defecto — pero no los elimina.
- Un cambio de token que toque muchos semánticos produce un diff grande en `dist/` que hay que
  aprender a ignorar al revisar.

**Riesgo conocido**
- Conflictos de merge en `dist/` si dos ramas tocan tokens. Se resuelven descartando el `dist/`
  de las dos y corriendo el build de nuevo: la fuente son los JSON, nunca el CSS.

## Alternativas descartadas

| | Por qué no |
|---|---|
| **`dist/` en `.gitignore`, build en cada consumidor** | Mata el consumo por CDN, que es el caso de uso de quien no tiene build |
| **Publicar solo en npm** | Obliga a marketing a instalar Node para usar un color |
| **Generar `dist/` en un release de GitHub** | Los assets de release no los sirve jsDelivr por tag de la misma forma; suma un paso manual |

## Relacionadas

- [ADR-0002 · `brand` es un repo público](https://github.com/riemann-energy/meta/blob/main/why/0002-brand-publico.md)
