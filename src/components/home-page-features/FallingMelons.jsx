import React, { useEffect, useState } from "react";

const FallingMelons = () => {
  const [melons, setMelons] = useState([]);
  const maxMelons = 8;

  useEffect(() => {
    const createMelon = () => {
      if (melons.length < maxMelons) {
        const newMelon = {
          id: Math.random(),
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 1 + 1}s`,
        };
        setMelons(prev => [...prev, newMelon]);
        setTimeout(() => {
          setMelons(prev => prev.filter(m => m.id !== newMelon.id));
        }, parseFloat(newMelon.animationDuration) * 1000);
      }
    };

    const interval = setInterval(createMelon, 1000);
    return () => clearInterval(interval);
  }, [melons.length]);

  return (
    <div className="relative inset-0 pointer-events-none z-10">
      {melons.map(melon => (
        <span
          key={melon.id}
          className="absolute animate-fall h-[70px] w-[70px] rounded-full"
          style={{
            left: melon.left,
            top: '-10px',
            animationDuration: melon.animationDuration,
          }}
        >
          <img width={70} height={70} src="/melon.png" alt="melon" />
        </span>
      ))}
    </div>
  );
};

export default FallingMelons;