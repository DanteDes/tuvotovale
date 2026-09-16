# UC-22 — Recibir notificación de Mercado Pago

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend), Mercado Pago
**Prioridad:** MVP

## Descripción

El backend expone un endpoint webhook que recibe las notificaciones de Mercado Pago sobre cambios de estado de un pago.

## Precondiciones

- Existe una orden creada (UC-20) y el usuario inició o completó el pago en Mercado Pago.

## Flujo principal

1. Mercado Pago envía un POST al endpoint configurado, con datos del evento (tipo de notificación, id de pago).
2. El backend responde rápido (200 OK) y dispara el proceso de validación real del pago (UC-23 en adelante).

## Flujos alternativos / excepciones

- Mercado Pago puede reenviar la misma notificación varias veces; el sistema debe tolerarlo sin efectos duplicados (ver UC-26, UC-29).

## Reglas de negocio relacionadas

- Regla fundamental: el frontend nunca es la fuente de verdad de que un voto existe; este webhook es el disparador real de la acreditación.

## Criterios de aceptación

- Dado que Mercado Pago envía una notificación válida, cuando llega al endpoint, entonces el sistema la registra y dispara el proceso de validación del pago.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-08, UC-23, UC-24.
