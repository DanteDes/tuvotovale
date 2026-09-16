# UC-50 — Crear y editar equipos

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Alta y edición de equipos: nombre, slug, colores (primario, secundario, terciario), país y contenido.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede a la sección de equipos del panel.
2. Crea un nuevo `Team` o edita uno existente, definiendo nombre, slug, los 3 colores, país y contenido asociado.
3. Guarda los cambios.

## Flujos alternativos / excepciones

- No existe carga de escudo/logo: ese campo no forma parte del modelo (decisión de producto, sección 13.1 del handoff).

## Reglas de negocio relacionadas

- No se usan escudos ni logos oficiales de los clubes; la representación visual es siempre un cuadrado de color.

## Criterios de aceptación

- Dado que el administrador crea un equipo, cuando lo guarda, entonces queda disponible para asociarse a clásicos, con sus 3 colores definidos.

## Entidades involucradas

Team.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-02, UC-51.
