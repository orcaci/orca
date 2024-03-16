import { useEffect, useState } from "react";

export const useResizerObserver = (elementSelector: string) => {
  const [clientHeight, setClientHeight] = useState(0);
  const [clientWidth, setClientWidth] = useState(0);

  useEffect(
    function heightObserveEffect() {
      let element = document.querySelector(elementSelector);
      const observer = new ResizeObserver((entries) => {
        let _height = entries[0].target.clientHeight;
        let _width = entries[0].target.clientWidth;
        setClientHeight(_height);
        setClientWidth(_width);
      });

      if (element) {
        observer.observe(element);
      }

      return () => {
        if (element) {
          observer.unobserve(element);
        }
      };
    },
    [elementSelector]
  );

  return [clientHeight, clientWidth];
};
