import axios from 'axios'
import Head from 'next/head'
import useSWR from 'swr'
import { Hero } from '../components/Hero'
import { Masonry } from '../components/Masonry'
import styles from '../styles/Home.module.scss'
import { unsplashInstance } from '../util/axios_unsplash'

export const getServerSideProps = async() => {
  const data = await unsplashInstance("/photos/random?count=16").then(res => res.data)
  return {props: {data}}
}

export default function Home({data}) {
  return (
    <>
    <div className={styles.container}>
      <Head>
        <script src="https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js"></script>
      </Head>
      <Hero />
      <Masonry photos={data}/>
    </div>
    <div id="Modal"></div>
    </>
  )
}
