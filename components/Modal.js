import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import styles from "../styles/Modal.module.scss"

export const Modal = ({ targetId, photos, handleClick }) => {
  const [photo, setPhoto] = useState(null)
  useEffect(() => {
    const target = photos.filter(data => {
      return data.id === targetId
    })
    setPhoto(target[0])
  }, [targetId])
  const stopPropagation = e => {
    e.stopPropagation()
  }
  const element = (
    <>
      <div className={styles.Modal__background}></div>
      <div className={styles.Modal__inner} onClick={handleClick}>
        <div className={styles.Modal__contents} onClick={stopPropagation}>
          {photo && (
            <>
              <div className={styles.Modal__img}>
                <img src={photo.urls.small} alt={photo.urls.small} />
              </div>
              <div className={styles.Modal__desc}>{photo.description}</div>
              <div className={styles.Modal__download}>
                <a
                  href={photo.links.html}
                  target="_blank"
                  className={styles.Modal__downloadButton}>
                  <span className={styles.Modal__downloadButtonText}>DOWNLOAD</span><i className="fas fa-external-link-alt"></i>
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )

  return ReactDOM.createPortal(
    element,
    document.getElementById("Modal")
  )
}