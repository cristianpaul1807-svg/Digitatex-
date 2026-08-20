# Objeto en viaje

`objeto-en-viaje` · Experiencia de producto · avanzado

Un objeto 3D dibujado en un lienzo fijo detrás de TODA la página, que se monta, se cierra y se envuelve mientras el lector recorre las secciones.

## Source reference

> Sticky-pinned scroll variant on desktop · scroll-controlled

## Implementation

- **Export:** `dibujarViaje`
- **Technology:** GSAP · ScrollTrigger · Canvas
- **Performance cost:** medio

## Usage

```tsx
Ver src/viaje/ · demo en /motion/viaje.html
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | Un único valor de avance va del primer píxel al último del documento. El objeto no pertenece a ninguna sección: las atraviesa, cambiando de lado para no pisar nunca la columna de texto. |
| Tablet | Igual, con menos recorrido lateral. |
| Mobile | **simplificado** — El objeto se sale de la coreografía y se atraca centrado en la banda de arriba. A 390px, uno que cruza de lado a lado pasa la mitad del tiempo fuera de pantalla y se pelea con cada párrafo. |
| Reduced motion | **estático** — Se dibuja una vez, terminado y envuelto. Se quita el viaje, no el producto. |

## When to use it

- Contar un producto que se fabrica por pasos
- Webs de industria
- Cuando la página tiene que leerse como una sola escena
