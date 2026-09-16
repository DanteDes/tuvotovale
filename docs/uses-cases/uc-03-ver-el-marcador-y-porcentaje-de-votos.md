# UC-03 — Ver el marcador y porcentaje de votos

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

El visitante ve el conteo de votos válidos de cada equipo del clásico líder y el porcentaje de dominio de cada uno, redondeado.

## Precondiciones

- La Arena ya cargó el clásico líder (UC-01).

## Flujo principal

1. El sistema obtiene el conteo de votos `valid` de cada equipo del clásico líder.
2. Calcula el porcentaje de dominio de cada equipo como votos válidos del equipo dividido por el total de votos válidos del clásico.
3. Redondea el porcentaje para mostrarlo (decisión de producto: se muestra redondeado, no exacto).

## Flujos alternativos / excepciones

- Si el clásico tiene 0 votos totales (0 a 0), no hay una división válida; el sistema debe mostrar 0%-0% en vez de un error o un valor indefinido.

## Reglas de negocio relacionadas

- El porcentaje de dominio se muestra redondeado (no con decimales).
- Solo cuentan los votos en estado `valid`.

## Criterios de aceptación

- Dado un clásico con votos, cuando se calcula el dominio, entonces se muestra el porcentaje redondeado de cada equipo.
- Dado un clásico sin votos (0 a 0), cuando se calcula el dominio, entonces se muestra 0%-0% sin error.

## Entidades involucradas

Vote, Team, Classic/Rivalry.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-01, UC-04.
