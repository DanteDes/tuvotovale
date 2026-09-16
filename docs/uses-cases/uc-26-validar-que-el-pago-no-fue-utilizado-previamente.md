# UC-26 — Validar que el pago no fue utilizado previamente

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Garantiza idempotencia: un mismo pago/orden nunca genera más de un voto válido, incluso si Mercado Pago reenvía la notificación varias veces.

## Precondiciones

- Importe y moneda ya fueron validados (UC-25).

## Flujo principal

1. El backend verifica si ya existe un `Vote` en estado `valid` asociado a ese `payment_id`.
2. Si ya existe, no hace nada más (operación idempotente, no se crea un segundo voto).
3. Si no existe, continúa el procesamiento (UC-27).

## Flujos alternativos / excepciones

- Notificación duplicada de un pago ya procesado: se detecta en este paso y se ignora sin generar efectos adicionales.

## Reglas de negocio relacionadas

- Un mismo pago nunca puede emitir más de un voto válido.

## Criterios de aceptación

- Dado que la misma notificación de pago aprobado llega dos veces, cuando se procesa la segunda vez, entonces no se crea un segundo voto.

## Entidades involucradas

Payment, Vote.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-25, UC-27, UC-29.
