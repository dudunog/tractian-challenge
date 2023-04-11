import { Header } from "../components/header/header"
import { Menu } from "../components/menu/menu"

import styles from "../styles/app.module.scss"
import "../styles/global.scss"

function MyApp({ Component, pageProps }) {
  return (
    <div className={styles.wrapper}>
      <Menu />
      <main>
        <Header />
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default MyApp
