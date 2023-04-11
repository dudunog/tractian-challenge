import Image from "next/image"
import Link from "next/link"
import styles from "./styles.module.scss"
import "rc-slider/assets/index.css"

export const Menu = () => {
  return (
    <div className={styles.menuContainer}>
      <header>
        <nav className={styles.nav}>
          <Link href="/">
            <Image
              width={160}
              height={50}
              src="/Logo-Tractian.svg"
              alt="Logo Tractian"
            />
          </Link>

          <ul>
            <li>
              <Link href="/assets">Ativos</Link>
            </li>
            <li>
              <Link href="/units">Unidades</Link>
            </li>
            <li>
              <Link href="/companies">Empresas</Link>
            </li>
            <li>
              <Link href="/users">Usuários</Link>
            </li>
          </ul>
          <section>
            <div className={styles.images}>
              <Image
                width={70}
                height={70}
                alt="Ativos"
                src={
                  "https://imgix.tractian.com/images/icon-maintence-pump.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={70}
                height={70}
                alt="Unidades"
                src={
                  "https://imgix.tractian.com/images/icon-maintence-online.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={70}
                height={70}
                alt="Empresas"
                src={
                  "https://imgix.tractian.com/images/icon-maintence-horimeter.svg?auto=format&fit=max&w=256"
                }
              />
              <Image
                width={70}
                height={70}
                alt="Usuários"
                src={
                  "https://imgix.tractian.com/images/icon-maintence-plataform.svg?auto=format&fit=max&w=256"
                }
              />
            </div>
          </section>
        </nav>
      </header>
    </div>
  )
}
