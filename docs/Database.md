# Estructuras de la base de datos

| Nombre      | Tipo           | Descripción |
| ----------- | -------------- | ----------------------------------------------------------------- |
| *username*  | `VARCHAR(300)` | Nombre de usuario, clave primaria única del sistema |
| *name*      | `VARCHAR(300)` | Nombre del usuario, puede repetirse entre distintos usuarios |
| *surname*   | `VARCHAR(300)` | Apellidos del usuario |
| *password*  | `CHAR(128)`    | Contraseña almacenada en hash SHA2-512 para mayor seguridad |
| *email*     | `VARCHAR(300)` | Correo electrónico del usuario |
| *user_type* | `VARCHAR(200)` | Tipo o rol del usuario ('admin', 'sponsor', 'organizer') |
| *enabled*   | `BOOLEAN`      | Estado del usuario: `0` deshabilitado, `1` habilitado |
| *gender*    | `ENUM`         | Género del usuario: `'male'`, `'female'` o `'unknown'` |
| *createAt*  | `TIMESTAMP`    | Fecha y hora de creación del registro, por defecto el momento de inserción |
| *updateAt*  | `TIMESTAMP`    | Fecha y hora de última actualización del registro, por defecto el momento de inserción |