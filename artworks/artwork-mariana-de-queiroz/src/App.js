import React, { useRef, useCallback, useEffect } from "react";

import { gsap } from "gsap";
import Artwork from "./artwork/artwork";
import styles from "./artwork/gallery.module.scss";

export default function App() {
  const containerRef = useRef();

  const animateInInit = useCallback(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 });
  }, []);

  const animateIn = useCallback(async () => {
    await gsap.to(containerRef.current, {
      duration: 0.5,
      autoAlpha: 1,
      delay: 0.3,
    });
  }, []);

  useEffect(() => {
    animateInInit();
  }, [animateInInit]);

  useEffect(() => {
    animateIn();
  }, [animateIn]);

  return (
    <main className={styles.Landing}>
      <div id="scene-container" className={styles.canvasWrap}>
        <Artwork />
      </div>
      <section className={styles.hero} ref={containerRef}></section>
    </main>
  );
}
