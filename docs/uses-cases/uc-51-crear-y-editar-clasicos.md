# UC-51 — Crear y editar clásicos

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

Alta y edición de un clásico (`Classic`/`Rivalry`): equipo A, equipo B, nombre del clásico, configuración y estado.

## Precondiciones

- Existen al menos dos equipos creados (UC-50).

## Flujo principal

1. El administrador accede a la sección de clásicos del panel.
2. Crea un nuevo `Classic` seleccionando equipo A y equipo B, definiendo nombre y configuración.
3. Guarda los cambios; el clásico se carga directamente en la base de datos vía este panel — no existe un flujo de autoservicio para que terceros den de alta un clásico.

## Flujos alternativos / excepciones

- Si el clásico se crea mientras una temporada ya está en curso, no está definido si entra a esa temporada o recién a la siguiente (ver UC-41).

## Reglas de negocio relacionadas

- El ranking y la rotación se realizan sobre clásicos completos, no equipos individuales.
- En cada temporada compiten todos los clásicos disponibles en el sistema.

## Criterios de aceptación

- Dado que el administrador crea un clásico con dos equipos existentes, cuando lo guarda, entonces queda disponible para participar en el sistema.

## Entidades involucradas

Classic/Rivalry, Team.

## Preguntas abiertas

- Si un clásico nuevo entra a la temporada en curso o a la siguiente (ver UC-41).

## Casos de uso relacionados

UC-50, UC-41.
