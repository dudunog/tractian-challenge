import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { api } from "@/services/api"
import { Form, Input, Button, Select } from "antd"
const { Option } = Select
import styles from "./unit.module.scss"
import "antd/dist/reset.css"

type Unit = {
  id: number;
  name: string;
  companyId: number;
  companyName: string;
};

type Company = {
  id: number;
  name: string;
};

type UnitProps = {
  unit: Unit;
  allCompanies: Company[];
};

const layout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 8 },
};

const validateMessages = {
  required: "${label} é obrigatório!",
  types: {
    email: "${label} não é um email válido!",
  },
};

const updateUnit = async (values: any) => {
  const { data } = await api.post("units", {
    params: {
      id: values.id,
      name: values.name,
      companyId: values.companyId,
    },
  });
};

export default function Unit({ unit, allCompanies }: UnitProps) {
  return (
    <div className={styles.unitContainer}>
      <Head>
        <title>{unit.name} | Tractian</title>
      </Head>
      <div className={styles.users}>
        <h2>Editar unidade</h2>

        <div className={styles.units}>
          <Form
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
            initialValues={{
              id: unit.id,
              name: unit.name,
              companyId: unit.companyName,
            }}
            onFinish={updateUnit}
          >
            <Form.Item
              name="id"
              label="Id"
              rules={[{ required: true }]}
              hidden
            ></Form.Item>

            <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
              <Input placeholder="Digite o nome da unidade" />
            </Form.Item>

            <Form.Item
              name="companyId"
              label="Empresa"
              rules={[{ required: true, message: "Empresa é obrigatório" }]}
            >
              <Select placeholder="Selecione a Empresa">
                {allCompanies.map(company => {
                  return (
                    <Option key={company.id} value={`${company.id}`}>{company.name}</Option>
                  );
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
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get("units", {
    params: {},
  });

  const paths = data.map(unit => {
    return {
      params: {
        id: unit.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ctx => {
  const { id } = ctx.params;

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

  const resultUnit = data.find(unit => unit.id == id);
  const resultCompany = companies.find(
    company => company.id == resultUnit.companyId
  );

  const unit = {
    id: resultUnit.id,
    name: resultUnit.name,
    companyId: resultUnit.companyId,
    companyName: resultCompany.name,
  };

  const allCompanies = companies.map(unit => {
    return {
      id: unit.id,
      name: unit.name,
    };
  });

  return {
    props: {
      unit,
      allCompanies,
    },
    revalidate: 60 * 60 * 24,
  };
};
