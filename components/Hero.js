import { memo, useRef, useState } from "react"
import styles from "../styles/Hero.module.scss"
import Image from "next/image"

const Hero = ({handleChange, handleSubmit, query, hero}) => {
  return (
    <div className={styles.Hero}>
      <div className={styles.Hero__background}>
        <Image
          src={hero?hero[0].urls.raw:"/star.jpg"}
          alt="hero image"
          // width={1920}
          // height={1080}
          layout="fill"
          objectFit={"cover"}
          objectPosition={"50% 50%"}
        />
      </div>
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