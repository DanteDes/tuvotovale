# UC-06 — Elegir un equipo para votar

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

El visitante selecciona uno de los dos equipos del clásico activo antes de iniciar el pago.

## Precondiciones

- La Arena está cargada con el clásico activo (UC-01, UC-02).

## Flujo principal

1. El visitante hace click sobre uno de los dos equipos mostrados en la Arena.
2. El sistema asocia esa selección (team_id) a la acción de "Votar" que se dispara a continuación (UC-07).

## Flujos alternativos / excepciones

- Ninguno relevante; no requiere validación adicional en este paso (las validaciones de límite ocurren al iniciar el pago, UC-07).

## Reglas de negocio relacionadas

- No requiere login ni registro (guest, sin cuenta tradicional).

## Criterios de aceptación

- Dado que el visitante hace click en un equipo, cuando confirma, entonces la intención de voto queda asociada a ese equipo específico antes de continuar al pago.

## Entidades involucradas

Team, Classic/Rivalry.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-01, UC-07.
