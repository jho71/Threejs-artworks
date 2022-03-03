import React, { useRef, useCallback, useEffect } from "react";

import { gsap } from "gsap";
import Artwork from "./artwork/artwork";
import styles from "./artwork/gallery.module.scss";

export default function App() {
  const containerRef = useRef();
  const containerRef2 = useRef();
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
      <div id="scene-container" className={styles.amna}>
        <Artwork />
      </div>
      <section id="title" className={styles.ml12} ref={containerRef}>
        A Thousand Splendid Suns
      </section>
      <audio
        autoPlay
        loop
        src="../../assets/piano.ogg"
        type="audio/ogg"
      ></audio>
      <section
        id="quote"
        className={styles.ml12quote}
        ref={containerRef2}
      ></section>
    </main>
  );
}
