# UC-02 — Ver los dos equipos del clásico

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

Dentro de la Arena, el visitante ve claramente los dos equipos enfrentados: nombre y un cuadrado de color representativo, sin escudo oficial.

## Precondiciones

- La Arena ya cargó el clásico líder (UC-01).

## Flujo principal

1. El sistema obtiene los dos equipos (`Team`) del clásico líder.
2. Para cada equipo, renderiza: nombre, y un cuadrado que muestra 2 de sus 3 colores propios (primario, secundario, terciario), usando la tipografía del sistema.

## Flujos alternativos / excepciones

- Ninguno relevante más allá de datos faltantes de configuración (fuera del alcance de este caso de uso; ver UC-50).

## Reglas de negocio relacionadas

- No se usan escudos ni logos oficiales de los clubes (riesgo de marca). La representación visual siempre es un cuadrado de color.

## Criterios de aceptación

- Dado un clásico activo, cuando se renderiza la Arena, entonces cada equipo se muestra con su nombre y su cuadrado de color, nunca con un escudo real.

## Entidades involucradas

Team.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-01, UC-05, UC-50.
