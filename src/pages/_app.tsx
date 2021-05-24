import "../styles/global.scss";

import { Header } from "../components/Header";
import { Menu } from "../components/Menu/Menu";

import styles from "../styles/app.module.scss";

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

export default MyApp;
