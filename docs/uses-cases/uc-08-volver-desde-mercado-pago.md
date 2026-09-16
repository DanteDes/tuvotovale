# UC-08 — Volver desde Mercado Pago

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

Tras completar (o abandonar) el pago en Mercado Pago, el usuario vuelve a la plataforma mediante la URL de retorno configurada en el checkout.

## Precondiciones

- Se inició un pago (UC-07).

## Flujo principal

1. Mercado Pago redirige al usuario a una URL de retorno (éxito, pendiente o error) con parámetros de referencia de la orden.
2. El frontend muestra un estado de "procesando/confirmando" y consulta contra el backend el estado real del voto asociado a esa orden.
3. Cuando el backend confirma que el voto pasó a `valid` (es decir, que el webhook ya fue procesado), el frontend muestra el resultado (UC-09).

## Flujos alternativos / excepciones

- Si el usuario vuelve antes de que el webhook de Mercado Pago haya sido procesado, el frontend debe mostrar un estado intermedio y reintentar la consulta (polling corto) hasta obtener confirmación o un timeout razonable.
- Si el pago termina en un estado no aprobado, se informa que el voto no se acreditó (ver UC-09).

## Reglas de negocio relacionadas

- Regla fundamental: el frontend nunca es la fuente de verdad de que un voto existe. El redirect de Mercado Pago solo dispara la experiencia de retorno, nunca acredita el voto por sí mismo.

## Criterios de aceptación

- Dado que el usuario vuelve desde Mercado Pago y el webhook todavía no fue procesado, cuando consulta el estado, entonces la UI no muestra el voto como acreditado hasta que el backend lo confirme.

## Entidades involucradas

Payment, Vote.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-07, UC-09, UC-22, UC-23, UC-24, UC-25, UC-26, UC-27, UC-28.
