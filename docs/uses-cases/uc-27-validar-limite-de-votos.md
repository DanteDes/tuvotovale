# UC-27 — Validar límite de votos

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Re-evalúa el límite de votos (5 votos / 24 horas, por clásico) en el momento de emitir el voto —la capa posterior al pago—, considerando identidad local y `payer_id` cuando esté disponible (no la IP).

## Precondiciones

- El pago no fue utilizado previamente (UC-26).

## Flujo principal

1. El backend cuenta los votos válidos existentes para ese clásico, dentro de la ventana de 24 horas, por identidad local y por `payer_id` (si está disponible).
2. Si ninguna señal superó el límite, continúa y emite el voto (UC-28).
3. Si alguna señal ya superó el límite en este momento, el voto no se acredita: se dispara el flujo de reembolso completo del pago (ver UC-30 y la decisión de producto sobre pagos aprobados que exceden el límite).

## Flujos alternativos / excepciones

- Este caso solo debería ocurrir cuando varias órdenes en paralelo superan el límite justo al momento de pagarse (la capa previa al pago ya bloquea la mayoría de los intentos).
- La IP no se usa en esta re-validación posterior al pago, para no penalizar injustamente a alguien que comparte red con otra persona.

## Reglas de negocio relacionadas

- El límite debe evaluarse en el momento de emitir el voto, no únicamente al crear la orden.
- Un pago aprobado que excede el límite se reembolsa completo y no genera voto.

## Criterios de aceptación

- Dado un pago aprobado cuya identidad/`payer_id` ya superó el límite al momento de la confirmación, cuando se procesa, entonces el pago se reembolsa completo y el voto no se acredita.
- Dado un pago aprobado dentro del límite, cuando se procesa, entonces el voto se emite normalmente.

## Entidades involucradas

Vote, Voter Identity, Payment.

## Preguntas abiertas

Ninguna (mecánica resuelta; queda pendiente solo el mensaje de UI del límite, ver UC-07).

## Casos de uso relacionados

UC-07, UC-26, UC-28, UC-30.
