# PRD — TuVotoVale

**Tipo de documento:** Product Requirements Document (PRD)
**Versión:** 1.0
**Fecha:** 16 de septiembre de 2026
**Estado:** MVP en definición

---

## 1. Resumen ejecutivo

**TuVotoVale** es una plataforma de participación futbolera donde los hinchas votan por su equipo mediante un pago real. Los votos se acumulan y determinan qué equipo domina visualmente una experiencia de rivalidad llamada **Arena**.

La plataforma gira en torno a **clásicos de fútbol** (ej. Boca vs. River) y busca transformar la rivalidad entre hinchas en una experiencia digital, visual y competitiva. El incentivo para votar no es un premio económico ni material: es **hacer que el propio equipo gane, cambie la estética de la página y supere al rival**.

> **Propuesta de valor:** TuVotoVale es el estadio digital donde los hinchas hacen que su equipo gane territorio. Cada voto tiene un impacto visible en la Arena.

---

## 2. Problema y oportunidad

Los hinchas de fútbol no tienen hoy una forma paga, inmediata y visualmente gratificante de "respaldar" a su equipo en una rivalidad, más allá de las apuestas deportivas (reguladas de otra forma) o las encuestas sin fricción económica real. TuVotoVale propone una mecánica de "voto pago" donde el dinero determina un resultado visual — no un premio — apostando a que la rivalidad futbolera y el efecto visible inmediato sean incentivo suficiente para que la gente participe y vuelva a participar.

El MVP existe para validar una hipótesis muy concreta antes de invertir en funcionalidades adicionales:

> **¿Los hinchas están dispuestos a pagar para influir en qué equipo domina visualmente una Arena de fútbol?**

---

## 3. Objetivos del MVP

El MVP debe validar las siguientes hipótesis (detalle completo en la sección 12):

| Hipótesis | Qué se quiere descubrir |
|---|---|
| H1 — Disposición a pagar | ¿Los hinchas pagan el equivalente a 1 USD por un voto? |
| H2 — Competencia | ¿La rivalidad entre equipos genera suficientes ganas de votar? |
| H3 — Recompensa visual | ¿Cambiar los colores de la página es una recompensa suficientemente atractiva? |
| H4 — Viralidad | ¿Los usuarios comparten el resultado y atraen rivales? |
| H5 — Recurrencia | ¿Los usuarios vuelven para defender o recuperar el liderazgo? |
| H6 — Anti-abuso económico | ¿El costo por voto reduce suficientemente la manipulación? |
| H7 — Rotación | ¿El ranking de clásicos genera interés más allá de un único enfrentamiento? |

**No objetivos del MVP:** cuentas de usuario tradicionales, contenido editorial extenso, ranking histórico avanzado, sistemas de logros o ligas complejos, app móvil nativa, machine learning anti-fraude (ver sección 7, "Fuera de alcance").

---

## 4. Usuarios y roles

### Visitante / Hincha (guest)

Usuario final público, sin necesidad de crear cuenta. Entra a la Arena, elige un equipo, paga con Mercado Pago y su pago se traduce en un voto. No hay login, contraseña, perfil público ni verificación de email/teléfono en el MVP.

### Administrador

Rol interno del equipo de producto. Gestiona equipos, clásicos, temporadas, parámetros de precio y límite de votos, y audita pagos/votos (incluyendo los invalidados). Opera vía un panel administrativo mínimo, sin flujo de autoservicio para terceros.

---

## 5. Alcance funcional (MVP)

| Área | Casos de uso | Resumen |
|---|---|---|
| Visitante / Arena pública | UC-01 a UC-12 | Ver la Arena, elegir equipo, pagar, ver resultado, ver ranking, compartir |
| Sistema de pagos | UC-20 a UC-30 | Crear orden, procesar webhook de Mercado Pago, emitir o invalidar votos con idempotencia |
| Ranking y temporadas | UC-40 a UC-48 | Calcular ranking, determinar clásico líder y equipo dominante, cerrar temporadas |
| Administración | UC-50 a UC-58 | CRUD de equipos/clásicos, configuración de precio y límites, auditoría |

El detalle de cada caso de uso —actores, flujos, reglas de negocio y criterios de aceptación— está en `uses-cases/`.

### Incluido en el MVP (checklist funcional)

- Landing pública de una Arena, con dos equipos enfrentados.
- Marcador de votos y porcentaje de dominio (redondeado).
- Precio del voto equivalente a 1 USD, cobrado en moneda local.
- Checkout de Mercado Pago (solo dinero en cuenta y débito).
- Un pago aprobado = un voto; webhook y validación backend; idempotencia.
- Límite configurable de votos (identidad + IP).
- Identidad técnica de votante (sin cuenta tradicional).
- Cambio visual del equipo ganador (por polling, no en tiempo real).
- Configuración de equipos y clásicos (admin).
- Ranking básico de clásicos y temporada actual (30 días).
- Panel administrativo mínimo; registro de pagos y votos.
- Invalidación de votos por pagos revertidos.
- Compartir resultado, si el esfuerzo de implementación es bajo.

---

## 6. Fuera de alcance (MVP)

- Perfiles de usuario, chat, comentarios.
- Noticias completas / portal editorial.
- App móvil nativa.
- Sistema de logros complejo.
- Ranking histórico avanzado y snapshots de ranking.
- IA para contenido.
- Notificaciones push.
- Sistema de referidos con premios.
- Múltiples tipos de votos.
- Machine learning anti-fraude.
- Sistema de ligas complejo.
- Ranking de equipos (solo hay ranking de clásicos).
- Pago en efectivo (Rapipago/Pago Fácil) y tarjeta de crédito.

---

## 7. Reglas de negocio clave

| Tema | Decisión |
|---|---|
| Precio | Equivalente a 1 USD por voto |
| Moneda de cobro | Siempre moneda local vía Mercado Pago; conversión al tipo de cambio oficial, calculada al momento del click en "Votar" |
| Medios de pago habilitados | Solo dinero en cuenta y débito; se excluyen efectivo y tarjeta de crédito |
| Relación pago/voto | Un pago aprobado equivale a exactamente un voto |
| Usuarios | Guest, sin cuenta tradicional |
| Anti-abuso (límite) | Máximo 5 votos cada 24 horas (ventana móvil), por clásico, evaluado por identidad local (cookie) e IP antes del pago, y por identidad + `payer_id` después del pago |
| Pago aprobado que excede el límite | Se reembolsa completo vía API de Mercado Pago; no se acredita el voto |
| Reembolsos parciales | No se contemplan; siempre son totales |
| Estados que invalidan un voto | `rejected`, `cancelled`, `refunded`, `charged_back` |
| Pagos pendientes | No computan voto hasta que el pago está `approved` |
| Unidad de competencia | El clásico, no el equipo individual |
| Ganador de temporada | Clásico con mayor cantidad de votos totales válidos |
| Ganador visual | Equipo con más votos dentro del clásico líder |
| Cambio de ganador visual | Se aplica en el siguiente refetch de la Arena (~10 minutos), no instantáneo por voto |
| Duración de temporada | 30 días corridos |
| Clásicos por temporada | Todos los disponibles en el sistema |
| Ranking: fuente de votos | Solo votos en estado `valid` |
| Snapshots de ranking / ranking de equipos | No habrá en el MVP |
| Representación visual de equipos | Cuadrado de color (2 de 3 colores propios), sin escudo oficial |
| Música | Sí; "canción de cancha" por equipo, contenido propio |
| Recompensa | Exclusivamente visual y competitiva, sin premio material |
| Soporte y reembolsos | Canal: email declarado en los Términos de Servicio |
| Datos de Mercado Pago almacenados | `payer_id` solo como señal técnica de rate-limiting; no se almacenan datos de tarjeta ni documentos de identidad |

Detalle completo y razonamiento de cada decisión en `tuvotovale-product-handoff.md`, secciones 4 a 17 y 20.

---

## 8. Modelo de dominio (resumen)

- **Team** — equipo de fútbol: nombre, slug, colores (primario/secundario/terciario), país, contenido. Sin escudo/logo oficial.
- **Classic / Rivalry** — par de equipos que compiten de forma permanente (ej. Boca–River).
- **Season** — período de competencia de 30 días: fechas, estado, clásicos participantes, ranking.
- **Arena** — instancia de un clásico dentro de una temporada: equipos, configuración visual, equipo dominante actual.
- **Payment** — transacción de Mercado Pago: proveedor, referencia externa, importe, moneda, estado, timestamps.
- **Vote** — unidad de participación: equipo, arena, pago, identidad del votante, estado (`pending` / `valid` / `invalidated`).
- **Voter Identity** — identidad técnica sin cuenta: cookie/localStorage, IP, `payer_id` cuando esté disponible.
- **Ranking Snapshot** — concepto reservado para funcionalidad futura de histórico; no se usa en el MVP.

Relación conceptual: un `Classic` es permanente; cada `Season` lo hace competir de nuevo (`Arena`); los `Vote` son las participaciones emitidas dentro de esa instancia.

---

## 9. Flujos clave

### 9.1. Flujo de voto de punta a punta (happy path)

1. El visitante ve la Arena con el clásico líder actual (UC-01 a UC-05).
2. Elige un equipo (UC-06).
3. Al hacer click en "Votar", una función del servidor valida el límite de votos (identidad local + IP) para ese clásico; si pasa, calcula el monto en moneda local y crea la orden (UC-07, UC-20, UC-21).
4. Se genera el checkout de Mercado Pago, mostrando solo dinero en cuenta y débito.
5. El usuario paga; Mercado Pago notifica al backend (UC-22).
6. El backend valida la autenticidad de la notificación, consulta el pago, valida importe/moneda, valida que no esté duplicado, y vuelve a validar el límite —ahora por identidad y `payer_id`— (UC-23 a UC-27).
7. Si todo es válido, se emite el voto (`valid`) y se actualizan los contadores del clásico (UC-28).
8. El usuario vuelve del checkout y, cuando el backend confirma el voto, ve el resultado (UC-08, UC-09).
9. En el próximo refetch de la Arena (~10 minutos), se refleja cualquier cambio de líder o de equipo dominante (UC-46).

### 9.2. Flujo cuando se excede el límite de votos

- **Antes de pagar:** si la identidad local o la IP ya alcanzaron el límite, no se genera el checkout (UC-07). El usuario ve un aviso (mensaje exacto: pendiente de definir).
- **Después de pagar:** si, por una carrera entre varias órdenes en paralelo, un pago se aprueba habiendo ya superado el límite, el voto no se acredita y el pago se reembolsa completo (UC-27, UC-30).

### 9.3. Flujo de reversión de pago

Un pago que ya generó un voto `valid` puede pasar luego a `rejected`, `cancelled`, `refunded` o `charged_back`. En ese caso el voto se invalida (nunca se borra), se registra el motivo, y se descuenta del conteo del clásico (UC-30).

### 9.4. Flujo de cierre de temporada

Al cumplirse los 30 días, la temporada se cierra, su ranking final queda registrado, y los votos históricos se conservan asociados a ella sin afectar el conteo de la nueva temporada (UC-47, UC-48).

---

## 10. Requisitos no funcionales

- **Confiabilidad de pagos:** el frontend nunca es la fuente de verdad de que un voto existe; toda acreditación depende del webhook de Mercado Pago y su validación en el backend.
- **Idempotencia:** ningún pago puede generar más de un voto válido, incluso ante reintentos o reenvíos de notificaciones de Mercado Pago.
- **Cumplimiento de datos de pago:** no se almacenan datos de tarjeta, códigos de seguridad ni números de documento de identidad; `payer_id` se guarda únicamente como señal técnica de rate-limiting.
- **Localización:** los montos se calculan siempre en moneda local, al tipo de cambio oficial vigente en el momento del click en "Votar"; el usuario nunca ve una conversión de USD manual.
- **Actualización de la Arena:** mediante polling del cliente (~10 minutos), no en tiempo real vía websockets.
- **Trazabilidad:** los votos nunca se eliminan físicamente; se invalidan con motivo registrado, para poder auditar y explicar los resultados históricos.
- **Configurabilidad:** el precio de referencia y el límite de votos (X/Y) deben poder ajustarse sin cambios de código, desde el panel de administración.

---

## 11. Métricas de éxito

Las métricas primarias del MVP están atadas a las hipótesis de la sección 3 (H1–H7). Métricas operativas de apoyo:

- Tasa de reembolsos por límite excedido (debería ser baja — ligada a H6 y a la efectividad de la capa previa al pago).
- Votos por identidad recurrente en distintas ventanas de 24 horas (ligada a H5, recurrencia).
- % de sesiones que usan la función de compartir resultado (ligada a H4, viralidad).
- Distribución de votos entre clásicos (ligada a H7, si el ranking genera interés más allá de un único clásico).

El detalle de qué dashboards y datos exactos mostrar en el panel de administración (UC-58) queda abierto a definición de detalle.

---

## 12. Riesgos y consideraciones

- **Riesgo de marca:** aunque no se usan escudos ni logos oficiales de los clubes, el uso de nombres y colores conserva un riesgo residual de marca. Se recomienda aclarar visiblemente (footer/ToS) que la plataforma no es oficial ni está afiliada a los clubes.
- **Riesgo de reputación en Mercado Pago:** un volumen alto y sostenido de reembolsos podría afectar la reputación de la cuenta vendedora, aunque se espera que sea bajo dado el diseño de doble capa anti-abuso.
- **Riesgo de identidad:** el sistema no garantiza la unicidad de la persona detrás de cada voto (cookies borrables, múltiples medios de pago, IPs compartidas). Es una barrera de fricción y costo, no una garantía — validado explícitamente por H6.
- **Riesgo de contenido:** todavía no está definida la fuente de datos deportivos ni el proveedor de fixtures/resultados (UC-12), lo que puede retrasar esa parte de la experiencia.

---

## 13. Preguntas abiertas

Heredadas del documento de handoff (sección 21):

- ¿Qué ocurre si dos clásicos empatan en votos totales?
- ¿Cuál es el mensaje exacto que ve el usuario al alcanzar el límite de votos?
- ¿Qué datos deportivos mostrar y quién es el proveedor de fixtures/resultados?
- ¿Habrá contenido editorial o solo datos crudos?
- ¿Se muestran votos totales históricos?
- ¿Cómo se calcula el "crecimiento" de un clásico? (se deja para una etapa de detalle fino)

Detectadas durante el armado de los casos de uso (nuevas, no estaban en el handoff original):

- ¿Qué pasa si los dos equipos de un mismo clásico empatan en votos entre sí? (distinto del empate entre clásicos — ver UC-04, UC-45).
- ¿Un clásico nuevo dado de alta a mitad de una temporada en curso entra a esa temporada o recién a la siguiente? (ver UC-41).
- ¿El cierre de una temporada y la apertura de la siguiente son automáticos (job programado) o requieren una acción manual del administrador? (ver UC-47).

---

## 14. Glosario

- **Arena:** instancia visual del clásico líder actual de la temporada.
- **Clásico / Rivalry:** par de equipos que compiten (concepto permanente, ej. Boca–River).
- **Temporada / Season:** período de 30 días donde se acumulan votos para el ranking.
- **Voto:** unidad de participación paga, equivalente a 1 USD.
- **Identidad de votante:** identificador técnico (cookie, IP, `payer_id`) sin cuenta de usuario tradicional.
- **Clásico líder:** el de mayor cantidad de votos totales válidos en la temporada activa.
- **Equipo dominante / ganador visual:** el equipo con más votos dentro del clásico líder.

---

## 15. Referencias

- Casos de uso detallados (actores, flujos, criterios de aceptación): [`uses-cases/`](./uses-cases)
