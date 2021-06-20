import styles from "../styles/Hero.module.scss"

export const Hero = () => {
  console.log(styles)
  return (
    <div className={styles.Hero}>
      検索エリア
      <input
        id="search"
        type="search"
        placeholder="海"
      ></input>
    </div>
  )
}