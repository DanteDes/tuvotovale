# UC-09 — Ver el resultado de su voto

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

Una vez confirmado el voto (estado `valid`), el usuario ve una confirmación de que su voto fue acreditado y su efecto en el estado del clásico.

## Precondiciones

- El usuario volvió desde Mercado Pago (UC-08) y el backend procesó el pago.

## Flujo principal

1. La UI consulta el estado del voto asociado a la orden.
2. Si el voto está en `valid`, muestra una confirmación de participación junto con el estado actualizado del marcador del clásico.

## Flujos alternativos / excepciones

- Si el pago fue rechazado o cancelado, se informa al usuario que el voto no se acreditó.
- Si el pago se aprobó pero excedió el límite de votos, se informa que el voto no se acreditó y que el pago será reembolsado (ver UC-27).

## Reglas de negocio relacionadas

- Solo un pago aprobado y válido puede generar un voto válido.

## Criterios de aceptación

- Dado un voto en estado `valid`, cuando el usuario consulta el resultado, entonces ve confirmación de su participación y el estado actualizado del marcador.
- Dado un voto que no llegó a acreditarse, cuando el usuario consulta el resultado, entonces se le informa claramente que no se acreditó (y por qué, si corresponde).

## Entidades involucradas

Vote, Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-08, UC-27, UC-28, UC-30.
