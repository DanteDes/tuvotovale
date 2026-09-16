# UC-45 — Determinar el equipo ganador dentro del clásico líder

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend)
**Prioridad:** MVP

## Descripción

Dentro del clásico líder, identifica cuál de los dos equipos tiene más votos válidos; ese equipo determina la estética de la Arena.

## Precondiciones

- Se determinó el clásico líder (UC-44).

## Flujo principal

1. El sistema compara los votos válidos del equipo A y el equipo B del clásico líder.
2. El equipo con más votos válidos es el "ganador visual" o equipo dominante.

## Flujos alternativos / excepciones

- Empate entre los dos equipos del clásico líder: comportamiento no definido (distinto del empate entre clásicos — ver UC-04).

## Reglas de negocio relacionadas

- El equipo dominante determina los colores, identidad y ambiente de la Arena.

## Criterios de aceptación

- Dado el clásico líder con votos de equipo A y equipo B, cuando se determina el ganador visual, entonces es el equipo con más votos válidos.

## Entidades involucradas

Team, Vote, Classic/Rivalry.

## Preguntas abiertas

- Qué pasa si ambos equipos empatan dentro del clásico líder (ver también UC-04).

## Casos de uso relacionados

UC-04, UC-44, UC-46.
