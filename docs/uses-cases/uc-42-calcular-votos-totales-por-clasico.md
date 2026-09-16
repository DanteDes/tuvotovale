# UC-42 — Calcular votos totales por clásico

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Cálculo del `classic_score`: la suma de votos válidos de ambos equipos de un clásico, dentro de la temporada activa.

## Precondiciones

- Existe al menos un clásico con votos (o sin ellos, ver flujos alternativos) en la temporada activa.

## Flujo principal

1. El sistema suma los votos en estado `valid` del equipo A y del equipo B de un clásico, dentro de la temporada activa.
2. El resultado es el `classic_score` de ese clásico.

## Flujos alternativos / excepciones

- Un clásico sin votos tiene `classic_score` = 0, y de todas formas aparece en el ranking.
- Votos `pending` o `invalidated` no se incluyen en el cálculo.

## Reglas de negocio relacionadas

- El ranking usa únicamente votos en estado `valid`.

## Criterios de aceptación

- Dado un clásico con votos `valid`, `pending` e `invalidated` mezclados, cuando se calcula su score, entonces solo se cuentan los `valid`.

## Entidades involucradas

Vote, Classic/Rivalry.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-28, UC-43.
