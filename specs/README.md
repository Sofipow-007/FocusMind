# Desarrollo guiado por especificaciones (SDD)

Esta carpeta contiene los artefactos de especificación de cada funcionalidad o cambio significativo. El flujo mantiene una cadena visible desde el requisito hasta la implementación:

```text
SPEC.md (reglas y decisiones globales)
  → specs/<id>-<nombre>/spec.md (problema, alcance y aceptación)
  → specs/<id>-<nombre>/plan.md (diseño técnico y capas afectadas)
  → specs/<id>-<nombre>/tasks.md (trabajo verificable)
  → implementación y pruebas
  → actualización de SPEC.md / TASKS.md si corresponde
```

## Cuándo crear artefactos

- Crear una carpeta para cada funcionalidad, cambio transversal o decisión con impacto en contratos, datos, seguridad, dependencias o despliegue.
- Para correcciones pequeñas y localizadas, se puede usar el flujo normal del repositorio sin generar los tres documentos; actualizar `TASKS.md` o `SPEC.md` si cambia su estado o contenido normativo.
- No crear una especificación para una decisión ya resuelta por `SPEC.md` sin explicar el cambio que se propone.

## Convención de nombres

Usar un identificador corto correlativo y un nombre en kebab-case:

```text
specs/001-auth-session/
├── spec.md
├── plan.md
└── tasks.md
```

Copiar las plantillas de [`_templates/`](./_templates/). El identificador se asigna al iniciar el cambio; no reutilizar carpetas de funcionalidades distintas.

## Orden de trabajo

1. Leer `SPEC.md`, `ARCHITECTURE.md`, `TASKS.md` y las instrucciones aplicables en `AGENTS.md`.
2. Escribir `spec.md`: problema, usuarios/flujo, alcance, exclusiones y criterios de aceptación comprobables. No incluir soluciones técnicas como requisito salvo que sean una restricción ya aprobada.
3. Escribir `plan.md`: módulos y capas afectados, modelo/API/UI, decisiones, riesgos y estrategia de verificación. Si hace falta una nueva decisión global, proponerla para revisión y registrar la decisión aprobada en `SPEC.md`.
4. Escribir `tasks.md`: descomponer el trabajo en pasos pequeños, ordenados y verificables que enlacen a los criterios de aceptación.
5. Revisar y acordar alcance y decisiones antes de una implementación importante. No avanzar a una etapa posterior del roadmap sin autorización del usuario.
6. Implementar siguiendo el plan y marcar tareas al terminarlas. Ejecutar las pruebas relevantes; anotar comandos y resultados.
7. Actualizar `SPEC.md` para cambios normativos, `TASKS.md` para el estado global y los artefactos de la funcionalidad para reflejar el resultado real.

## Fuentes de verdad

- `SPEC.md`: requisitos globales, contratos y decisiones técnicas aprobadas.
- `ARCHITECTURE.md`: explicación de la estructura implementada, subordinada a `SPEC.md`.
- `TASKS.md`: resumen del roadmap y su estado.
- `specs/<id>-<nombre>/`: alcance, plan y ejecución de un cambio particular.

Si existe una contradicción, no ocultarla: registrar la diferencia, resolverla con el usuario cuando afecte una decisión, y actualizar los documentos que dependan de ella.
