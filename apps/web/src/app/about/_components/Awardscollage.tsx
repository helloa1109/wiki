'use client'

import Image from 'next/image'
import styles from './AwardsCollage.module.css'

const AW = [
  { src: 'https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?w=400&q=80', cls: 'aw1' },
  { src: 'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=480&q=80', cls: 'aw2' },
  { src: 'https://images.unsplash.com/photo-1481487196290-c152efe083f5?w=440&q=80', cls: 'aw3' },
  { src: 'https://images.unsplash.com/photo-1545665277-5937489579f2?w=520&q=80', cls: 'aw4' },
  { src: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=480&q=80', cls: 'aw5' },
  { src: 'https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&q=80', cls: 'aw6' },
  { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b8?w=360&q=80', cls: 'aw7' },
  { src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80', cls: 'aw8' },
] as const

export function AwardsCollage() {
  return (
    <section className={styles.awards}>
      <div className={styles.collage} aria-hidden="true">
        {AW.map((a) => (
          <div key={a.cls} className={`${styles.awThumb} ${styles[a.cls]}`}>
            <Image src={a.src} alt="" fill sizes="240px" />
          </div>
        ))}
      </div>

      <div className={styles.title}>
        <h2>
          <em>Selected</em> Works
        </h2>
        <div className={styles.total}>
          <span>Total Projects</span>
          <span className={styles.count}>28</span>
        </div>
      </div>
    </section>
  )
}
