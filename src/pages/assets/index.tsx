import { useEffect, useRef, useState } from "react";
import { GetStaticProps } from "next";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

import { api } from "../../services/api";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { FiAlertCircle, FiAlertTriangle, FiActivity } from "react-icons/fi";

import { Button, Tag, Progress } from "antd";
import "antd/dist/antd.css";

import styles from "../home.module.scss";

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
  maxTemp?: number;
  rpm?: number;
  power?: number;
};

type HomeProps = {
  assets: Asset[];
  allAssets: Asset[];
};

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
  };
}

export default function Home({ allAssets }: HomeProps) {
  var amountAssets = allAssets.length;
  var totalHealthscore = 0;
  var totalPower = 0;
  var averageHealthscore = 0;
  var averagePower = 0;

  allAssets.map(asset => {
    totalHealthscore += asset.healthscore;
    if (asset.specifications.power) {
      totalPower += asset.specifications.power;
    }
  });

  averageHealthscore = totalHealthscore / amountAssets;
  averagePower = totalPower / amountAssets;

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
            <h2>{averageHealthscore.toFixed()}&#8451;</h2>
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

        <ul>
          {allAssets.map(asset => {
            return (
              <div className={styles.liContainer} key={asset.id}>
                <li>
                  <Image
                    width={192}
                    height={192}
                    src={asset.image}
                    alt={asset.name}
                    objectFit="cover"
                  />

                  <div className={styles.content}>
                    <div className={styles.assetDetails}>
                      <header>
                        <Link href={`/assets/${asset.id}`}>
                          <a>{asset.name}</a>
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
                          {"Potência de " + asset.specifications.power}kWh
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
                  {/* <HighchartsReact
                    className={styles.charts}
                    width={192}
                    height={192}
                    highcharts={Highcharts}
                    options={updateAssetChart(asset.healthscore)}
                    allowChartUpdate={[true, true, true]}
                  /> */}
                  <Progress
                    //title="Saúde do ativo"
                    percent={asset.healthscore}
                    status="active"
                  />
                </div>
              </div>
            );
          })}
        </ul>
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
    };
  });

  return {
    props: {
      allAssets,
    },
    revalidate: 60 * 60 * 8, //8 hours
  };
};
