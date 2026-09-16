# UC-57 — Revisar pagos/votos invalidados

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Vista específica para auditoría de pagos revertidos o reembolsados (incluyendo los reembolsados por exceder el límite de votos) y sus votos invalidados asociados, con motivo registrado.

## Precondiciones

- Existen votos en estado `invalidated` o pagos en estados no aprobados.

## Flujo principal

1. El administrador accede a la vista de pagos/votos invalidados.
2. Ve cada caso con su motivo (por ejemplo, "pago revertido", "límite de votos excedido") y el pago asociado.

## Flujos alternativos / excepciones

- Ninguno adicional; es una vista de auditoría.

## Reglas de negocio relacionadas

- Los estados que invalidan un voto son: `rejected`, `cancelled`, `refunded`, `charged_back`.
- Un pago aprobado que excede el límite de votos se reembolsa completo y su voto nunca llega a `valid`.

## Criterios de aceptación

- Dado un voto invalidado, cuando el administrador lo consulta, entonces ve el motivo registrado y el pago asociado.

## Entidades involucradas

Vote, Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-27, UC-30, UC-55, UC-56.
