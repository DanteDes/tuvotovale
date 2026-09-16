# UC-41 — Asociar clásicos a una temporada

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (automático, ver nota)
**Prioridad:** MVP

## Descripción

Dado que todos los clásicos del sistema participan de cada temporada, este caso de uso es en la práctica automático al crear la temporada (UC-40), no una acción manual separada. Se documenta igual porque el modelo de dominio contempla la relación `Season.participating_classics` de forma explícita, útil si en el futuro se decide curar manualmente qué clásicos entran (fuera de alcance del MVP).

## Precondiciones

- Se está creando o ya existe una temporada activa (UC-40).

## Flujo principal

1. Al crear la temporada, el sistema asocia automáticamente todos los clásicos existentes en ese momento.

## Flujos alternativos / excepciones

- Un clásico nuevo (UC-51) dado de alta mientras una temporada ya está en curso: el comportamiento no está definido en el handoff (¿entra recién en la próxima temporada, o se suma a la actual?).

## Reglas de negocio relacionadas

- No hay curación manual de cuáles clásicos entran a una temporada; son todos.

## Criterios de aceptación

- Dado un clásico existente al momento de crear la temporada, cuando se crea, entonces queda asociado a ella automáticamente.

## Entidades involucradas

Season, Classic/Rivalry.

## Preguntas abiertas

- Qué pasa con un clásico dado de alta a mitad de una temporada en curso.

## Casos de uso relacionados

UC-40, UC-51.
