### Proyecto TA TE TI - Grupo 6

[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/Uc_kVv2r)

### Integrantes: 
* Lautaro Gutierrez
* Emilia Barrera
* Facundo Barrera
* Lautaro Rivieri

## Proceso / Feedback
Para dar comienzo, cada integrante clonó el repositorio en local para luego analizar el código proporcionado, del cual partimos como base para determinar cómo sería el desarrollo del proyecto. La idea consistió en que cada integrante pudiera contextualizar y establecer los requisitos estándar, en base a las consignas que el profesor dió a conocer durante las clases y al análisis del repositorio.
Luego de hacer una puesta en común, pudimos determinar como estándar los siguientes requisitos generales:
* Principalmente, y como el profesor lo pidió, es **“stateless”**, gracias a que no guarda información evitamos complicarnos con código innecesario (*KISS* o *YAGNI*).
* **Se ejecuta completamente en nodejs**, nada de HTML y CSS debido a que no tomará el valor ingresado por solicitud http, es decir por el navegador (localhost:3000/move?board=[0,0,0,0,0,0,0,0,0]). 
* **Sin interacciones**, el único valor que toma es el mencionado anteriormente, debe devolver el tablero modificado con la jugada.

Luego de habernos contextualizado, tocó pensar en las funcionalidades necesarias para estar a la altura de la competencia, y poder hacer frente, así que a continuación muestro cómo las pensamos:
* En base al último movimiento saber qué jugador es, si 1 o 2 (el que menos cantidad tiene dentro del tablero).
* Jugadas ganadoras para no malgastar los turnos realizando movimientos aleatorios.
En caso de no poder realizar un movimiento ganador, en base al anterior ítem, determinar si el oponente podría realizarlo y optar por un bloqueo.
* De no cumplirse ninguno de las funciones anteriores, una función que priorice el centro, seguido de las esquinas y por último los lados.
* Teniendo las funciones anteriores definidas, estas se integrarían con una función para elegir el movimiento a convenir.
* Dibujar el tablero formateado.

Una vez definidas cada uno investigó la función elegida y, puesto que no contamos con el conocimiento de muchos métodos y su aplicación, a medida que íbamos buscando alternativas como en youtube(que descubrimos que le dicen Tic Tac Toe!?), no encontramos referencias que sean de ayuda para adaptar al proyecto, tuvimos que recurrir a ayuda de IA y luego documentación para analizar el código proporcionado.  Más allá de eso, pudimos realizar reuniones de trabajo y lograr que el código no tenga incoherencias, estableciendo el idioma inglés como estándar y un orden de las funciones más entendible.

Para concluir, el proyecto nos dió una buena primera impresión de lo que implican los equipos de trabajos, conocimientos y puntos a mejorar, siendo este uno de los primeros pasos en la carrera para desenvolvernos profesionalmente.

**PD:** *gracias por pasar la competencia para el día 16, disculpe la tardanza 😅*
