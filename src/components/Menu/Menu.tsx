import Image from "next/image";

import "rc-slider/assets/index.css";

import styles from "./styles.module.scss";

export function Menu() {
  return (
    <div className={styles.menuContainer}>
      <header>
        <nav className={styles.nav}>
          <a href="/">
            <img
              src="/Logo-Tractian.svg"
              alt="Logo Tractian"
              width="160"
              height="50"
            />
          </a>

          <ul>
            <li>
              <a href="/assets">
                <b>Ativos</b>
              </a>
            </li>
            <li>
              <a href="/units">
                <b>Unidades</b>
              </a>
            </li>
            <li>
              <a href="/companies">
                <b>Empresas</b>
              </a>
            </li>
            <li>
              <a href="/users">
                <b>Usuários</b>
              </a>
            </li>
          </ul>
          <section>
            <div className={styles.images}>
              <Image
                width={800}
                height={700}
                src={
                  "https://imgix.tractian.com/images/icon-maintence-pump.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={800}
                height={700}
                src={
                  "https://imgix.tractian.com/images/icon-maintence-online.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={800}
                height={700}
                src={
                  "https://imgix.tractian.com/images/icon-maintence-horimeter.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={800}
                height={700}
                src={
                  "https://imgix.tractian.com/images/icon-maintence-plataform.svg?auto=format&fit=max&w=256"
                }
              />
            </div>
          </section>
        </nav>
      </header>
    </div>
  );
}
