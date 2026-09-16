# UC-46 — Actualizar la Arena cuando cambia el equipo ganador

**Categoría:** Ranking y temporadas
**Actor(es):** Sistema (backend + cliente)
**Prioridad:** MVP

## Descripción

Cuando el refetch periódico (~10 minutos) detecta que el equipo dominante (o el clásico líder) cambió respecto del estado mostrado, la Arena actualiza colores, marcador y contenido.

## Precondiciones

- El cliente realiza un nuevo refetch de la Arena.

## Flujo principal

1. El cliente consulta el estado actual de la Arena (clásico líder, equipo dominante, marcador).
2. Si el resultado difiere del estado previamente mostrado, actualiza la interfaz: colores, marcador, indicador de equipo dominante, y demás elementos dinámicos.

## Flujos alternativos / excepciones

- El cambio no es instantáneo voto a voto: se aplica recién en el próximo refetch del cliente, no en tiempo real.

## Reglas de negocio relacionadas

- "Inmediato" se refiere a la percepción del usuario en el próximo refetch (~10 minutos), no a un push en tiempo real vía websockets.

## Criterios de aceptación

- Dado que el equipo dominante cambia entre dos refetches, cuando el cliente hace el siguiente polling, entonces la Arena refleja el nuevo estado (colores, marcador, indicador).

## Entidades involucradas

Arena, Team, Classic/Rivalry.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-05, UC-44, UC-45.
