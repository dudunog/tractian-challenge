import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"
import { api } from "@/services/api"
import { Table, Space, Popconfirm } from "antd"
import styles from "./users.module.scss"
import "antd/dist/reset.css"

type User = {
  id: number
  email: string
  name: string
  unitId: number
  companyId: number
}

type UserProps = {
  allUsers: User[]
}

async function deleteUser(id) {
  //   Comentei para não quebrar a aplicação, pois a rota da api não funciona
  //   const { data } = await api.delete("users", {
  //     params: {
  //       id: id,
  //     },
  //   })
}

const columns = [
  {
    title: "Nome",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "E-mail",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Unidade",
    dataIndex: "unitName",
    key: "unit",
  },
  {
    title: "Empresa",
    dataIndex: "companyName",
    key: "company",
  },
  {
    title: "Ações",
    key: "action",
    render: (text, user) => (
      <Space>
        <Link href={`/users/${user.id}`}>Editar</Link>
        <Popconfirm
          title={`Tem certeza que deseja excluir ${user.name}？`}
          okText="Sim"
          cancelText="Não"
          onConfirm={() => deleteUser(user.id)}
        >
          <a href={`/users/${user.id}`}>Excluir</a>
        </Popconfirm>
      </Space>
    ),
  },
]

export default function User({ allUsers }: UserProps) {
  return (
    <div className={styles.userContainer}>
      <Head>
        <title>Usuários | Tractian</title>
      </Head>

      <section className={styles.users}>
        <h2>Usuários</h2>

        <Table
          className={styles.table}
          columns={columns}
          dataSource={allUsers}
        />
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get("users", {
    params: {},
  })

  async function getUnits() {
    const { data } = await api.get("units", {
      params: {},
    })
    return data
  }

  async function getCompanies() {
    const { data } = await api.get("companies", {
      params: {},
    })
    return data
  }

  const units = await getUnits()
  const companies = await getCompanies()

  function getNameUnit(id) {
    const unit = units.find(unit => unit.id === id)
    return unit.name
  }

  function getNameCompany(id) {
    const company = companies.find(company => company.id === id)
    return company.name
  }

  const allUsers = data.map(user => {
    const companyName = getNameCompany(user.companyId)
    const unitName = getNameUnit(user.unitId)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      unitId: user.unitId,
      companyId: user.companyId,
      unitName: unitName,
      companyName: companyName,
    }
  })

  return {
    props: {
      allUsers,
    },
    revalidate: 60 * 60 * 8,
  }
}
