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

function updateAssetChart(healthscore) {
  return {
    chart: {
      renderTo: "container",
      type: "bar",
      width: 440,
      height: 80,
    },
    title: {
      text: null,
    },
    credits: false,
    legend: false,
    tooltip: {
      enabled: true,
      backgroundColor: "white",
      borderColor: "#e6e8eb",
      borderRadius: 10,
      headerFormat: "",
      pointFormat:
        "<tr><td>{series.name}: </td>" + "<td><b>{point.y}</b></td></tr>",
      valueSuffix: "%",
      style: {
        marginBottom: 100,
      },
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: false,
        },
        borderWidth: 0,
        borderRadius: 0,
      },
      followTouchMove: true,
    },
    navigation: {
      buttonOptions: {
        enabled: true,
      },
    },
    xAxis: {
      visible: false,
    },
    yAxis: {
      visible: false,
      min: 0,
      max: 100,
      gridLineWidth: 0,
      labels: {
        y: -2,
      },
    },
    series: [
      {
        name: "Saúde máxima",
        data: [100],
        color: "#e7eaf3",
        grouping: false,
        enableMouseTracking: true,
      },
      {
        name: "Saúde do ativo",
        data: [healthscore],
        color: "#2ecc71",
        dataLabels: {
          enabled: false,
          inside: true,
          align: "center",
          format: "{point.y}%",
          style: {
            color: "white",
            textOutline: false,
          },
        },
      },
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 200,
          },
          chartOptions: {
            legend: {
              enabled: false,
            },
          },
        },
      ],
    },
  }
}

export default function Home({ allAssets }: HomeProps) {
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

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("assets", {
    params: {},
  })

  const allAssets = data.map(asset => {
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
