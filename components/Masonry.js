/***********************************************************************

          ref: https://w3bits.com/css-grid-masonry/

***********************************************************************/

import React, { memo, useEffect, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { Modal } from "./Modal"
import styles from "../styles/Masonry.module.scss"


const Masonry = ({photos, status, type}) => {
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
    if(!itemsRef.current) {return null}
    itemsRef.current.map((ref, i) => {  
      ref.classList.remove("-loaded")
    })
  },[photos])
  useEffect(()=>{
    if(status==="loading"&&type==="new") {
      itemsRef.current.map((ref, i) => {  
        ref.classList.remove("-loaded")
      })
    } else {
        if(!itemsRef.current) {return null}
        setTimeout(()=>{
          itemsRef.current.map((ref, i) => {
            ref.style.transitionDelay = `${0.1*i}s`
            ref.classList.add("-loaded")
          })
        }, 600)
    }
  },[status,type])
  
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
    const rowSpan = Math.ceil(item.lastChild.getBoundingClientRect().height/(rowHeight+rowGap))
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
    setImgInfo(e.currentTarget.dataset.id)
  }

  const offModal = (e) =>{
    setModal(false)
  }

  const handleImageLoading = (e) => {
    const target = e.currentTarget.parentNode
    resizeMasonryItem(target)
  }
  const photoData = photos.map((photo,i)=>{
    return (
      <div
        key={i}
        className={styles.Masonry__item}
        ref={el => itemsRef.current[i] = el}
        data-id={photo.id}
        onClick={handleClick}
      >
        <div className={styles.Masonry__itemInfo}>
          <div>
            photo by {photo.user.username} <br />
            {photo.downloads&&`downloads: ${photo.download}`}
          </div>
        </div>
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
      const errorText = (()=>{
        if(status==="failed"||status==="idle"&&photos.length===0) {
          return "request overed limit(50 per hour)"
        } else {
          return "try using other words"
        }
      })()
      return (
        <div className={styles.Masonry__failedBox}>
          <div className={styles.Masonry__faildeBoxText}>{errorText}</div>
        </div>
        )
    }
    return (
      <div className={styles.Masonry} ref={masonryRef}>
       { photoData }
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