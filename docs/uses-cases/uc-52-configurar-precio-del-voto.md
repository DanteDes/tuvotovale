# UC-52 — Configurar precio del voto

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Aunque el precio conceptual es fijo (equivalente a 1 USD por voto), este caso de uso cubre la configuración de los parámetros que determinan el cobro real: el valor de referencia en USD, y la fuente del tipo de cambio oficial utilizado para la conversión.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede a la configuración de precio.
2. Puede ver el valor de referencia actual (1 USD) y la fuente/tipo de cambio oficial configurado para la conversión a moneda local.
3. Si corresponde, ajusta estos parámetros.

## Flujos alternativos / excepciones

- Ninguno adicional; este es un panel de configuración simple, no transaccional.

## Reglas de negocio relacionadas

- El monto se calcula al momento del click en "Votar", usando el tipo de cambio oficial vigente.
- El precio final que ve el usuario no incluye impuestos ni cargos adicionales visibles.

## Criterios de aceptación

- Dado que el administrador consulta la configuración de precio, cuando la revisa, entonces ve el valor de referencia (1 USD) y puede ver/ajustar la fuente del tipo de cambio utilizado.

## Entidades involucradas

Configuración global (sin entidad de dominio propia definida en el handoff).

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-07, UC-20.
