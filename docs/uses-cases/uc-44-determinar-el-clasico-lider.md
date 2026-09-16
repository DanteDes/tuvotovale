# UC-44 — Determinar el clásico líder

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Identifica cuál es el clásico en la posición 1 del ranking ordenado; ese clásico es el que se muestra en la Arena principal.

## Precondiciones

- Los clásicos de la temporada ya están ordenados (UC-43).

## Flujo principal

1. El sistema toma el primer clásico del ranking ordenado como clásico líder.
2. Ese clásico pasa a representar la Arena principal (UC-01).

## Flujos alternativos / excepciones

- Empate en el primer puesto: comportamiento no definido (ver preguntas abiertas en UC-43).

## Reglas de negocio relacionadas

- El clásico líder es el de mayor `classic_score` (votos totales válidos).

## Criterios de aceptación

- Dado el ranking ordenado, cuando se determina el líder, entonces es el clásico de mayor `classic_score`.

## Entidades involucradas

Classic/Rivalry, Season, Arena.

## Preguntas abiertas

- Comportamiento en caso de empate en el primer puesto.

## Casos de uso relacionados

UC-43, UC-01, UC-45.
