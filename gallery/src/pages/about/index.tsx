import { memo, useRef } from 'react';
import classnames from 'classnames';

import styles from './index.module.scss';

import Head from '@/components/Head/Head';

type Props = {
  className: string;
};

function About({ className }: Props) {
  const containerRef = useRef<HTMLElement>(null);

  return (
    <main className={classnames(styles.About, className)} ref={containerRef}>
      <Head title="About" />
      <h1 className={styles.title}>About</h1>
      <p>
        The Generative Art Gallery showcases all the artworks created by particpants of the Generative Art Training
        Project at Jam3.
      </p>
      <p>If you would like to take part or become involved in this project please reach out to Amelie or Peter.</p>
    </main>
  );
}

export default memo(About);
