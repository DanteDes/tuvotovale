# UC-01 — Ver la Arena actual

**Categoría:** Visitante
**Actor(es):** Visitante (guest, sin login)
**Prioridad:** MVP

## Descripción

El visitante entra a la landing pública y ve el clásico líder actual de la temporada en curso, representado como la Arena: un "estadio digital vivo", no una encuesta tradicional.

## Precondiciones

- Existe una temporada activa con al menos un clásico configurado.

## Flujo principal

1. El visitante navega a la URL principal.
2. El sistema obtiene el clásico líder de la temporada activa (mayor `classic_score`, es decir, mayor total de votos válidos).
3. El sistema renderiza la Arena con los datos del clásico líder: equipos, marcador, colores dinámicos del equipo dominante, porcentaje de dominio redondeado, listado de los siguientes 5 clásicos, e indicador de días restantes de la temporada.
4. El cliente hace polling cada ~10 minutos para refrescar los datos de la Arena (ver UC-46).

## Flujos alternativos / excepciones

- Si ningún clásico tiene votos todavía (todos 0 a 0), se muestra igual un clásico líder (el criterio de desempate en ese caso no está definido — ver preguntas abiertas) con marcador 0-0 y sin equipo dominante marcado.
- Si no hay ninguna temporada activa, se debe mostrar un estado vacío o mensaje equivalente (el diseño de este caso no está resuelto en el handoff).

## Reglas de negocio relacionadas

- El clásico líder es el de mayor `classic_score` (suma de votos `valid` de ambos equipos) en la temporada activa.
- La actualización de la Arena es por polling (~10 minutos), no push en tiempo real.
- Todos los clásicos configurados aparecen en el ranking, incluso sin votos (0 a 0).

## Criterios de aceptación

- Dado que existe una temporada activa con clásicos, cuando el visitante carga la Arena, entonces ve el clásico con más votos totales válidos como protagonista.
- Dado que pasan ~10 minutos desde la carga, cuando el cliente hace el refetch, entonces la Arena refleja cualquier cambio de líder ocurrido en ese lapso.

## Entidades involucradas

Season, Classic/Rivalry, Arena, Team, Vote.

## Preguntas abiertas

- Criterio de desempate cuando dos clásicos empatan en votos totales.

## Casos de uso relacionados

UC-02, UC-03, UC-04, UC-05, UC-10, UC-44, UC-46.
