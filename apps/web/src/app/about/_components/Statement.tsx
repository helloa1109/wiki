import styles from './Statement.module.css'

export function Statement() {
  return (
    <section className={styles.statement}>
      <p>
        UI/UX 기획자가 남기는 <em>작업 회고</em>와 디자인 노트가
        <br />
        천천히 쌓이는 공간입니다.
      </p>
    </section>
  )
}
