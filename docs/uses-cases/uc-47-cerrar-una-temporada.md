# UC-47 — Cerrar una temporada

**Categoría:** Ranking y temporadas
**Actor(es):** Administrador / proceso automático
**Prioridad:** MVP

## Descripción

Al cumplirse los 30 días, la temporada pasa a estado `closed`; se calcula el resultado final (clásico ganador de la temporada) y se conserva para historial.

## Precondiciones

- Una temporada activa llegó a su `end_date`.

## Flujo principal

1. El sistema (o el administrador) cambia el estado de la `Season` a `closed`.
2. Se registra el resultado final: el ranking congelado al momento del cierre.
3. Según la decisión de conservar histórico, los votos de esa temporada quedan asociados a ella y no se eliminan.
4. El conteo visual se reinicia para la siguiente temporada (los votos históricos no afectan el nuevo conteo).

## Flujos alternativos / excepciones

- No está definido si el cierre es un job automático programado o requiere una acción manual del administrador.
- No está definido si la apertura de la siguiente temporada es automática al cerrarse la anterior.

## Reglas de negocio relacionadas

- Visualmente, los votos se reinician por temporada, pero no se eliminan: quedan asociados a su temporada de origen.

## Criterios de aceptación

- Dado que una temporada llega a su `end_date`, cuando se cierra, entonces su ranking final queda registrado y los votos históricos se conservan asociados a ella, sin afectar el conteo de la nueva temporada.

## Entidades involucradas

Season, Vote, Classic/Rivalry.

## Preguntas abiertas

- Si el cierre es automático (job programado) o manual.
- Si la apertura de la siguiente temporada es automática al cerrar la anterior.

## Casos de uso relacionados

UC-40, UC-48, UC-54.
