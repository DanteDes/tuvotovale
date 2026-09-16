# UC-43 — Ordenar clásicos por votos

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Ordena todos los clásicos de la temporada de mayor a menor `classic_score`, para construir el ranking completo.

## Precondiciones

- Se calcularon los `classic_score` de todos los clásicos de la temporada (UC-42).

## Flujo principal

1. El sistema ordena los clásicos participantes de mayor a menor `classic_score`.
2. El resultado determina: el clásico líder (posición 1), los siguientes 5 (aspirantes, listado corto debajo de la Arena), y el resto (listado completo en la página de "Temporada").

## Flujos alternativos / excepciones

- Dos o más clásicos con exactamente el mismo `classic_score`: el criterio de desempate no está definido.

## Reglas de negocio relacionadas

- La Arena principal muestra en grande solo al clásico líder; debajo, los siguientes 5; el resto en la página de Temporada.

## Criterios de aceptación

- Dado el conjunto de clásicos con sus scores, cuando se ordenan, entonces el resultado determina el clásico líder, los siguientes 5 aspirantes, y el resto del listado completo.

## Entidades involucradas

Classic/Rivalry, Season.

## Preguntas abiertas

- Criterio de desempate cuando dos o más clásicos tienen exactamente el mismo score.

## Casos de uso relacionados

UC-42, UC-44, UC-10.
