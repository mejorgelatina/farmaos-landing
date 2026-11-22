# /medicos/

Páginas Reach (farmaOs Grow/Reach) de doctores, una carpeta por slug con su
propio `index.html` — Vercel sirve `medicos/<slug>/` directo, sin rewrites.

Plantillas movidas aquí el 22-nov-2026 desde `mejorgelatina/Farmapperpsystem`
(carpeta `reach/`), por decisión de jor: Reach se sirve desde la landing
(`web.frmos.io/medicos/<slug>/`), y de paso suma SEO propio por doctor.

## Convención para un doctor real

1. Nueva carpeta `medicos/<slug-del-doctor>/index.html`, basada en la
   plantilla de su especialidad (general, dental, derma, cirugía plástica,
   o la variante con add-on de identidad visual).
2. Mientras los datos sean ficticios o el doctor no esté confirmado como
   cliente: `<meta name="robots" content="noindex, nofollow">` en el
   `<head>` (ya está en las 5 plantillas demo de este folder) y **no**
   agregarla a `sitemap.xml`.
3. Cuando el doctor esté confirmado y la página tenga sus datos reales:
   quitar esa etiqueta `noindex` y agregar la URL a `sitemap.xml`
   (`https://web.frmos.io/medicos/<slug>/`).
4. Cada página ya trae su propio JSON-LD `schema.org/Physician` (nombre,
   especialidad, dirección, horarios) — actualizar esos datos junto con el
   resto del contenido al dar de alta al doctor real.

## Plantillas demo (datos 100% ficticios, noindex)

- `dra-ejemplo/` — general (M8)
- `dra-ejemplo-dental/` — odontología (M11)
- `dra-ejemplo-derma/` — dermatología (M11)
- `dr-ejemplo-cirugia/` — cirugía plástica (M16)
- `dra-ejemplo-identidad/` — add-on "Identidad visual" (logo + paleta propia del doctor, `claude/73`)
