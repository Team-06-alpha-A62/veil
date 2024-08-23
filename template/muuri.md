To convert this example into a React project using TypeScript, Tailwind, DaisyUI, and SCSS while maintaining the behavior and design, here’s how you can proceed:

### Project Structure

First, make sure your project is set up with React, TypeScript, Tailwind, DaisyUI, and SCSS. You can install the necessary packages using:

```bash
npm install muuri
npm install react react-dom
npm install tailwindcss daisyui
npm install sass
```

### Code Implementation

Let’s break down the conversion process into separate parts:

1. **React Components**:
2. **SCSS for the custom styling**:
3. **Handling Muuri integration using React hooks**:
4. **Dynamic cloning of items**:

### 1. Setting Up React Components

Here is the converted version of your example using React with TypeScript:

#### `App.tsx`

```tsx
import React, { useEffect, useRef } from 'react';
import Muuri from 'muuri';
import './styles.scss'; // Custom SCSS

const App: React.FC = () => {
  const grid1Ref = useRef<HTMLDivElement | null>(null);
  const grid2Ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const grid1 = new Muuri(grid1Ref.current!, {
      dragEnabled: true,
      dragContainer: document.body,
      dragSort: () => [grid1, grid2],
    });

    const cloneMap: Record<string, any> = {};
    const grid2 = new Muuri(grid2Ref.current!, {
      dragEnabled: true,
      dragContainer: document.body,
      dragSort: true,
    })
      .on('receive', (data: any) => {
        cloneMap[data.item._id] = {
          item: data.item,
          grid: data.fromGrid,
          index: data.fromIndex,
        };
      })
      .on('send', (data: any) => {
        delete cloneMap[data.item._id];
      })
      .on('dragReleaseStart', (item: any) => {
        const cloneData = cloneMap[item._id];
        if (cloneData) {
          delete cloneMap[item._id];

          const clone = cloneData.item
            .getElement()
            .cloneNode(true) as HTMLElement;
          clone.setAttribute('class', 'item');
          clone.children[0].setAttribute('style', '');

          const items = cloneData.grid.add(clone, {
            index: cloneData.index,
            active: false,
          });
          cloneData.grid.show(items);
        }
      });

    return () => {
      grid1.destroy();
      grid2.destroy();
    };
  }, []);

  return (
    <div className="flex justify-evenly mt-5">
      <div
        className="grid grid-1 bg-gray-200 p-5 border-4 border-transparent"
        ref={grid1Ref}
      >
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="item">
            <div className="item-content text-2xl text-white bg-red-500 flex items-center justify-center">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
      <div
        className="grid grid-2 bg-gray-300 p-5 border-4 border-transparent"
        ref={grid2Ref}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="item">
            <div className="item-content text-2xl text-white bg-green-500 flex items-center justify-center">
              {i + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
```

### 2. SCSS Styling

Here’s the `styles.scss` file to manage the custom positioning, styles, and overrides:

```scss
.grid {
  position: relative;
  width: 45%;
}

.item {
  position: absolute;
  width: 100px;
  height: 100px;
  line-height: 100px;
  margin: 5px;
  z-index: 1;
}

.item.muuri-item-hidden {
  z-index: 0;
}

.item.muuri-item-releasing {
  z-index: 2;
}

.item.muuri-item-dragging {
  z-index: 3;
}

.item-content {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 1.875rem; // Tailwind text-2xl equivalent
  cursor: pointer;
}

.grid-2 .item-content {
  background: green;
}

.item.muuri-item-dragging .item-content,
.item.muuri-item-releasing .item-content {
  background: blue;
}
```

### 3. Tailwind and DaisyUI

In the React component, we use Tailwind and DaisyUI classes for the general layout and styling. For instance:

- The `grid` container uses `bg-gray-200`, `p-5`, and `border-4` for styling.
- The `item-content` class uses Tailwind classes like `text-2xl`, `bg-red-500`, and `flex items-center justify-center` to handle positioning and colors.

### 4. Interaction and Cloning

Muuri is integrated inside the `useEffect` hook to manage dragging, sorting, and cloning of items between the two grids.

### Running the Project

After implementing the code, you can run the project using:

```bash
npm start
```

This setup should give you the desired behavior: drag-and-drop functionality with cloning between the two grids, while taking advantage of React, TypeScript, Tailwind, DaisyUI, and SCSS for custom styling.
