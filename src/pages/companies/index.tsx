import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { Company } from "@/domain/models"
import { api } from "@/services/api"
import { Table, Space, Popconfirm } from "antd"
import styles from "./company.module.scss"
import "antd/dist/reset.css"

type CompanyProps = {
  companies: Company[]
  allCompanies: Company[]
}

const deleteCompany = async (id) => {
  // Comentei para não quebrar a aplicação, pois a rota da api não funciona
  // const { data } = await api.delete("companies", {
  //   params: {
  //     id: id,
  //   },
  // })
}

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Ações",
    key: "action",
    render: (text, company) => (
      <Space>
        <Link href={`/companies/${company.id}`}>Editar</Link>
        <Popconfirm
          title={`Tem certeza que deseja excluir ${company.name}？`}
          okText="Sim"
          cancelText="Não"
          onConfirm={() => deleteCompany(company.id)}
        >
          <a href={`/companies/${company.id}`}>Excluir</a>
        </Popconfirm>
      </Space>
    ),
  },
]

const Company = ({ allCompanies }: CompanyProps) => {
  return (
    <div className={styles.companyContainer}>
      <Head>
        <title>Empresas | Tractian</title>
      </Head>

      <section>
        <h2>Empresas</h2>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={allCompanies}
        />
      </section>
    </div>
  )
}

export default Company

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get<Company[]>("companies")

  const allCompanies = data.map(company => ({
    id: company.id,
    name: company.name,
  }))

  return {
    props: {
      allCompanies,
    },
    revalidate: 60 * 60 * 8,
  }
}
