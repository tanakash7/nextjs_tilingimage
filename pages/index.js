import axios from 'axios'
import Head from 'next/head'
import useSWR from 'swr'
import Hero from '../components/Hero'
import Masonry from '../components/Masonry'
import styles from '../styles/Home.module.scss'
import { unsplashInstance } from '../util/axios_unsplash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAsyncPhotos, fetchAsyncMorePhotos, selectPhotos } from '../store/reducers/photosSlice'

import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas, faExternalLinkAlt, faSearch } from "@fortawesome/free-solid-svg-icons"
import { memo, useEffect, useMemo, useState } from 'react'
library.add(fas, faExternalLinkAlt, faSearch)

dom.watch()

export const getServerSideProps = async () => {
  const heroPhoto = await unsplashInstance("/photos/random?count=1&query=landscape").then(res => res.data)
  const data = await unsplashInstance("/photos/random?count=3").then(res => res.data)
  return { props: { data, heroPhoto } }
}

const Home = ({ data, heroPhoto }) => {
  const dispatch = useDispatch()
  const searchedPhotos = useSelector(selectPhotos)
  const [photos, setPhotos] = useState(data)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState("")
  const setFirstPageCount = 2
  const initializePageCount = 1
  const handleChange = (e) => {
    setQuery(e.target.value)
  }
  
  useEffect(()=>{
    if(searchedPhotos.photos.length>0) {
      setPhotos(searchedPhotos.photos)
      setTotalPages(searchedPhotos.total_pages)
    }
  },[dispatch, searchedPhotos])

  const handleSubmit = async(e) => {
    e.preventDefault()
    await dispatch(fetchAsyncPhotos(query))
    setPage(initializePageCount)
  }

  const addMorePhotos = async(e) => {
    e.preventDefault()
    await dispatch(fetchAsyncMorePhotos(query, page))
    if(totalPages <= page) {
      setPage(initializePageCount)
    } else {
      setPage(page+1)
    }
  }
  const button = (() => {
    if(totalPages>page&&searchedPhotos.status==="complete") {
      return (
        <div className={styles.Home__wrapper}>
          <button className={styles.Home__moreButton}
            onClick={addMorePhotos}>
              more
          </button>
        </div>
      )
    }
  })()
  return (
    <>
      <div className={styles.Home__container}>
        <Hero
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          query={query} hero={heroPhoto}
        />
        <Masonry
          photos={photos}
          addMorePhotos={addMorePhotos}
          status={searchedPhotos.status}
        />
        { button }
      </div>
      <div id="Modal"></div>
    </>
  )
}

export default memo(Home)