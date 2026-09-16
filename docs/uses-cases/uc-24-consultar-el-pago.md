# UC-24 — Consultar el pago

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Una vez validada la autenticidad de la notificación, el backend consulta el estado real y completo del pago contra la API de Mercado Pago, sin confiar únicamente en el payload del webhook.

## Precondiciones

- Se validó la autenticidad de la notificación (UC-23).

## Flujo principal

1. Con el `payment_id` recibido, el backend consulta el endpoint correspondiente de la API de Mercado Pago.
2. Obtiene estado, monto, moneda, `payer.id` (si existe) y demás datos relevantes del pago.

## Flujos alternativos / excepciones

- Si la consulta a la API falla (error de red, timeout), el backend debe reintentar antes de descartar la notificación, dado que la fuente de verdad es esta consulta, no el payload original.

## Reglas de negocio relacionadas

- El backend nunca confía únicamente en los datos que trae la notificación; siempre re-consulta el estado autoritativo.

## Criterios de aceptación

- Dado un `payment_id` de una notificación válida, cuando se consulta, entonces se obtiene el estado actual autoritativo del pago desde Mercado Pago.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-23, UC-25.
