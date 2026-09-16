# UC-05 — Ver los colores dinámicos del equipo ganador

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

La Arena adopta la paleta de colores del equipo dominante (2 de sus 3 colores propios) en fondo, gradientes y acentos visuales, de forma que el usuario perciba el resultado sin tener que leer el marcador.

## Precondiciones

- Se determinó el equipo dominante del clásico líder (UC-04).

## Flujo principal

1. El sistema obtiene los colores (primario, secundario, terciario) del equipo dominante.
2. Aplica 2 de esos colores a la paleta visual de la Arena (fondo, gradientes, iluminación, animaciones si corresponde).

## Flujos alternativos / excepciones

- El cambio de colores no ocurre en el instante exacto en que cambia el resultado; se aplica recién en el próximo refetch de la Arena (~10 minutos).

## Reglas de negocio relacionadas

- "Inmediato" se refiere a la percepción del usuario en el próximo refetch, no a un push en tiempo real.

## Criterios de aceptación

- Dado un cambio de equipo dominante entre dos refetches, cuando el cliente hace el siguiente polling, entonces la paleta de la Arena cambia a la del nuevo equipo dominante.

## Entidades involucradas

Team, Arena.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-04, UC-46.
