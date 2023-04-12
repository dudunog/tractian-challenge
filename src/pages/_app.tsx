import { Header, Menu } from "@/components"
import styles from "@/styles/app.module.scss"
import "@/styles/global.scss"

const MyApp = ({ Component, pageProps }) => {
  return (
    <div className={styles.wrapper}>
      <Menu />
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default MyApp
