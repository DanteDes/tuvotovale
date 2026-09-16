# UC-54 — Crear y administrar temporadas

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Gestión de temporadas: creación (ver UC-40), y visibilidad de su estado (activa/cerrada) y fechas.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede al panel de temporadas.
2. Puede ver la temporada activa, su fecha de inicio y cierre, y el historial de temporadas cerradas.
3. Puede crear una nueva temporada si corresponde (ver preguntas abiertas de UC-40 y UC-47 sobre automatización).

## Flujos alternativos / excepciones

- Si el proceso de cierre/apertura de temporadas termina siendo automático, este panel sería principalmente de solo lectura/monitoreo.

## Reglas de negocio relacionadas

- Cada temporada dura 30 días corridos.

## Criterios de aceptación

- Dado que el administrador accede al panel de temporadas, cuando lo hace, entonces puede ver la temporada activa, su fecha de cierre, y el historial de temporadas cerradas.

## Entidades involucradas

Season.

## Preguntas abiertas

- Si la creación/cierre de temporadas es automático o manual (ver UC-40, UC-47).

## Casos de uso relacionados

UC-40, UC-47.
