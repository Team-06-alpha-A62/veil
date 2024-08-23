import React, { useEffect, useRef } from 'react';
import Muuri from 'muuri';
import './Dashboard.scss'; // Custom SCSS
import { FaPlus } from 'react-icons/fa';

const Dashboard: React.FC = () => {
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
    <>
      <div className="drawer drawer-end z-10">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn btn-primary"
          >
            <FaPlus />
            Add Widget
          </label>
        </div>
        <div className="drawer-side ">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-1/3 p-4">
            {/* Sidebar content here */}
            <div
              className="grid grid-1 bg-gray-200 p-5 border-4 border-transparent"
              ref={grid1Ref}
            >
              {Array.from({ length: 4 }, (_, i) => (
                <div
                  key={i}
                  className="item"
                  style={{
                    width: `${100 * (i + 1)}px`,
                    height: `${100 * (i + 1)}px`,
                  }}
                >
                  <div className="item-content text-2xl text-white bg-red-500 flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </ul>
        </div>
      </div>
      <div className="flex justify-evenly mt-5">
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
    </>
  );
};

export default Dashboard;
