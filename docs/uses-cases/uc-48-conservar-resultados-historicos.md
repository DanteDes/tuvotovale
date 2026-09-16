# UC-48 — Conservar resultados históricos

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend)
**Prioridad:** MVP (almacenamiento) — la visualización avanzada de histórico queda fuera del MVP

## Descripción

Los votos y rankings de temporadas cerradas se mantienen accesibles para funcionalidad futura (historial de campeones, récords, comparaciones entre temporadas), aunque esa funcionalidad de visualización queda fuera del MVP.

## Precondiciones

- Una temporada se cerró (UC-47).

## Flujo principal

1. Los datos de la temporada cerrada (votos, ranking final) permanecen en la base de datos, asociados a esa temporada.
2. No existe todavía una interfaz de usuario dedicada para consultar ese histórico en el MVP.

## Flujos alternativos / excepciones

- Ninguno; este caso de uso es principalmente de almacenamiento/retención, no de presentación.

## Reglas de negocio relacionadas

- El ranking histórico avanzado y los snapshots de ranking están explícitamente fuera del MVP.

## Criterios de aceptación

- Dado que una temporada se cierra, cuando pasa el tiempo, entonces sus datos siguen existiendo en la base (no se borran), aunque el MVP no exponga una UI dedicada para consultarlos.

## Entidades involucradas

Season, Vote, Classic/Rivalry.

## Preguntas abiertas

- Si se mostrarán votos totales históricos en alguna vista del MVP (pendiente de definir).

## Casos de uso relacionados

UC-47.
