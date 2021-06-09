import { useEffect, useState } from "react"
import ReactDOM from "react-dom"
import styles from "../styles/Modal.module.scss"

export const Modal = ({targetId, photos, handleClick}) => {
  console.log("Modal")
  const [photo, setPhoto] = useState(null)
  useEffect(()=>{
    const target = photos.filter(data=>{
      return data.id === targetId
    })
    setPhoto(target[0])
  },[targetId])
  const stopPropagation = e => {
    e.stopPropagation()
  }
  const element = (
    <>
      <div className={styles.Modal__background}></div>
      <div className={styles.Modal__inner} onClick={handleClick}>
        <div className={styles.Modal__contents} onClick={stopPropagation}>
          {photo&&(
            <>
              <div>{photo.alt_description}</div>
              <div><img src={photo.urls.regular} alt=""/></div>
              {/* flexで囲って右側にリンク（spは縦に並べる） */}
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