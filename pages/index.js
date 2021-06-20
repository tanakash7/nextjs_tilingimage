import axios from 'axios'
import Head from 'next/head'
import useSWR from 'swr'
import { Hero } from '../components/Hero'
import { Masonry } from '../components/Masonry'
import styles from '../styles/Home.module.scss'
import { unsplashInstance } from '../util/axios_unsplash'
import { config, dom, library } from '@fortawesome/fontawesome-svg-core';
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons"
library.add(faExternalLinkAlt)

dom.watch()

export const getServerSideProps = async () => {
  const data = await unsplashInstance("/photos/random?count=30").then(res => res.data)
  return { props: { data } }
}

export default function Home({ data }) {
  return (
    <>
      <div className={styles.container}>
        <Hero />
        <Masonry photos={data} />
      </div>
      <div id="Modal"></div>
    </>
  )
}
