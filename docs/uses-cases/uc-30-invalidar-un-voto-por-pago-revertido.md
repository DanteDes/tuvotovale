# UC-30 — Invalidar un voto por pago revertido

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Cuando un pago que ya generó un voto `valid` cambia posteriormente a un estado no aprobado (`rejected`, `cancelled`, `refunded` o `charged_back`), el voto asociado se invalida.

## Precondiciones

- Existe un `Vote` en estado `valid` asociado a un `Payment` que originalmente estaba `approved`.

## Flujo principal

1. El backend recibe una notificación de cambio de estado para un pago que ya tenía un voto `valid`.
2. Cambia el `Vote` a `invalidated`, registrando el motivo (por ejemplo, "pago reembolsado" o "contracargo").
3. Descuenta ese voto del `classic_score` del clásico correspondiente.
4. No borra el registro del voto: lo conserva con su nuevo estado y motivo, para trazabilidad y auditoría.

## Flujos alternativos / excepciones

- Este mismo mecanismo aplica cuando un pago se reembolsa por haber excedido el límite de votos (UC-27), aunque en ese caso el voto nunca llegó a estar en `valid` (se reembolsa antes de emitirlo).

## Reglas de negocio relacionadas

- Si un pago se revierte, cancela o deja de ser válido, se descuenta el voto asociado.
- No se contemplan reembolsos parciales: siempre son totales.
- Los votos nunca se borran físicamente; se invalidan con motivo registrado.

## Criterios de aceptación

- Dado un voto `valid` cuyo pago se revierte, cuando se procesa la notificación, entonces el voto pasa a `invalidated`, se registra el motivo, y el marcador del clásico se actualiza restando ese voto.

## Entidades involucradas

Vote, Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-27, UC-28, UC-57.
