# UC-25 — Validar importe y moneda

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

El backend compara el importe y la moneda informados por Mercado Pago contra los esperados según la orden original, para detectar manipulaciones o inconsistencias.

## Precondiciones

- Se consultó el estado autoritativo del pago (UC-24).

## Flujo principal

1. El backend recupera el `Payment` original (`pending`) asociado a la referencia externa.
2. Compara importe y moneda contra lo devuelto por la consulta a Mercado Pago.
3. Si coinciden, continúa el procesamiento (UC-26). Si no, marca el caso para revisión y no emite el voto.

## Flujos alternativos / excepciones

- Importe o moneda no coinciden: el voto no se emite; el caso queda registrado para revisión manual.

## Reglas de negocio relacionadas

- El monto se fijó al momento de crear la orden (tipo de cambio oficial al click en "Votar") y no debe variar respecto de lo efectivamente cobrado.

## Criterios de aceptación

- Dado un pago cuyo importe o moneda no coincide con la orden original, cuando se valida, entonces el voto no se emite y el caso se marca para revisión.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-20, UC-24, UC-26.
