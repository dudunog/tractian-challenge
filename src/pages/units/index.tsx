import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "../../services/api";

import { Table, Space, Popconfirm } from "antd";
import "antd/dist/antd.css";

import styles from "./unit.module.scss";

type Unit = {
  id: number;
  name: string;
  companyId: number;
  companyName: string;
};

type UnitProps = {
  units: Unit[];
  allUnits: Unit[];
};

async function deleteUnit(id) {
  //Comentei para não quebrar a aplicação, pois a rota da api não funciona
  // const { data } = await api.delete("units", {
  //   params: {
  //     id: id,
  //   },
  // });
}

const columns = [
  {
    title: "Unidade",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Empresa",
    dataIndex: "companyName",
    key: "name",
  },
  {
    title: "Ações",
    key: "action",
    render: (text, unit) => (
      <Space>
        <Link href={`/units/${unit.id}`}>Editar</Link>
        <Popconfirm
          title={`Tem certeza que deseja excluir ${unit.name}？`}
          okText="Sim"
          cancelText="Não"
          onConfirm={() => deleteUnit(unit.id)}
        >
          <a href={`/units/${unit.id}`}>Excluir</a>
        </Popconfirm>
      </Space>
    ),
  },
];

export default function Unit({ allUnits }: UnitProps) {
  return (
    <div className={styles.unitContainer}>
      <Head>
        <title>Unidades | Tractian</title>
      </Head>

      <section className={styles.Assets}>
        <h2>Unidades</h2>

        <Table columns={columns} dataSource={allUnits} />
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("units", {
    params: {},
  });

  async function getCompanies() {
    const { data } = await api.get("companies", {
      params: {},
    });
    return data;
  }

  const companies = await getCompanies();

  function getNameCompany(id) {
    const company = companies.find(company => company.id == id);
    return company.name;
  }

  const allUnits = data.map(unit => {
    var companyName = getNameCompany(unit.companyId);
    return {
      id: unit.id,
      name: unit.name,
      companyName: companyName,
    };
  });

  return {
    props: {
      allUnits,
    },
    revalidate: 60 * 60 * 8,
  };
};
