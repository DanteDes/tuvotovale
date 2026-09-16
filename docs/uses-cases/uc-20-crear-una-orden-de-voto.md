# UC-20 — Crear una orden de voto

**Categoría:** Sistema de pagos
**Actor(es):** Sistema (backend), disparado por el visitante
**Prioridad:** MVP

## Descripción

El backend crea el registro de orden/pago cuando el usuario confirma la intención de votar, antes de redirigir a Mercado Pago.

## Precondiciones

- El visitante eligió equipo y no superó el límite de votos en la verificación previa (UC-06, UC-07).

## Flujo principal

1. El backend recibe el team_id y classic_id/arena_id elegidos.
2. Calcula el monto en moneda local, al tipo de cambio oficial vigente.
3. Corre las validaciones de límite (identidad local + IP) antes de continuar.
4. Crea el registro `Payment` en estado `pending`, con una `external_reference` única.
5. Devuelve los datos necesarios para iniciar el checkout de Mercado Pago.

## Flujos alternativos / excepciones

- Si las validaciones de límite fallan, no se crea la orden (ver UC-07).

## Reglas de negocio relacionadas

- El monto se fija en el momento de crear la orden y no debe variar después.
- La orden debe tener una referencia externa única para poder correlacionarla luego con la notificación de Mercado Pago.

## Criterios de aceptación

- Dado un click en "Votar" válido (sin exceder límites), cuando se crea la orden, entonces existe un registro `Payment` en `pending` con el monto correcto y una referencia externa única.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-07, UC-21.
