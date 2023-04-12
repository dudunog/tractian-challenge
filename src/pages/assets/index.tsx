import { GetStaticProps } from "next"
import Head from "next/head"
import { Asset } from "@/domain/models"
import { api } from "@/services/api"
import { AssetList } from "@/components"
import styles from "@/pages/home.module.scss"

type HomeProps = {
  assets: Asset[]
  allAssets: Asset[]
}

const Assets = ({ allAssets }: HomeProps) => {
  const amountAssets = allAssets.length
  var totalHealthscore = 0
  var totalPower = 0
  var averageHealthscore = 0
  var averagePower = 0

  allAssets.map(asset => {
    totalHealthscore += asset.healthscore
    if (asset.specifications.power) {
      totalPower += asset.specifications.power
    }
  })

  averageHealthscore = totalHealthscore / amountAssets
  averagePower = totalPower / amountAssets

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Ativos | Tractian</title>
      </Head>

      <section className={styles.Assets}>
        <h2>Métricas</h2>

        <div className={styles.statistics}>
          <div className={styles.statistic}>
            <h2>{amountAssets}</h2>
            <p>Ativos registrados</p>
          </div>

          <div className={styles.statistic}>
            <h2>{averageHealthscore.toFixed()}&#8451</h2>
            <p>Temperatura média</p>
          </div>

          <div className={styles.statistic}>
            <h2>{averagePower}kWh</h2>
            <p>Potência média</p>
          </div>
        </div>
      </section>

      <section className={styles.Assets}>
        <h2>Ativos</h2>

        <AssetList assets={allAssets} />
      </section>
    </div>
  )
}

export default Assets

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("assets")

  const allAssets: Asset[] = data.map(asset => {
    return {
      id: asset.id,
      model: asset.model,
      status: asset.status,
      healthscore: asset.healthscore,
      name: asset.name,
      image: asset.image,
      specifications: asset.specifications,
    }
  })

  return {
    props: {
      allAssets,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}
