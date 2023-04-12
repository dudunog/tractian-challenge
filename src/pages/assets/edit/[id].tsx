import Head from "next/head"
import { GetStaticPaths, GetStaticProps } from "next"
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

const updateAsset = async (values: Asset) => {
  await api.post("assets", {
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

const Asset = ({ asset, allUnits, allCompanies }: AssetProps) => {
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

  const getUnits = async () => {
    const { data } = await api.get("units")

    return data
  }

  const getCompanies = async () => {
    const { data } = await api.get("companies")

    return data
  }

  const units = await getUnits()
  const companies = await getCompanies()

  const resultAsset: Asset = data.find(asset => asset.id == id)
  const resultUnit: Unit = units.find(unit => unit.id == resultAsset.unitId)
  const resultCompany: Company = companies.find(company =>
    company.id == resultAsset.companyId)

  const asset: Asset = {
    id: resultAsset.id,
    sensors: resultAsset.sensors,
    model: resultAsset.model,
    status: resultAsset.status,
    healthscore: resultAsset.healthscore,
    name: resultAsset.name,
    image: resultAsset.image,
    specifications: resultAsset.specifications,
    metrics: resultAsset.metrics,
    lastUptimeAt: format(
      parseISO(resultAsset.metrics.lastUptimeAt),
      "d MMM yy", { locale: ptBR, }
    ),
    unitName: resultUnit.name,
    companyName: resultCompany.name,
  }

  const allUnits = units.map(unit => ({
    id: unit.id,
    name: unit.name
  }))

  const allCompanies = companies.map(company => ({
    id: company.id,
    name: company.name
  }))

  return {
    props: {
      asset,
      allUnits,
      allCompanies,
    },
    revalidate: 60 * 60 * 24,
  }
}
