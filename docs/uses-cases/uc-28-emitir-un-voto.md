# UC-28 — Emitir un voto

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Una vez pasadas todas las validaciones (autenticidad, importe/moneda, no duplicado, límite), el backend crea o actualiza el `Vote` a estado `valid` y actualiza los contadores del clásico.

## Precondiciones

- El pago pasó las validaciones de las secciones anteriores (UC-23 a UC-27).

## Flujo principal

1. El backend crea (o actualiza desde `pending`) el registro `Vote`, asociado a team, arena, payment y voter_identity, con estado `valid`.
2. Recalcula el `classic_score` del clásico correspondiente (a reflejarse en el próximo refetch de la Arena).

## Flujos alternativos / excepciones

- Ninguno relevante; este paso solo se alcanza tras pasar todas las validaciones previas.

## Reglas de negocio relacionadas

- Solo un pago aprobado y válido puede generar un voto válido.
- El ranking usa únicamente votos en estado `valid`.

## Criterios de aceptación

- Dado un pago aprobado que pasa todas las validaciones, cuando se procesa, entonces el voto queda en `valid` y suma al `classic_score` correspondiente.

## Entidades involucradas

Vote, Classic/Rivalry.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-27, UC-42, UC-46.
