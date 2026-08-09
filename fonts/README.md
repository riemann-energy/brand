# fonts

Las tres familias del sistema, **self-hosted**. Congeladas el 2026-08-07 (D28).

| Familia | Rol | Licencia |
|---|---|---|
| Funnel Display | Títulos | SIL Open Font License |
| Hanken Grotesk | Cuerpo | SIL Open Font License |
| Geist Mono | Dato | SIL Open Font License |

Las tres son OFL: cero licencias, cero costo, incrustables en PDF.

## ⬜ Pendiente: traer los archivos

Hoy las maquetas del taller las cargan desde Google Fonts. **En producción van self-hosted**, por
tres razones, en orden de peso:

1. **Privacidad.** Con Google Fonts el navegador abre conexión a Google, y esa conexión lleva la
   IP del visitante. El sitio ya tiene exposición LFPDPPP pendiente por el formulario de
   contacto; no conviene sumar una transferencia a un tercero que no controlamos.
2. **Versión fija.** Google actualiza sus fuentes sin aviso. Self-hosted, la tipografía no cambia
   sola en producción.
3. **Velocidad.** Elimina el DNS y el TCP hacia otro host.

### Cómo

- Formato **WOFF2** únicamente.
- Subconjunto **`latin` + `latin-ext`**. El `latin-ext` no es opcional: es lo que trae los
  acentos y la ñ.
- Incluir el archivo de licencia OFL de cada familia junto a los `.woff2`. Es requisito de la
  licencia, y este repo es público.
- Las `@font-face` van en un `dist/fonts.css` aparte, para que quien solo quiera los tokens no
  se lleve las fuentes.
