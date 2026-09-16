# UC-56 — Ver votos

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Listado y detalle de votos (`Vote`): equipo, clásico/arena, pago asociado, identidad técnica del votante, y estado.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede a la sección de votos.
2. Puede filtrar por clásico, temporada o estado (`pending`, `valid`, `invalidated`).
3. Ve el detalle de cada voto, incluyendo su motivo si fue invalidado.

## Flujos alternativos / excepciones

- Ninguno adicional; es una vista de consulta.

## Reglas de negocio relacionadas

- Los votos nunca se borran físicamente; se invalidan con motivo registrado.

## Criterios de aceptación

- Dado que el administrador busca votos por clásico, cuando filtra, entonces puede ver todos los votos (válidos, pendientes, invalidados) con su motivo si fue invalidado.

## Entidades involucradas

Vote.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-55, UC-57.
