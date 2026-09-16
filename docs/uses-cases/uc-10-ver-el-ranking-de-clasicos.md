# UC-10 — Ver el ranking de clásicos

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

El visitante puede ver el ranking completo de todos los clásicos de la temporada activa en una página de "Temporada", además del listado corto (siguientes 5) que aparece debajo de la Arena principal.

## Precondiciones

- Existe una temporada activa con clásicos configurados.

## Flujo principal

1. El sistema obtiene todos los clásicos participantes de la temporada activa, con su `classic_score`.
2. Los ordena de mayor a menor.
3. Muestra: el clásico líder en la Arena principal (grande), los siguientes 5 en un listado corto debajo, y el resto accesible en la página de "Temporada" con el listado completo y ordenado.

## Flujos alternativos / excepciones

- Todos los clásicos configurados aparecen en el ranking, incluso los que todavía no tienen votos (0 a 0).

## Reglas de negocio relacionadas

- En cada temporada compiten todos los clásicos disponibles en el sistema.
- El ranking usa únicamente votos en estado `valid`.

## Criterios de aceptación

- Dado que existen N clásicos en la temporada, cuando el usuario visita la página de Temporada, entonces ve los N clásicos ordenados por votos totales válidos, de mayor a menor.

## Entidades involucradas

Season, Classic/Rivalry, Vote.

## Preguntas abiertas

- Criterio de desempate cuando dos o más clásicos tienen el mismo total de votos.

## Casos de uso relacionados

UC-01, UC-42, UC-43, UC-44.
