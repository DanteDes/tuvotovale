# UC-07 — Iniciar un pago

**Categoría:** Visitante
**Actor(es):** Visitante (guest)
**Prioridad:** MVP

## Descripción

Al hacer click en "Votar", se ejecuta una función del lado del servidor (server action / endpoint) que valida los límites de votos y, si corresponde, genera el checkout de Mercado Pago.

## Precondiciones

- El visitante ya eligió un equipo (UC-06).

## Flujo principal

1. El cliente llama a la función del servidor que crea la orden, con el equipo y clásico elegidos.
2. El backend calcula el monto: convierte el equivalente a 1 USD a moneda local, al tipo de cambio oficial vigente en ese momento.
3. El backend verifica, en secuencia, el límite de votos (5 votos / 24 horas, por clásico) tanto por identidad local (cookie/localStorage) como por dirección IP de la request.
4. Si ambas verificaciones pasan, crea la orden (`Payment` en `pending`) y genera la preferencia de checkout de Mercado Pago, configurada para excluir efectivo (`ticket`) y tarjeta de crédito (`credit_card`).
5. El sistema redirige o abre el checkout de Mercado Pago con el monto final ya calculado, sin impuestos ni cargos adicionales visibles.

## Flujos alternativos / excepciones

- Si la identidad local o la IP ya alcanzaron el límite para ese clásico, la función corta ahí: no se genera ningún checkout y se muestra un aviso de límite alcanzado.

## Reglas de negocio relacionadas

- El monto se calcula al momento del click en "Votar", no antes ni después.
- Medios de pago habilitados: solo dinero en cuenta y débito.
- El límite se evalúa antes de generar el checkout, para minimizar los casos que terminan necesitando un reembolso.

## Criterios de aceptación

- Dado que el visitante no superó el límite, cuando hace click en "Votar", entonces se genera un checkout de Mercado Pago por el monto correcto en moneda local, ofreciendo solo dinero en cuenta y débito.
- Dado que el visitante ya alcanzó el límite (por identidad local o por IP), cuando hace click en "Votar", entonces no se genera ningún checkout y se le informa que alcanzó el límite.

## Entidades involucradas

Payment, Voter Identity, Classic/Rivalry.

## Preguntas abiertas

- Mensaje exacto que ve el usuario al alcanzar el límite.

## Casos de uso relacionados

UC-06, UC-08, UC-20, UC-21, UC-27.
