# 🎓 LearnClass - Plataforma educativa para profesores y alumnos

Una plataforma web que permite a los profesores gestionar cursos y a los estudiantes acceder a materiales, enviar tareas y comunicarse con los profesores. 

---

## 1. Idea de proyecto

LearnClass es una plataforma web diseñada para mejorar la comunicación y organización entre profesores y alumnos.

Muchos estudiantes necesitan acceder a materiales de clase, entregar tareas o comunicarse con el profesor utilizando diferentes herramientas. LearnClass reúne todas estas funcionalidades en un único entorno digital.

La plataforma permitirá que los profesores puedan crear cursos, subir materiales y asignar tareas, mientras que los alumnos podrán acceder al contenido, entregar trabajos y consultar sus calificaciones.

El objetivo principal del proyecto es facilitar la gestión académica y mejorar la comunicación entre profesores y estudiantes mediante una plataforma sencilla, segura y profesional.

---

## 2. Requisitos funcionales

La aplicación deberá permitir las siguientes funcionalidades:

- Los usuarios podrán **registrarse e iniciar sesión** en la plataforma.
- El sistema diferenciará entre **dos tipos de usuario: profesor y alumno**, y validará los roles mediante correo institucional o simulación de cuentas oficiales.
- Los profesores podrán **crear cursos o asignaturas** una vez aprobado su rol.
- Los alumnos podrán **inscribirse en cursos disponibles**.
- Los profesores podrán **subir materiales de clase** como documentos, enlaces o recursos educativos.
- Los alumnos podrán **visualizar y descargar los materiales** de los cursos en los que estén inscritos.
- Los profesores podrán **crear tareas o actividades** dentro de un curso.
- Los alumnos podrán **entregar sus tareas a través de la plataforma**.
- Los profesores podrán **revisar y calificar las entregas de los alumnos**.
- El sistema permitirá **publicar avisos o anuncios dentro de cada curso**.
- Los usuarios podrán **comunicarse mediante un sistema de mensajería o chat en tiempo real**.

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

---

### Backend

El backend gestionará la lógica de negocio de la aplicación.

Tecnologías utilizadas:

- **Node.js**
- **Express.js**
- Arquitectura MVC para separar **modelos, controladores y rutas**

---

### Base de datos

Para el almacenamiento de información se utilizará:

- **MySQL**

La base de datos almacenará información como:

- usuarios
- cursos
- materiales
- tareas
- entregas
- mensajes
- instituciones

---

### Comunicación en tiempo real

Para implementar funcionalidades de mensajería o chat se utilizará:

- **Socket.io**

Esto permitirá que profesores y alumnos puedan comunicarse **en tiempo real** dentro de la plataforma.

---

### Registro y validación de roles

Para garantizar que los usuarios tengan el rol correcto:

1. **Registro de usuario**
   - El usuario elige su rol (profesor o alumno) y selecciona su **institución/centro educativo**.

2. **Simulación de cuentas oficiales tipo Clickedu**
   - Los profesores deben registrar un correo que contenga `"prof@gmail.com"` y los alumnos `"student@gmail.com"`.
   - Esto simula que solo los correos oficiales de la institución pueden ser profesores.
   - El backend valida siempre los roles antes de permitir acciones sensibles (como crear cursos o asignar tareas).

3. **Email de confirmación**
   - Cuando el rol se aprueba, se envía un correo de confirmación indicando que el usuario ya puede usar su cuenta como profesor.

4. **Alumno**
   - Los alumnos pueden registrarse directamente con su email simulado o institucional.

Este método permite demostrar **control de roles seguro y profesional** sin necesidad de infraestructura real ni licencias de correo.

---

### Estructura general de la aplicación

La aplicación se dividirá en varias capas:

- **Frontend** → interfaz que utilizan profesores y alumnos.
- **Backend (Node.js + Express)** → lógica de negocio y gestión de peticiones.
- **Base de datos (MySQL)** → almacenamiento de la información del sistema.
- **Servidor de comunicación en tiempo real (Socket.io)** → mensajería instantánea.

Esta arquitectura permite que la aplicación sea **segura, modular, escalable y fácil de mantener**.
