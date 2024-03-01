# OLIMPO FLOW CDN

el proyecto esta divido en 3 carpetas:

- GPT: Es el primer proyecto creado, esta hecho con vite y vanilla javascript.
- GPT_lit: Migración del primer proyecto a Lit.
- GPT_test: Copia del primer proyecto con features nuevas de tarjeta oh.

## Publicación de una nueva versión

1. Ir al directorio del proyecto:

```bash
  cd olimpo/flow/gpt_test
```

2. Hacer build del proyecto:

```
pnpm build
```

3. Subir cambios del proyecto:

```
git push
```

4. Crear una nueva release en github.

## Levantar localmente

Clonar el proyecto

```bash
  git clone https://github.com/mibotchile/cdn.git
```

Ir al directorio del proyecto (ejemplo):

```bash
  cd olimpo/flow/gpt_lit
```

Instalar las dependencias

```bash
  pnpm i
```

Levantar el server

```bash
  pnpm dev
```
