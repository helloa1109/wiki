import styles from './Outro.module.css'

export function Outro() {
  return (
    <section className={styles.outro}>
      <span className={styles.eyebrow}>together</span>
      <p className={styles.quote}>
        비슷한 사람은 있어도 <em>같은 팀은 없다</em>.
      </p>
      <a className={styles.cta} href="mailto:hello@dbc.team">
        함께 일하기
        <span className={styles.ctaArrow}>→</span>
      </a>
    </section>
  )
}
