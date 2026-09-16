# UC-29 — Procesar pagos duplicados sin duplicar votos

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Caso de uso "paraguas" de idempotencia general del webhook: cubre reintentos de red, reenvíos de Mercado Pago, y cualquier otra causa de notificaciones duplicadas para el mismo pago.

## Precondiciones

- Se reciben una o más notificaciones para el mismo `payment_id`.

## Flujo principal

1. Cada notificación pasa por el mismo pipeline de validación (UC-22 a UC-27).
2. El chequeo de "pago no utilizado previamente" (UC-26) es el mecanismo concreto que garantiza que, sin importar cuántas veces se procese la misma notificación, el resultado final nunca supere un voto válido por pago.

## Flujos alternativos / excepciones

- N notificaciones idénticas o casi idénticas para el mismo pago no deben generar N votos.

## Reglas de negocio relacionadas

- Un mismo pago nunca puede emitir más de un voto válido (idempotencia, sección 6.1 del handoff).

## Criterios de aceptación

- Dado N notificaciones idénticas para el mismo pago, cuando se procesan todas, entonces el resultado final es exactamente 0 o 1 voto válido, nunca más.

## Entidades involucradas

Payment, Vote.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-22, UC-26.
