# UC-55 — Ver pagos

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Listado y detalle de pagos (`Payment`) registrados en el sistema: estado, importe, moneda, referencia, timestamps.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede a la sección de pagos.
2. Puede buscar/filtrar pagos y ver su detalle: estado actual, importe, moneda, referencia externa, y su historial de cambios de estado.

## Flujos alternativos / excepciones

- Ninguno adicional; es una vista de consulta.

## Reglas de negocio relacionadas

- No se almacenan datos de tarjeta ni documentos de identidad del pagador; solo los datos permitidos (ver `payer_id` como señal técnica, sección 5.2 del handoff).

## Criterios de aceptación

- Dado que el administrador busca un pago, cuando lo encuentra, entonces puede ver su estado actual y su historial de cambios de estado.

## Entidades involucradas

Payment.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-56, UC-57.
