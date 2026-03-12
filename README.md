# 🎓 LearnClass - Plataforma educativa para profesores y alumnos

## 1. Idea de proyecto

LearnClass es una plataforma web diseñada para mejorar la comunicación y organización entre profesores y alumnos.

Actualmente, muchos estudiantes necesitan acceder a materiales de clase, entregar tareas o comunicarse con el profesor utilizando diferentes herramientas. LearnClass busca reunir todas estas funcionalidades en un único entorno digital.

La plataforma permitirá que los profesores puedan crear cursos, subir materiales y asignar tareas, mientras que los alumnos podrán acceder al contenido, entregar trabajos y consultar sus calificaciones.

El objetivo principal del proyecto es facilitar la gestión académica y mejorar la comunicación entre profesores y estudiantes mediante una plataforma sencilla y accesible.

---

## 2. Requisitos funcionales

La aplicación deberá permitir las siguientes funcionalidades:

- Los usuarios podrán **registrarse e iniciar sesión** en la plataforma.
- El sistema diferenciará entre **dos tipos de usuario: profesor y alumno**.
- Los profesores podrán **crear cursos o asignaturas**.
- Los alumnos podrán **inscribirse en cursos disponibles**.
- Los profesores podrán **subir materiales de clase** como documentos o enlaces educativos.
- Los alumnos podrán **visualizar y descargar los materiales** de los cursos en los que estén inscritos.
- Los profesores podrán **crear tareas o actividades** dentro de un curso.
- Los alumnos podrán **entregar sus tareas a través de la plataforma**.
- Los profesores podrán **revisar y calificar las entregas de los alumnos**.
- El sistema permitirá **publicar avisos o anuncios dentro de cada curso**.
- Los usuarios podrán **comunicarse mediante un sistema de mensajería o chat**.

---

## 3. Mockup gráfico

A continuación se muestran algunos wireframes o mockups de las principales pantallas de la aplicación.

### Página de inicio
![Home Mockup](mockups/home.png)

### Panel de profesor
![Teacher Dashboard](mockups/teacher_dashboard.png)

### Panel de alumno
![Student Dashboard](mockups/student_dashboard.png)

### Gestión de cursos
![Courses Mockup](mockups/courses.png)

### Entrega de tareas
![Assignments Mockup](mockups/assignments.png)

*(Los mockups han sido diseñados utilizando herramientas como Figma, Excalidraw o bocetos iniciales.)*

---

## 4. Arquitectura y tecnología

El proyecto se desarrollará siguiendo una arquitectura **cliente-servidor basada en el patrón MVC (Model-View-Controller)**.

### Frontend

El frontend será la parte visible de la aplicación y permitirá la interacción con los usuarios.

Tecnologías utilizadas:

- HTML
- CSS
- JavaScript
- Bootstrap (para diseño responsive)

### Backend

El backend gestionará la lógica de negocio de la aplicación.

Tecnologías utilizadas:

- PHP
- Arquitectura MVC para separar la lógica de datos, la interfaz y el control de las peticiones.

### Base de datos

Para el almacenamiento de información se utilizará:

- MySQL

La base de datos almacenará información como:

- usuarios
- cursos
- materiales
- tareas
- entregas
- mensajes

### Estructura general de la aplicación

La aplicación se dividirá en tres capas principales:

- **Frontend** → interfaz que utilizan profesores y alumnos.
- **Backend (PHP con MVC)** → lógica de negocio y gestión de datos.
- **Base de datos (MySQL)** → almacenamiento de la información del sistema.

Esta arquitectura permite una aplicación organizada, escalable y fácil de mantener.
