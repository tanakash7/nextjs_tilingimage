/***********************************************************************

          ref: https://w3bits.com/css-grid-masonry/

***********************************************************************/

import React, { memo, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Modal } from "./Modal"
import styles from "../styles/Masonry.module.scss"


const Masonry = ({photos, status}) => {
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
  },[photos])

  useEffect(()=>{
    if(status==="loading") {
      itemsRef.current.map((ref, i) => {  
        ref.classList.remove("-loaded")
      })
    } else {
      setTimeout(()=>{
        itemsRef.current.map((ref, i) => {
          ref.style.transitionDelay = `${0.1*i}s`
          ref.classList.add("-loaded")
        })
      },400)
    }
  },[status])
  
  useEffect(()=>{
    if(modal) {
      const parent = document.getElementById("Modal")
      return ReactDOM.createPortal(<Modal />, parent)
    }
  },[modal])

  const resizeMasonryItem = (item) => {
    if(!masonryRef.current) return null
    const grid = masonryRef.current
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-row-gap"))
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue("grid-auto-rows"))
    const rowSpan = Math.ceil(item.firstChild.getBoundingClientRect().height/(rowHeight+rowGap))
    item.style.gridRowEnd = `span ${rowSpan}`
  }
  const resizeAllMasonryItems = () => {
    const allItems = itemsRef.current;
    if(allItems.length===0) { return null }
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

  const handleImageLoading = (e) => {
    const target = e.currentTarget.parentNode
    resizeMasonryItem(target)
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
        <img
          src={photo.urls.small}
          alt={photo.links.self}
          onLoad={handleImageLoading}
        />
      </div>
    )
  })
  const showSearchResult = (() => {
    if(status==="failed"||photos.length===0) {
      const errorText = status==="failed" ? "request overed limit(50 per hour)" : "try using other words"
      return (
        <div className={styles.Masonry__failedBox}>
          <div className={styles.Masonry__faildeBoxText}>{errorText}</div>
        </div>
        )
    }
    return (
      <div className={styles.Masonry} ref={masonryRef}>
       { photo }
      </div>
    )
  })()
  return (
    <div className={styles.Masonry__wrapper}>
      { showSearchResult }
      { modal&&<Modal targetId={imgInfo} photos={photos} handleClick={offModal}/> }
    </div>
  )
}

export default memo(Masonry)