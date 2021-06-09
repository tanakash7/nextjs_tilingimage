/***********************************************************************

          ref: https://w3bits.com/css-grid-masonry/

***********************************************************************/

import React, { useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Modal } from "./Modal"
import styles from "../styles/Masonry.module.scss"


export const Masonry = ({photos}) => {
  const [modal, setModal] = useState(false)
  const [imgInfo, setImgInfo] = useState(null)
  const itemsRef = useRef([])
  const masonryRef = useRef(null)
  useEffect(()=>{
    const masonryEvents = ["load", "resize"]
    masonryEvents.forEach( event =>  {
      window.addEventListener(event, resizeAllMasonryItems);
    } );
  },[])
  useEffect(()=>{
    itemsRef.current = itemsRef.current.slice(0, photos.length)
  },[photos.length])
  useEffect(()=>{
    resizeAllMasonryItems()
  },[itemsRef])
  useEffect(()=>{
    if(modal) {
      const parent = document.getElementById("Modal")
      return ReactDOM.createPortal(<Modal />, parent)
    }
  },[modal])

  const resizeMasonryItem = item => {
    const grid = masonryRef.current
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"))
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"))
    const rowSpan = Math.ceil(item.firstChild.getBoundingClientRect().height/(rowHeight+rowGap))
    item.style.gridRowEnd = `span ${rowSpan}`
  }
  const resizeAllMasonryItems = () => {
    const allItems = itemsRef.current;
    for(var i=0;i<allItems.length;i++){
      resizeMasonryItem(allItems[i]);
    }
  }
  const handleClick = e => {
    setModal(true)
    setImgInfo(e.target.parentNode.dataset.id)
  }

  const offModal = (e) =>{
    setModal(false)
  }

  const photo = photos.map((photo,i)=>{
    return (
      <div
        key={i}
        className={styles.Masonry__item}
        ref={el => itemsRef.current[i] = el}
        data-id={photo.id}
        onClick={handleClick}
      >
        <img src={photo.urls.small} alt={photo.links.self}/>
      </div>
    )
  })
  return (
    <div className={styles.Masonry} ref={masonryRef}>
      {photo}
      {modal&&<Modal targetId={imgInfo} photos={photos} handleClick={offModal}/>}
    </div>
  )
}