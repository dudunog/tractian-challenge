import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { Asset, Company, Unit } from "@/domain/models"
import { api } from "@/services/api"
import { Form, Input, Select, Button } from "antd"
const { Option } = Select
import { format, parseISO } from "date-fns"
import ptBR from "date-fns/locale/pt-BR"
import styles from "./asset.module.scss"
import "antd/dist/reset.css"

type AssetProps = {
  asset: Asset
  allUnits: Unit[]
  allCompanies: Company[]
}

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 8 },
}

const validateMessages = {
  required: "${label} é obrigatório!",
  types: {
    email: "${label} não é um email válido!",
  },
}

const updateAsset = async (values: any) => {
  const { data } = await api.post("assets", {
    params: {
      id: values.id,
      sensors: values.sensors,
      model: values.model,
      status: values.status,
      healthscore: values.healthscore,
      name: values.name,
      image: values.image,
      specifications: values.specifications,
      metrics: values.metrics,
      unitId: values.unitId,
      companyId: values.companyId,
    },
  })
}

export default function Asset({ asset, allUnits, allCompanies }: AssetProps) {
  return (
    <div className={styles.assetContainer}>
      <Head>
        <title>{asset.name} | Tractian</title>
      </Head>
      <div className={styles.assets}>
        <h2>Editar ativo</h2>

        <div className={styles.forms}>
          <Form
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
            initialValues={{
              id: asset.id,
              sensors: asset.sensors,
              model: asset.model,
              name: asset.name,
              image: asset.image,
              unitId: asset.unitName,
              companyId: asset.companyName,
            }}
            onFinish={updateAsset}
          >
            <Form.Item
              name="id"
              label="Id"
              rules={[{ required: true }]}
              hidden
            ></Form.Item>

            <Form.Item
              name="sensors"
              label="Sensores"
              rules={[{ required: true }]}
            >
              <Select
                mode="tags"
                allowClear
                placeholder="Escolha os sensores do ativo"
              >
                <Option value={asset.sensors[0]}>{asset.sensors[0]}</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={["model"]}
              label="Modelo"
              rules={[{ required: true }]}
            >
              <Input placeholder="Digite o modelo do ativo" />
            </Form.Item>

            <Form.Item
              name={["name"]}
              label="Nome"
              rules={[{ required: true }]}
            >
              <Input placeholder="Digite o nome do ativo" />
            </Form.Item>

            <Form.Item
              name={["image"]}
              label="Imagem"
              rules={[{ required: true }]}
            >
              <Input placeholder="Escolhar a imagem do ativo" />
            </Form.Item>

            <Form.Item
              name="unitId"
              label="Unidade"
              rules={[{ required: true, message: "Unidade é obrigatório" }]}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Selecione a unidade"
                defaultValue={["a10", "a20"]}
              >
                {allUnits.map(unit => {
                  return <Option key={unit.id} value={unit.id}>{unit.name}</Option>
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="companyId"
              label="Empresa"
              rules={[{ required: true, message: "Empresa é obrigatório" }]}
            >
              <Select placeholder="Selecione a empresa">
                {allCompanies.map(company => {
                  return <Option key={company.id} value={company.id}>{company.name}</Option>
                })}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 3 }}>
              <Button type="primary" htmlType="submit">
                Atualizar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  var latestAssets = []

  const { data } = await api.get("assets", {
    params: {},
  })

  for (let i = 0; i < 2; i++) {
    latestAssets.push(data[i])
  }

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
  const { data } = await api.get("assets", {
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

  const resultUser = data.find(asset => asset.id == id)
  const resultUnit = units.find(unit => unit.id == resultUser.unitId)
  const resultCompany = companies.find(
    company => company.id == resultUser.companyId
  )

  const asset = {
    id: resultUser.id,
    sensors: resultUser.sensors,
    model: resultUser.model,
    status: resultUser.status,
    healthscore: resultUser.healthscore,
    name: resultUser.name,
    image: resultUser.image,
    specifications: resultUser.specifications,
    metrics: resultUser.metrics,
    lastUptimeAt: format(
      parseISO(resultUser.metrics.lastUptimeAt),
      "d MMM yy",
      {
        locale: ptBR,
      }
    ),
    unitName: resultUnit.name,
    companyName: resultCompany.name,
  }

  const allUnits = units.map(unit => {
    return {
      id: unit.id,
      name: unit.name,
    }
  })

  const allCompanies = companies.map(company => {
    return {
      id: company.id,
      name: company.name,
    }
  })

  return {
    props: {
      asset,
      allUnits,
      allCompanies,
    },
    revalidate: 60 * 60 * 24,
  }
}
