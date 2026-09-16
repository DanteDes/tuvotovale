# UC-23 — Validar autenticidad de la notificación

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Antes de procesar cualquier notificación, el backend valida que realmente proviene de Mercado Pago, para prevenir notificaciones falsas que intenten acreditar votos sin un pago real.

## Precondiciones

- Se recibió una notificación en el endpoint webhook (UC-22).

## Flujo principal

1. El backend verifica la firma/secreto del webhook según el mecanismo que provea Mercado Pago para la integración elegida.
2. Si la firma es válida, continúa el procesamiento (UC-24). Si no, descarta la notificación.

## Flujos alternativos / excepciones

- Notificación con firma inválida o ausente: se rechaza sin procesar ningún cambio de estado, y se registra el intento para monitoreo.

## Reglas de negocio relacionadas

- Ninguna transacción debe procesarse sin haber validado la autenticidad del origen.

## Criterios de aceptación

- Dado una notificación con firma inválida o ausente, cuando se recibe, entonces se rechaza sin procesar ningún cambio de estado.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-22, UC-24.
