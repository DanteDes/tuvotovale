# UC-40 — Crear una temporada

**Categoría:** Ranking y temporadas
**Actor(es):** Administrador (o proceso automático)
**Prioridad:** MVP

## Descripción

Se crea una nueva temporada con fecha de inicio y una duración fija de 30 días.

## Precondiciones

- No hay una temporada activa que se solape, o la temporada anterior acaba de cerrarse (UC-47).

## Flujo principal

1. Se crea un registro `Season` con `start_date`, `end_date` = `start_date` + 30 días, y estado `active`.
2. Automáticamente, participan todos los clásicos disponibles en el sistema — no hay selección manual de cuáles entran.

## Flujos alternativos / excepciones

- No hay curación manual de qué clásicos participan: siempre son todos los existentes al momento de crear la temporada.

## Reglas de negocio relacionadas

- Cada temporada dura 30 días corridos (no un mes calendario).
- En cada temporada compiten todos los clásicos disponibles en el sistema.

## Criterios de aceptación

- Dado que se crea una temporada, cuando se guarda, entonces incluye automáticamente todos los clásicos existentes y dura exactamente 30 días.

## Entidades involucradas

Season, Classic/Rivalry.

## Preguntas abiertas

- Si la creación de la siguiente temporada es automática al cerrarse la anterior, o requiere una acción manual del administrador.

## Casos de uso relacionados

UC-41, UC-47, UC-54.
