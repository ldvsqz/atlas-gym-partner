# Atlas Gym Partner - Auditoria completa preproduccion

Fecha de auditoria: 2026-07-16

## Resumen Ejecutivo

**Estado de produccion: No listo para produccion.**

Atlas Gym Partner puede compilar una version de produccion, pero no esta listo para venderse como SaaS. Los bloqueadores principales estan en seguridad, aislamiento multi-tenant, dependencias vulnerables, ausencia de pruebas reales, consultas no escalables, falta de reglas/versionado para Storage e indices, y debilidades operativas para monitoreo, backups y despliegue confiable.

El build de Vite pasa, pero con advertencias importantes de bundle. `npm audit` encontro vulnerabilidades criticas/altas tanto en frontend como en Firebase Functions.

Punto clave: el proyecto esta implementado en JavaScript/JSX, no en TypeScript. Se encontraron `0` archivos `.ts/.tsx` relevantes en `src`, `Firebase` y `functions`.

## Calificacion General

| Area | Calificacion |
|---|---:|
| Arquitectura | 5/10 |
| Codigo | 5/10 |
| Seguridad | 3/10 |
| Performance | 4/10 |
| UX | 6/10 |
| Escalabilidad | 2/10 |
| Mantenibilidad | 4/10 |

## 1. Arquitectura

Calificacion: **5/10**

La aplicacion tiene una estructura mixta: partes legacy en `src/Pages`, servicios Firebase globales en `Firebase`, y modulos mas recientes en `src/features`. Esto muestra una evolucion positiva hacia features por dominio, pero todavia no hay una arquitectura SaaS clara.

Problemas principales:

- No existe modelo multi-tenant (`tenantId`, `gymId`, organizacion, roles por tenant).
- Los servicios Firestore usan colecciones globales: `users`, `stats`, `finances`, `cycles`, `gymLayouts`.
- La autorizacion depende de un rol global `rol == 0`.
- Hay logica de dominio en componentes grandes.
- No existe capa clara para validacion de datos compartida entre frontend, rules y backend.
- No hay TypeScript a pesar de que el stack esperado lo menciona.

## 2. Calidad del codigo

Calificacion: **5/10**

Fortalezas:

- Algunas features nuevas (`training`, `gymLayout`) estan mejor encapsuladas.
- Hay uso de hooks dedicados en modulos recientes.
- El build de produccion pasa.

Debilidades:

- No hay tipado TypeScript.
- No hay ESLint real; `npm run lint` ejecuta `npm run build`.
- No hay tests reales; `npm test` ejecuta `npm run build`.
- Hay componentes muy grandes: `CashboxHistory.jsx`, `User.jsx`, `Users.jsx`, `SetStats.jsx`, `CycleList.jsx`, `GymLayoutPage.jsx`.
- Hay codigo legacy comentado y componentes/rutas vacias.
- Hay servicios con manejo inconsistente de errores: algunos retornan errores como valores, otros hacen `throw`.

## 3. Firebase

### Authentication

Firebase Auth se usa correctamente para login con email/password y Google. Sin embargo, la aplicacion guarda `UID` y `ROL` en `localStorage`, lo cual solo deberia usarse para UX no confiable, nunca para permisos.

### Firestore

Problemas principales:

- Modelo global sin tenants.
- Consultas completas sin paginacion.
- Ausencia de indices versionados.
- Reglas con validaciones de schema insuficientes.
- Campos sensibles como `until` pueden ser modificados por usuarios propietarios.

### Storage

Firebase Storage esta configurado en `Firebase/firebase.js`, pero no se encontro `storage.rules`. Las imagenes de circuitos se guardan como base64 en Firestore, lo que es costoso y riesgoso por limite de documento.

### Security Rules

Las rules bloquean colecciones desconocidas, pero tienen problemas criticos:

- Admin global por `rol == 0`.
- Usuarios pueden actualizar campos propios no permitidos.
- No hay separacion por gimnasio/tenant.
- No hay validacion estricta de tipos/campos.

### Costo potencial

Riesgo alto. Varias pantallas leen colecciones completas y filtran en cliente. Esto escala mal en Firestore por lecturas facturadas, latencia y memoria del cliente.

## 4. Seguridad

Calificacion: **3/10**

Hallazgos principales:

- Dependencias vulnerables con severidad critica/alta.
- Firestore Rules permiten cambios peligrosos en perfiles propios.
- No hay aislamiento multi-tenant.
- Endpoint callable de disponibilidad de registro permite enumerar DNI/email.
- No hay App Check ni rate limiting evidente.
- `OPENWA_BASE_URL` por defecto usa HTTP hacia una IP.
- `vite.config.js` expone prefijo `OPENWA_` al cliente si se define una variable con ese prefijo.
- CI no bloquea por audit ni tests.

## 5. Performance

Calificacion: **4/10**

El build pasa, pero Vite reporta chunks grandes:

- `dist/assets/index-*.js`: ~1,094 KB minificado, ~306 KB gzip.
- `User-*.js`: ~387 KB minificado.
- `jspdf.es.min-*.js`: ~416 KB minificado.
- `Exercises-*.js`: ~237 KB minificado.

Problemas:

- Carga de colecciones completas.
- Catalogo `all-exercises.js` de mas de 11,000 lineas.
- Imagenes/GIFs externos via HTTP en ejercicios legacy.
- Falta de paginacion y queries por rango.
- PDF libraries pesadas; algunas estan lazy-loaded, pero todavia impactan chunks en ciertas rutas.

## 6. UX

Calificacion: **6/10**

Fortalezas:

- Uso de Material UI.
- Hay skeletons/loaders en varias vistas.
- Hay snackbars para feedback.
- Features nuevas tienen mejor experiencia visual.

Problemas:

- Rutas privadas no tienen guard central.
- Pantallas vacias como Eventos y Settings.
- Errores genericos en varios flujos.
- Responsive parcial; algunas tablas pueden degradarse en mobile.
- Accesibilidad no verificada con pruebas automatizadas.
- Algunas acciones criticas dependen solo de confirm dialogs simples.

## 7. Produccion

Faltantes para produccion:

- Logs estructurados del frontend.
- Error boundary global.
- Monitoreo de errores tipo Sentry/Crashlytics/Logging.
- Analytics de uso.
- Alertas operativas para Functions.
- Backup/restore de Firestore.
- App Check.
- Tests de rules con Firebase Emulator.
- Indices versionados.
- Storage rules versionadas.
- CI con `npm ci`, lint, tests, audit y deploy controlado.
- Versionado reproducible del frontend: `package-lock.json` raiz esta ignorado.

## 8. Escalabilidad SaaS

### 100 clientes

Puede funcionar de forma limitada si cada cliente tiene pocos usuarios, pero ya existe riesgo de mezcla de datos porque no hay tenants.

### 500 clientes

Las consultas completas a usuarios, stats y finanzas empiezan a generar costos y latencia altos. El modelo de admin global se vuelve inviable.

### 1000 clientes

La ausencia de `tenantId/gymId` bloquea el SaaS. No se puede garantizar aislamiento contractual ni autorizacion por organizacion.

### 5000 clientes

Se requiere redisenar modelo de datos, permisos, indices, observabilidad, backups, cuotas, jobs programados y limites por plan. El diseno actual no escala a este nivel.

## 9. Mantenibilidad

Calificacion: **4/10**

El codigo es mantenible para una app pequena de un solo gimnasio, pero no para un SaaS comercial sin refactor. La falta de TypeScript, tests, lint real, reglas de datos estrictas y arquitectura multi-tenant aumenta mucho el costo de cambio.

## 10. Codigo muerto

Hallazgos:

- `src/Pages/Events.jsx` y `src/Pages/Settings/Settings.jsx` son rutas practicamente vacias.
- Hay imports no usados en esas pantallas.
- Hay codigo legacy comentado en `src/Pages/User/User.jsx`.
- Componentes legacy de rutinas parecen parcialmente desconectados del flujo actual.
- Catalogos grandes de ejercicios locales pueden ser reemplazados por datos paginados o administrables.
- Dependencias potencialmente no usadas directamente: `react-icons`, `styled-components`, `@mui/styled-engine-sc`, `react-to-print` requieren confirmacion con analisis de bundle/imports antes de remover.

## Hallazgos Detallados

| Severidad | Archivo | Linea | Explicacion | Riesgo | Solucion recomendada |
|---|---|---:|---|---|---|
| Critica | `firestore.rules` | 36 | Un owner puede actualizar su documento si conserva `uid` y `rol`, pero puede cambiar `until`, `email`, `dni`, etc. | Auto-renovacion, fraude, modificacion de datos sensibles. | Validar campos permitidos con `diff().affectedKeys()` y reservar `until/rol` para admin/backend. |
| Critica | `firestore.rules` | 13 | `isAdmin()` usa `rol == 0` global. | Admin global para todos los gimnasios; no hay SaaS seguro. | Introducir tenants y roles por tenant/custom claims. |
| Critica | `package.json` | 35 | `react-router-dom` vulnerable segun `npm audit`. | Vulnerabilidades high en router. | Actualizar dependencias y lockfile. |
| Critica | `package.json` | 12 | `npm audit` reporta `websocket-driver` critical. | Riesgo de dependencia vulnerable en arbol. | Ejecutar upgrades auditados y validar build. |
| Alta | `functions/package.json` | 13 | Audit de Functions reporta `form-data` high y `websocket-driver` critical. | Riesgo en backend/deploy tooling. | Actualizar `firebase-admin`, `firebase-functions` y dependencias transitivas. |
| Alta | `Firebase/userService.js` | 77 | `getAll()` lee todos los usuarios. | Alto costo y latencia. | Query por tenant, filtros, paginacion y limites. |
| Alta | `Firebase/statsService.js` | 70 | `getAll()` lee todas las stats. | Alto costo y fuga operativa. | Consultas por `uid/tenantId` y paginacion. |
| Alta | `Firebase/financeService.js` | 43 | `getAll()` lee todos los movimientos financieros. | Costo alto y lentitud. | Query por tenant y periodo con indices. |
| Alta | `src/Pages/Finance/Finance.jsx` | 89 | Carga todas las finanzas y filtra en cliente. | No escala con volumen. | Consultar por rango de fechas y tenant. |
| Alta | `functions/index.js` | 193 | `checkRegistrationAvailability` es callable sin auth/rate limit. | Enumeracion de DNI/email. | App Check, rate limit, respuesta menos granular. |
| Alta | `firebase.json` | 5 | No se versionan indices ni Storage rules. | Deploy incompleto/inseguro. | Agregar `firestore.indexes.json` y `storage.rules`. |
| Alta | `src/features/gymLayout/dialogs/CreateExerciseDialog.jsx` | 60 | Imagenes convertidas a data URL. | Firestore caro, limite 1 MiB. | Subir imagenes a Storage y guardar metadata/URL. |
| Alta | `src/App.jsx` | 55 | Rutas privadas sin guard central. | UX inconsistente y pantallas accesibles antes de fallar por rules. | Implementar `ProtectedRoute` y `RoleRoute`. |
| Media | `src/Components/Menu/Menu.jsx` | 36 | `UID/ROL` desde `localStorage`. | Permisos visuales manipulables. | Derivar rol desde perfil autenticado o custom claims. |
| Media | `Firebase/firebase.js` | 6 | Config Firebase hardcodeada. | No separa ambientes dev/stage/prod. | Usar `.env` con `VITE_FIREBASE_*`. |
| Media | `vite.config.js` | 11 | `OPENWA_` expuesto como prefijo client-side. | Riesgo de exponer secretos por convencion. | Eliminar `OPENWA_` de `envPrefix`. |
| Media | `functions/index.js` | 13 | Default OpenWA por HTTP a IP. | Trafico no cifrado. | Usar HTTPS y configuracion segura. |
| Media | `.gitignore` | 27 | `package-lock.json` raiz ignorado. | Builds no reproducibles. | Versionar lockfile y usar `npm ci`. |
| Media | `.github/workflows/firebase-hosting-merge.yml` | 12 | CI usa `npm install`. | Dependencias flotantes. | Usar `npm ci`. |
| Media | `.github/workflows/firebase-hosting-merge.yml` | 13 | CI solo build/deploy. | Se despliega sin lint/test/audit. | Agregar lint, test, audit y emulator tests. |
| Media | `package.json` | 10 | `lint` es `npm run build`. | No detecta problemas estaticos. | Configurar ESLint. |
| Media | `package.json` | 11 | `test` es `npm run build`. | Sin cobertura real. | Agregar Vitest/RTL/Playwright. |
| Media | `Firebase/RoutineService.js` | 113 | `const query = query(...)` produce shadowing/TDZ. | Funcion rota si se invoca. | Renombrar variable y cubrir con test. |
| Media | `src/Pages/Exercises/Exercises.jsx` | 11 | Importa dataset grande local. | Bundle pesado. | Lazy data, paginacion o Firestore/Storage. |
| Media | `src/assets/exercises/all-exercises.js` | 5 | GIFs via HTTP externo. | Mixed content y dependencia externa. | HTTPS/Storage/CDN propio. |
| Baja | `src/Pages/Events.jsx` | 1 | Ruta vacia e imports no usados. | Deuda tecnica. | Eliminar u ocultar hasta implementacion. |
| Baja | `src/Pages/Settings/Settings.jsx` | 1 | Ruta vacia e imports no usados. | Deuda tecnica. | Eliminar u ocultar hasta implementacion. |

## Backlog Priorizado

### P0 - Bloquea produccion

| Tarea | Impacto | Esfuerzo estimado | Archivos afectados |
|---|---|---:|---|
| Redisenar Firestore Rules para campos permitidos, ownership y tenants. | Bloquea abuso de datos y prepara SaaS. | L | `firestore.rules`, `Firebase/*`, modelos |
| Introducir `tenantId/gymId` en usuarios, stats, finanzas, ciclos, layouts y ejercicios. | Aislamiento SaaS real. | XL | `Firebase/*`, `src/*`, rules |
| Actualizar dependencias vulnerables y versionar lockfile raiz. | Cierra vulnerabilidades criticas/altas. | M | `package.json`, `package-lock.json`, `functions/package.json`, `functions/package-lock.json` |
| Convertir CI a `npm ci` + build + lint + test + audit. | Evita deploy inseguro. | M | `.github/workflows/*`, `package.json` |
| Agregar tests de Firestore Rules con Emulator. | Garantiza autorizacion antes de vender. | M | `firestore.rules`, tests |

### P1 - Muy importante

| Tarea | Impacto | Esfuerzo estimado | Archivos afectados |
|---|---|---:|---|
| Reescribir queries globales con filtros por tenant, fechas, orden y paginacion. | Reduce costo y latencia. | L | `Firebase/userService.js`, `statsService.js`, `financeService.js`, `trainingService.js` |
| Agregar `firestore.indexes.json`. | Deploy reproducible de queries. | M | `firestore.indexes.json`, `firebase.json` |
| Migrar imagenes base64 a Firebase Storage. | Evita limite 1 MiB y reduce costo. | M | `gymLayoutService`, `CreateExerciseDialog`, `storage.rules` |
| Implementar rutas protegidas y guards por rol. | UX y seguridad defensiva. | M | `src/App.jsx`, `src/Components/Menu/Menu.jsx` |
| Agregar App Check y rate limiting para callable functions sensibles. | Reduce abuso. | M | `functions/index.js`, Firebase config |
| Agregar observabilidad: error boundary, logging frontend, alertas Functions. | Operacion produccion. | M | `src/main.jsx`, `src/App.jsx`, `functions/index.js` |
| Definir backups y plan de restore Firestore. | Continuidad operativa. | M | Infra/Firebase/GCP |

### P2 - Mejoras

| Tarea | Impacto | Esfuerzo estimado | Archivos afectados |
|---|---|---:|---|
| Migrar progresivamente a TypeScript estricto. | Reduce bugs y mejora mantenibilidad. | L | `src`, `Firebase`, `functions` |
| Dividir componentes grandes. | Mejora lectura y testabilidad. | M | `User.jsx`, `Users.jsx`, `CashboxHistory.jsx`, `SetStats.jsx`, `CycleList.jsx` |
| Optimizar bundle con manual chunks y lazy imports. | Mejora carga inicial. | M | `vite.config.js`, rutas/features |
| Remover rutas vacias y codigo legacy comentado. | Reduce deuda tecnica. | S | `Events.jsx`, `Settings.jsx`, `User.jsx`, routines legacy |
| Mejorar validaciones de formularios y schemas. | Datos mas confiables. | M | formularios, servicios, rules |

### P3 - Opcionales

| Tarea | Impacto | Esfuerzo estimado | Archivos afectados |
|---|---|---:|---|
| Mejorar empty states y responsive avanzado. | UX comercial. | M | pantallas principales |
| Agregar documentacion tecnica y runbooks. | Onboarding y soporte. | S | `README.md`, `docs/*` |
| Analisis de dependencias no usadas. | Bundle mas limpio. | S | `package.json` |

## Roadmap hacia Version 1.0

### Sprint 1 - Seguridad y base SaaS

Objetivo: cerrar bloqueadores de produccion.

- Redisenar modelo multi-tenant.
- Actualizar Firestore Rules.
- Agregar tests de rules con Emulator.
- Actualizar dependencias vulnerables.
- Versionar lockfile raiz.
- Cambiar CI a `npm ci`.
- Agregar lint/test/audit en CI.

### Sprint 2 - Firebase escalable y datos seguros

Objetivo: reducir costo, mejorar performance y completar Firebase.

- Reescribir queries con `tenantId`, filtros, `orderBy`, `limit`.
- Crear `firestore.indexes.json`.
- Agregar `storage.rules`.
- Migrar imagenes a Storage.
- Implementar guards de rutas.
- Agregar App Check/rate limit en callables.

### Sprint 3 - Preparacion comercial

Objetivo: operar y vender la version 1.0.

- Error boundary y monitoreo.
- Logs/alertas para Functions.
- Backups Firestore y prueba de restore.
- Optimizar bundle.
- Limpiar codigo muerto.
- Mejorar responsive, empty states y accesibilidad.
- Documentar despliegue, soporte y recuperacion.

## Verificacion ejecutada

Comandos ejecutados:

```bash
npm run build
npm audit --omit=dev
npm --prefix functions audit --omit=dev
```

Resultados:

- `npm run build`: exitoso.
- Vite reporto chunks mayores a 500 KB.
- `npm audit --omit=dev`: fallo por vulnerabilidades reales, incluyendo `websocket-driver` critical y `react-router` high.
- `npm --prefix functions audit --omit=dev`: fallo por vulnerabilidades reales, incluyendo `websocket-driver` critical y `form-data` high.

