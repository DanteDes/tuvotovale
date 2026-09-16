# UC-04 — Ver qué equipo está dominando

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

Se indica visual y textualmente cuál de los dos equipos del clásico líder tiene más votos válidos (el "ganador visual").

## Precondiciones

- La Arena ya cargó el clásico líder (UC-01), con su conteo de votos (UC-03).

## Flujo principal

1. El sistema compara los votos válidos de ambos equipos del clásico líder.
2. Marca como dominante al equipo con más votos válidos (colores de la Arena, indicador textual, ver UC-05).

## Flujos alternativos / excepciones

- Si ambos equipos tienen exactamente los mismos votos válidos (empate interno del clásico), el comportamiento no está definido en el handoff. Este caso es distinto del empate entre clásicos (que decide el ranking); acá el empate es entre los dos equipos de un mismo clásico y afecta directamente la estética de la Arena.

## Reglas de negocio relacionadas

- El equipo dominante determina los colores, identidad y ambiente de la Arena.

## Criterios de aceptación

- Dado que un equipo tiene más votos válidos que el otro dentro del clásico líder, cuando se renderiza la Arena, entonces ese equipo se marca como dominante.

## Entidades involucradas

Vote, Team, Classic/Rivalry, Arena.

## Preguntas abiertas

- Qué pasa si ambos equipos del clásico líder empatan en votos entre sí (no resuelto en el handoff; distinto del empate entre clásicos).

## Casos de uso relacionados

UC-03, UC-05, UC-45.
