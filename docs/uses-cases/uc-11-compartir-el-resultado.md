# UC-11 — Compartir el resultado

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP condicional (incluido solo si el esfuerzo de implementación es bajo; ver sección "Incluido en el MVP" del handoff)

## Descripción

El usuario puede compartir una tarjeta o resumen del resultado actual del clásico (por ejemplo, "Boca domina la Arena con el 58%") en redes sociales u otros canales.

## Precondiciones

- Existe un clásico activo con estado de votos calculado (UC-03, UC-04).

## Flujo principal

1. El usuario hace click en la opción de "Compartir".
2. El sistema genera una tarjeta o enlace con el resultado actual del clásico (equipo dominante, porcentaje).
3. Se abre el flujo nativo de compartir del navegador/dispositivo, o se ofrece un link copiable.

## Flujos alternativos / excepciones

- Si el esfuerzo de implementación resulta alto, este caso de uso queda fuera del MVP inicial y se pospone para una iteración posterior.

## Reglas de negocio relacionadas

- No se debe mostrar información personal ni datos identificables del votante en el contenido compartido.

## Criterios de aceptación

- Dado que el usuario hace click en compartir, cuando se genera el contenido, entonces refleja el estado actual real del clásico, sin datos personales del votante.

## Entidades involucradas

Classic/Rivalry, Team, Vote.

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-03, UC-04, UC-15 (funcionalidades futuras de viralidad, fuera de este documento).
