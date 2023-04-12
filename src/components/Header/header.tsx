import format from "date-fns/format"
import ptBR from "date-fns/locale/pt-BR"
import styles from "./styles.module.scss"

const Header: React.FC = () => {
  const currentDate = format(new Date(), "EEEEEE, d MMMM", {
    locale: ptBR,
  })

  return (
    <header className={styles.headerContainer}>
      <h1>Dasboard</h1>

      <span>{currentDate}</span>
    </header>
  )
}

export default Header
