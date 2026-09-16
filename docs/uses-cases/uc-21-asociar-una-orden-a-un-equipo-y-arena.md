# UC-21 — Asociar una orden a un equipo y Arena

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

La orden creada debe quedar vinculada de forma inequívoca al equipo elegido y a la instancia de Arena/clásico/temporada correspondiente, para poder emitir el voto correcto cuando el pago se apruebe.

## Precondiciones

- Se creó la orden (UC-20).

## Flujo principal

1. Al crear el `Payment`, el backend guarda además los datos necesarios (team_id, arena_id o classic_id + season_id) para poder crear el `Vote` correspondiente una vez llegue la confirmación del pago.

## Flujos alternativos / excepciones

- Ninguno relevante; esta asociación debe ser inmutable una vez creada la orden.

## Reglas de negocio relacionadas

- El equipo y clásico elegidos al momento de pagar no pueden alterarse después de creada la orden.

## Criterios de aceptación

- Dado un pago aprobado, cuando se emite el voto, entonces el voto queda asociado exactamente al equipo y clásico elegidos al momento de iniciar el pago.

## Entidades involucradas

Payment, Vote, Team, Arena.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-20, UC-28.
