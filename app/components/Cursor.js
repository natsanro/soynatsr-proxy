'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot  = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;
    let raf;

    const onMove = (e) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);

    const onEnter = (e) => { if (e.target.closest('a, button')) ring.classList.add('hovered'); };
    const onLeave = (e) => { if (e.target.closest('a, button')) ring.classList.remove('hovered'); };
    document.addEventListener('mouseover', onEnter);
    document.addEventListener('mouseout', onLeave);

    const loop = () => {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onEnter);
      document.removeEventListener('mouseout', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef} />
      <div className="cursor-ring" ref={ringRef} />
    </>
  );
}
