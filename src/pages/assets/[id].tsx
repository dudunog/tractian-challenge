import { GetStaticPaths, GetStaticProps } from "next"
import Image from "next/image"
import Head from "next/head"
import Link from "next/link"
import { Asset } from "@/domain/models"
import { api } from "@/services/api"
import Highcharts from "highcharts"
import highchartsMore from "highcharts/highcharts-more.js"
import solidGauge from "highcharts/modules/solid-gauge.js"
import HighchartsReact from "highcharts-react-official"
import { FiChevronLeft, FiEdit2 } from "react-icons/fi"
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import styles from "./asset.module.scss"

type AssetProps = {
  asset: Asset
}

if (typeof Highcharts === "object") {
  highchartsMore(Highcharts)
  solidGauge(Highcharts)
}

const updatePowerChart = (power) => {
  return {
    chart: {
      backgroundColor: "#f7f8fa",
      type: "solidgauge",
      width: 300,
      height: 300,
    },
    title: null,
    credits: false,
    pane: {
      center: ["50%", "85%"],
      size: "100%",
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#f7f8fa",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
      },
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max: 8,
      stops: [
        [0.1, "#55BF3B"],
        [0.5, "#DDDF0D"],
        [0.9, "#DF5353"],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
      },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true,
        },
      },
    },
    series: [
      {
        name: "Speed",
        data: [power],
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<h2 style="font-size:1.8rem; margin-bottom: -0.9rem">{y}</h2><br/>' +
            '<p style="font-size:0.9rem; opacity:0.4">kWh</p>' +
            "</div>",
        },
      },
    ],
  }
}

const updateRPMChart = (rpm) => {
  return {
    chart: {
      backgroundColor: "#f7f8fa",
      type: "solidgauge",
      width: 300,
      height: 300,
    },
    title: null,
    credits: false,
    pane: {
      center: ["50%", "85%"],
      size: "100%",
      startAngle: -90,
      endAngle: 90,
      background: {
        backgroundColor: "#f7f8fa",
        innerRadius: "60%",
        outerRadius: "100%",
        shape: "arc",
      },
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
    yAxis: {
      min: 0,
      max: 3000,
      stops: [
        [0.1, "#55BF3B"],
        [0.5, "#DDDF0D"],
        [0.9, "#DF5353"],
      ],
      lineWidth: 0,
      tickWidth: 0,
      minorTickInterval: null,
      tickAmount: 2,
      labels: {
        y: 16,
      },
    },
    plotOptions: {
      solidgauge: {
        dataLabels: {
          y: 5,
          borderWidth: 0,
          useHTML: true,
        },
      },
    },
    series: [
      {
        name: "Speed",
        data: [rpm],
        dataLabels: {
          format:
            '<div style="text-align:center">' +
            '<h2 style="font-size:1.8rem; margin-bottom: -0.9rem">{y}</h2><br/>' +
            '<p style="font-size:0.9rem; opacity:0.4">RPM</p>' +
            "</div>",
        },
      },
    ],
  }
}

const Asset = ({ asset }: AssetProps) => {
  const assetModel = asset.model
    .substring(0, 1)
    .toUpperCase()
    .concat(asset.model.substring(1))

  return (
    <div className={styles.assetContainer}>
      <div className={styles.asset}>
        <Head>
          <title>{asset.name} | Tractian</title>
        </Head>
        <div className={styles.header}>
          <div className={styles.thumbnailContainer}>
            <Link href="/assets">
              <button type="button">
                <FiChevronLeft size={30} color="#fff" title="Voltar" />
              </button>
            </Link>
            <Image
              width={300}
              height={350}
              src={asset.image}
              alt={assetModel}
              style={{ objectFit: "cover" }}
            />
            <Link href={`/assets/edit/${asset.id}`}>
              <button type="button">
                <FiEdit2 size={20} color="#fff" title="Editar" />
              </button>
            </Link>
          </div>
          <div className={styles.assetDetails}>
            <header>
              <h1>{asset.name}</h1>
              <span>
                {assetModel}
              </span>
              <span>
                {asset.status == "inAlert"
                  ? "Em Alerta"
                  : asset.status == "inDowntime"
                  ? "Em Parada"
                  : "Em Operação"}
              </span>
              <span>{asset.unitName}</span>
              <span>{asset.companyName}</span>
            </header>
            <div className={styles.contentAssetDetails}>
              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <h2>{asset.healthscore}%</h2>
                  <p>Saúde</p>
                </div>

                <div className={styles.metric}>
                  <h2>{asset.specifications.maxTemp}&#8451;</h2>
                  <p>Temperatura</p>
                </div>

                <div className={styles.metric}>
                  <h2>{asset.sensors[0]}</h2>
                  <p>Sensor</p>
                </div>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <h2>{asset.metrics.totalUptime.toFixed(2)}</h2>
                  <p style={{ alignItems: "center" }}>Coletas uptime</p>
                </div>

                <div className={styles.metric}>
                  <h2>{asset.metrics.totalCollectsUptime}h</h2>
                  <p style={{ alignItems: "center" }}>
                    Horas de coletas uptime
                  </p>
                </div>
              </div>

              <div className={styles.metrics}>
                <div className={styles.metric}>
                  <h2>{asset.lastUptimeAt}</h2>
                  <p style={{ alignItems: "center" }}>
                    Data da última coleta uptime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.content}>
          {asset.specifications.power ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={updatePowerChart(asset.specifications.power)}
              allowChartUpdate={[true, true, true]}
            />
          ) : (
            <p className={styles.err}>
              Métricas de potência não especificadas para este ativo
            </p>
          )}

          {asset.specifications.rpm ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={updateRPMChart(asset.specifications.rpm)}
              allowChartUpdate={[true, true, true]}
            />
          ) : (
            <p className={styles.err}>
              Métricas de RPM não especificadas para este ativo
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Asset

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get<any[]>("assets")
  const latestAssets = data.slice(0, 2)

  const paths = latestAssets.map(asset => {
    return {
      params: {
        id: asset.id.toString(),
      },
    }
  })

  return {
    paths,
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ctx => {
  const { id } = ctx.params
  const { data } = await api.get("assets")

  const result = data.find(asset => asset.id == id)

  const getNameUnit = async (id: number) => {
    const { data } = await api.get("units/", {
      params: {
        id,
      },
    })

    return data[0].name
  }

  const getNameCompany = async (id: number) => {
    const { data } = await api.get("companies", {
      params: {
        id,
      },
    })

    return data[0].name
  }

  const asset: Asset = {
    id: result.id,
    sensors: result.sensors,
    model: result.model,
    status: result.status,
    healthscore: result.healthscore,
    name: result.name,
    image: result.image,
    specifications: result.specifications,
    metrics: result.metrics,
    lastUptimeAt: format(parseISO(result.metrics.lastUptimeAt), "d MMM yy", {
      locale: ptBR,
    }),
    unitName: await getNameUnit(result.unitId),
    companyName: await getNameCompany(result.companyId),
  }

  return {
    props: {
      asset,
    },
    revalidate: 60 * 60 * 24,
  }
}
