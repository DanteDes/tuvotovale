# UC-53 — Configurar límite de votos

**Categoría:** Administración
**Actor(es):** Administrador
**Prioridad:** MVP

## Descripción

El límite de votos (5 votos cada 24 horas, por clásico) es configurable sin necesidad de cambios de código.

## Precondiciones

- El administrador tiene acceso al panel administrativo.

## Flujo principal

1. El administrador accede a la configuración de límites.
2. Ajusta el valor máximo de votos (X) y/o la ventana de tiempo (Y) si corresponde.
3. Guarda los cambios.

## Flujos alternativos / excepciones

- Ninguno adicional; cambios en estos valores aplican a las próximas verificaciones, no retroactivamente.

## Reglas de negocio relacionadas

- El límite se evalúa tanto en la capa previa al pago (identidad local + IP) como en la posterior (identidad local + `payer_id`), usando los mismos valores configurados.

## Criterios de aceptación

- Dado que el administrador cambia el valor de X o Y, cuando guarda, entonces las próximas verificaciones de límite usan los nuevos valores.

## Entidades involucradas

Configuración global (sin entidad de dominio propia definida en el handoff).

## Preguntas abiertas

Ninguna.

## Casos de uso relacionados

UC-07, UC-27.
