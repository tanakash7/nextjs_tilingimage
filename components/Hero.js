import { memo, useState } from "react"
import styles from "../styles/Hero.module.scss"

const Hero = ({handleChange, handleSubmit, query, hero}) => {
  const style = {
    background: `url(${hero[0].urls.raw}) no-repeat center/cover`
  }
  return (
    <div className={styles.Hero} style={style}>
      <form className={styles.Hero__searchArea} onSubmit={handleSubmit}>
        <button type="submit" className={styles.Hero__submitButton}>
            <i className="fas fa-search"></i>
        </button>
        <input
          className={styles.Hero__searchInput}
          type="search"
          placeholder="search photo"
          autoComplete="red"
          value={query}
          onChange={handleChange}
        />
      </form>
    </div>
  )
}

export default memo(Hero)