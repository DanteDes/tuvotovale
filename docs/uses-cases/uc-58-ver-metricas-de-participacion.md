# UC-58 — Ver métricas de participación

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP (alcance de detalle abierto)

## Descripción

Panel con métricas agregadas para evaluar las hipótesis del MVP: cantidad de votos, ingresos, clásicos más votados, recurrencia de identidades, tasa de reembolsos, entre otras.

## Precondiciones

- El administrador tiene acceso al panel administrativo y existen datos de votos/pagos.

## Flujo principal

1. El administrador accede al panel de métricas.
2. Consulta datos agregados que ayuden a responder las hipótesis del MVP (H1 a H7), por ejemplo: volumen de votos por identidad recurrente (H5), tasa de reembolsos por límite excedido (H6), distribución de votos entre clásicos (H7).

## Flujos alternativos / excepciones

- El detalle exacto de qué métricas y visualizaciones mostrar no está especificado más allá de las hipótesis; queda abierto a una definición de detalle (especificación de dashboard).

## Reglas de negocio relacionadas

- Las métricas deben servir para validar las hipótesis H1 a H7 del MVP (sección 12 del PRD / sección 23 del handoff).

## Criterios de aceptación

- Dado que el administrador accede al panel de métricas, cuando lo consulta, entonces puede ver datos que ayuden a responder las hipótesis H1 a H7.

## Entidades involucradas

Vote, Payment, Voter Identity.

## Preguntas abiertas

- Definición de detalle de qué métricas y visualizaciones exactas mostrar.

## Casos de uso relacionados

UC-55, UC-56, UC-57.
