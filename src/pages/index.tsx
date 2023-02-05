import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

import { api } from "../services/api";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { FiAlertCircle, FiAlertTriangle, FiActivity } from "react-icons/fi";

import styles from "./home.module.scss";

import { Tag, Progress } from "antd";
import "antd/dist/antd.css";

type Asset = {
  id: string;
  sensors: Sensors;
  model: string;
  status: string;
  healthscore: number;
  name: string;
  image: string;
  metrics: Metrics;
  specifications: Specifications;
  unitId: string;
  companyId: string;
  lastUptimeAt: string;
};

type Sensors = {
  "0": string;
};

type Metrics = {
  totalCollectsUptime: number;
  totalUptime: number;
  lastUptimeAt: string;
};

type Specifications = {
  rpm?: number;
  maxTemp: number;
  power?: number;
};

type HomeProps = {
  assets: Asset[];
  latestAssets: Asset[];
  allAssets: Asset[];
};

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
  };
}

export default function Home({ latestAssets, allAssets }: HomeProps) {
  var statusInAlert = 0;
  var statusInDowntime = 0;
  var statusInOperation = 0;
  var amountAssets = allAssets.length;
  var totalHealthscoreInAlert = 0;
  var totalHealthscoreInDowntime = 0;
  var totalHealthscoreInOperation = 0;
  var totalPower = 0;
  var averageHealthscoreInAlert = 0;
  var averageHealthscoreInDowntime = 0;
  var averageHealthscoreInOperation = 0;
  var averagePower = 0;

  allAssets.map(asset => {
    if (asset.status == "inAlert") {
      statusInAlert += 1;
      totalHealthscoreInAlert += asset.specifications.maxTemp;
    } else if (asset.status == "inDowntime") {
      statusInDowntime += 1;
      totalHealthscoreInDowntime += asset.specifications.maxTemp;
    } else {
      statusInOperation += 1;
      totalHealthscoreInOperation += asset.specifications.maxTemp;
    }
  });

  averageHealthscoreInAlert = totalHealthscoreInAlert / statusInAlert;
  averageHealthscoreInDowntime = totalHealthscoreInDowntime / statusInDowntime;
  averageHealthscoreInOperation =
    totalHealthscoreInOperation / statusInOperation;

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
                <h2>{averageHealthscoreInOperation.toFixed()}&#8451;</h2>
                <p>Ativos em operação</p>
              </div>

              <div className={styles.statistic}>
                <h2>{averageHealthscoreInAlert.toFixed()}&#8451;</h2>
                <p>Ativos em alerta</p>
              </div>

              <div className={styles.statistic}>
                <h2>{averageHealthscoreInDowntime.toFixed()}&#8451;</h2>
                <p>Ativos em parada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.Assets}>
        <h2>Ativos</h2>

        <ul>
          {latestAssets.map(asset => {
            return (
              <div className={styles.liContainer} key={asset.id}>
                <li>
                  <Image
                    width={192}
                    height={192}
                    src={asset.image}
                    alt={asset.name}
                    style={{ objectFit: "cover" }}
                  />

                  <div className={styles.content}>
                    <div className={styles.assetDetails}>
                      <header>
                        <Link href={`/assets/${asset.id}`}>
                          {asset.name}
                        </Link>

                        {asset.status == "inOperation" ? (
                          <FiActivity
                            size={30}
                            color="#2ecc71"
                            title={"Em operação"}
                          />
                        ) : asset.status == "inAlert" ? (
                          <FiAlertTriangle
                            size={30}
                            color="#f1c40f"
                            title={"Em alerta"}
                          />
                        ) : (
                          <FiAlertCircle
                            size={30}
                            color="#e74c3c"
                            title={"Em tempo de inatividade"}
                          />
                        )}
                      </header>

                      <label htmlFor="specifications.power"></label>
                      {typeof asset.specifications.power != "undefined" ? (
                        <p id="specifications.power">
                          {"Potência " + asset.specifications.power}kWh
                        </p>
                      ) : (
                        ""
                      )}

                      <Tag
                        color={
                          asset.specifications.maxTemp >= 80
                            ? "volcano"
                            : "orange"
                        }
                        style={{ fontSize: 17 }}
                      >
                        {asset.specifications.maxTemp}&#8451;
                      </Tag>
                    </div>
                  </div>
                </li>
                <div className={styles.healthScore}>
                  <Progress percent={asset.healthscore} status="active" />
                </div>
              </div>
            );
          })}
        </ul>

        <div className={styles.aEspecific}>
          <Link href="/assets">Ver mais</Link>
        </div>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  //Biblioteca axios para fazer requisições HTTP
  const { data } = await api.get("assets", {
    params: {},
  });

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
    };
  });

  const latestAssets = allAssets.slice(0, 2);

  return {
    props: {
      latestAssets,
      allAssets,
    },
    revalidate: 60 * 60 * 8, // 8 hours
  };
};
