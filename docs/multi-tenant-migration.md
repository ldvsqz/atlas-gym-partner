# Migracion de datos por gimnasio

Las reglas nuevas requieren `gymId` en todos los documentos de negocio. Antes de
publicarlas en el proyecto existente:

1. Define `VITE_DEFAULT_GYM_ID` en el entorno de build. Si no se define, Atlas
   usa `default-gym`.
2. Asigna ese mismo valor a los perfiles existentes en `users`, incluyendo los
   administradores.
3. Asigna el mismo valor a todos los documentos de `stats`, `routine`,
   `finances`, `monthlyCashboxes`, `cycles`, `exercises`, `gymExercises`,
   `gymLayouts`, `notificados` y `moduleSettings`.
4. Para `moduleSettings`, mueve los documentos al ID
   `<gymId>__<moduleName>`; el servicio ya escribe con ese formato.
5. Verifica en el emulador que un administrador de un gimnasio no puede leer ni
   escribir documentos con otro `gymId`.
6. Publica primero índices y reglas en staging y realiza una lectura de cada
   módulo antes de producción.

No publiques las reglas endurecidas hasta completar la migración: los documentos
sin `gymId` quedarán denegados intencionalmente.

## Ejecución desde Google Cloud Shell

El script usa las credenciales incorporadas de Cloud Shell y no requiere
descargar una cuenta de servicio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd atlas
npm install firebase-admin --no-save
export FIREBASE_PROJECT_ID=atlas-gym-partner
export GYM_ID=default-gym
node scripts/migrate-gym-id.mjs
node scripts/migrate-gym-id.mjs --apply
node scripts/migrate-gym-id.mjs --verify
```

El primer comando `node` es solo una simulacion. Revisa sus cantidades y ejecuta
`--apply` una sola vez. El comando `--verify` falla si quedan documentos sin
`gymId` o configuraciones de modulo fuera del namespace del gimnasio. Luego
publica las reglas:

```bash
node scripts/migrate-gym-id.mjs --verify
npx firebase deploy --only firestore:rules --project atlas-gym-partner
```

No pegues credenciales ni claves privadas en la terminal o en el repositorio.
