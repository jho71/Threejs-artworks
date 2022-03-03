import { useRef, memo } from 'react';
import classnames from 'classnames';

import styles from './index.module.scss';

import Head from '@/components/Head/Head';

const data = require('../data/gallery.json');

type Props = {
  className: string;
};

function Home({ className }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  function artworks() {
    const els = [];
    for (let i = 0; i < data.length; i++) {
      const path = data[i].artist.split(' ').join('-').toLowerCase();
      els.push(
        <li key={i}>
          <a
            href={`./artworks/artwork-${path}/index.html`}
            className={styles.card}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`./artworks/artwork-${path}/thumbnail.jpg`} alt="xxx" />
            <h3>{data[i].title}</h3>
            <p>By {data[i].artist}</p>
            <p>{data[i].description}</p>
            <p>{data[i].tags}</p>
          </a>
        </li>
      );
    }
    return els;
  }

  return (
    <main className={classnames(styles.Home, className)} ref={containerRef}>
      <Head />
      <section className={styles.hero}>
        <h1 className={styles.title}>Generative Art Gallery</h1>
        <ul className={styles.row}>{artworks()}</ul>
      </section>
    </main>
  );
}

export default memo(Home);
