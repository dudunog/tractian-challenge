import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { AssetList } from "@/components"
import { api } from "@/services/api"
import Highcharts from "highcharts"
import HighchartsReact from "highcharts-react-official"
import styles from "./home.module.scss"
import "antd/dist/reset.css"

type Asset = {
  id: string
  sensors: Sensors
  model: string
  status: string
  healthscore: number
  name: string
  image: string
  metrics: Metrics
  specifications: Specifications
  unitId: string
  companyId: string
  lastUptimeAt: string
}

type Sensors = {
  "0": string
}

type Metrics = {
  totalCollectsUptime: number
  totalUptime: number
  lastUptimeAt: string
}

type Specifications = {
  rpm?: number
  maxTemp: number
  power?: number
}

type HomeProps = {
  assets: Asset[]
  latestAssets: Asset[]
  allAssets: Asset[]
}

function updateHealthChart(statusInAlert, statusInDowntime, statusInOperation) {
  return {
    chart: {
      backgroundColor: "#f7f8fa",
      plotBorderWidth: null,
      plotShadow: false,
      //renderTo: "container",
      type: "pie",
      width: 440,
      height: 300,
    },
    title: {
      text: null,
    },
    credits: false,
    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
      //valueSuffix: "",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Percentual",
        colorByPoint: true,
        color: "#e7eaf3",
        data: [
          {
            name: "Em alerta",
            y: statusInAlert,
          },
          {
            name: "Em parada",
            y: statusInDowntime,
          },
          {
            name: "Em operação",
            y: statusInOperation,
          },
        ],
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

export default function Home({ latestAssets, allAssets }: HomeProps) {
  var statusInAlert = 0
  var statusInDowntime = 0
  var statusInOperation = 0
  var amountAssets = allAssets.length
  var totalHealthscoreInAlert = 0
  var totalHealthscoreInDowntime = 0
  var totalHealthscoreInOperation = 0
  var totalPower = 0
  var averageHealthscoreInAlert = 0
  var averageHealthscoreInDowntime = 0
  var averageHealthscoreInOperation = 0
  var averagePower = 0

  allAssets.map(asset => {
    if (asset.status == "inAlert") {
      statusInAlert += 1
      totalHealthscoreInAlert += asset.specifications.maxTemp
    } else if (asset.status == "inDowntime") {
      statusInDowntime += 1
      totalHealthscoreInDowntime += asset.specifications.maxTemp
    } else {
      statusInOperation += 1
      totalHealthscoreInOperation += asset.specifications.maxTemp
    }
  })

  averageHealthscoreInAlert = totalHealthscoreInAlert / statusInAlert
  averageHealthscoreInDowntime = totalHealthscoreInDowntime / statusInDowntime
  averageHealthscoreInOperation =
    totalHealthscoreInOperation / statusInOperation

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Tractian</title>
      </Head>

      <section className={styles.Assets}>
        <div className={styles.statusCharts}>
          <div className={styles.chart}>
            <h2>Saúde dos ativos</h2>
            <HighchartsReact
              highcharts={Highcharts}
              options={updateHealthChart(
                statusInAlert,
                statusInDowntime,
                statusInOperation
              )}
              allowChartUpdate={[true, true, true]}
            />
          </div>

          <div className={styles.chart}>
            <h2>Temperatura média</h2>

            <div className={styles.statistics}>
              <div className={styles.statistic}>
                <h2>{averageHealthscoreInOperation.toFixed()}&#8451</h2>
                <p>Ativos em operação</p>
              </div>

              <div className={styles.statistic}>
                <h2>{averageHealthscoreInAlert.toFixed()}&#8451</h2>
                <p>Ativos em alerta</p>
              </div>

              <div className={styles.statistic}>
                <h2>{averageHealthscoreInDowntime.toFixed()}&#8451</h2>
                <p>Ativos em parada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.Assets}>
        <h2>Ativos</h2>

        <AssetList assets={latestAssets} />

        <div className={styles.aEspecific}>
          <Link href="/assets">Ver mais</Link>
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  //Biblioteca axios para fazer requisições HTTP
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
      unitId: asset.unitId,
    }
  })

  const latestAssets = allAssets.slice(0, 2)

  return {
    props: {
      latestAssets,
      allAssets,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  }
}
