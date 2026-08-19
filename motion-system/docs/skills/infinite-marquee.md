# Tira infinita

`infinite-marquee` · Tira infinita · básico

Tira que gira sin costura, en CSS puro, y se para al pasar el cursor.

## Source reference

> Marquee: CSS infinite scroll, pauses on hover · BUILT WITH AI · NOT BY AI ·

## Implementation

- **Export:** `Tira infinita`
- **Technology:** CSS · React
- **Performance cost:** nulo

## Usage

```tsx
<Marquee speed={26} reverse pauseOnHover>{items}</Marquee>
```

## Behaviour by context

| Context | Behaviour |
| --- | --- |
| Desktop | La tira se duplica exactamente una vez y se desplaza la mitad; la copia se oculta a los lectores de pantalla para que no se lea dos veces. |
| Tablet | Igual que en escritorio. |
| Mobile | **igual** — Lo resuelve el compositor fuera del hilo principal: de los pocos efectos que no cuestan nada en un móvil. |
| Reduced motion | **estático** — Se convierte en una tira que se desliza a mano. Las palabras eran lo importante; el movimiento era adorno. |

## When to use it

- Logotipos de clientes
- Tiras de mensaje
- Listas de servicios
