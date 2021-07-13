import Head from 'next/head'
import Hero from '../components/Hero'
import Masonry from '../components/Masonry'
import { Footer } from '../components/Footer'
import styles from '../styles/Home.module.scss'
import { unsplashInstance } from '../util/axios_unsplash'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAsyncPhotos, fetchAsyncMorePhotos, selectPhotos } from '../store/reducers/photosSlice'

import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import { fas, faExternalLinkAlt, faSearch } from "@fortawesome/free-solid-svg-icons"
import { memo, useEffect, useState } from 'react'
library.add(fas, faExternalLinkAlt, faSearch)

dom.watch()

export const getServerSideProps = async () => {
  try {
    const heroPhoto = await unsplashInstance("/photos/random?count=1&query=landscape&w=1920&h=1080").then(res => res.data)
    const data = await unsplashInstance("/photos/random?count=20").then(res => res.data)
    return { props: { data, heroPhoto } }
  } catch (error) {
    const data = []
    const heroPhoto = null
    return { props: { data, heroPhoto } }
  }
}

const Home = ({ data, heroPhoto }) => {
  const dispatch = useDispatch()
  const searchedPhotos = useSelector(selectPhotos)
  const initialObj = { "page": 1, "data": data }
  const [photos, setPhotos] = useState([initialObj])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState("idle")
  const [query, setQuery] = useState("")
  const initializePageCount = 1
  const handleChange = (e) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    if (searchedPhotos.photos.length > 0) {
      setPhotos(searchedPhotos.photos)
      setTotalPages(searchedPhotos.total_pages)
      setStatus(searchedPhotos.status)
    }
  }, [dispatch, searchedPhotos])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query) { return null }
    await dispatch(fetchAsyncPhotos(query))
    setPage(initializePageCount)
  }

  const addMorePhotos = async (e) => {
    e.preventDefault()
    const newPage = +e.currentTarget.dataset.page
    setPage(newPage)
    await dispatch(fetchAsyncMorePhotos({ query, newPage }))
  }
  const button = (() => {
    if (status === "idle" || !query) { return null }
    const buttonList = []
    const handleClick = (e) => {
      addMorePhotos(e)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
    let pageList = [page]
    for (let i = page - 1; i > 0; i--) {
      if (pageList.length < 9) {
        pageList = [i, ...pageList]
      }
    }
    for (let i = page + 1; i <= totalPages && pageList.length < 10; i++) {
      pageList = [...pageList, i]
    }
    pageList.map((pageNum, i) => {
      const currentTarget = pageNum === page ? "--current" : ""
      buttonList.push(
        <li
          key={i}
          className={`${styles.Home__pageNationItem} ${currentTarget}`}
          data-page={pageNum}
          onClick={handleClick}
        >{pageNum}</li>
      )
    })

    return (
      <div className={styles.Home__wrapper}>
        <ul className={styles.Home__pageNation}>
          {buttonList}
        </ul>
      </div>
    )
  })()
  const targetData = photos.filter(val => (val.page === page))
  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className={styles.Home__container}>
        <Hero
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          query={query} hero={heroPhoto}
        />
        {targetData.length > 0 &&
          <Masonry
            photos={targetData[0].data}
            status={status}
            page={page}
            type={searchedPhotos.type}
            totalPages={totalPages}
          />
        }
        {button}
      </div>
      <div id="Modal"></div>
      <Footer />
    </>
  )
}

export default memo(Home)