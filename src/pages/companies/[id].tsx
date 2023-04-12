import { GetStaticPaths, GetStaticProps } from "next"
import Head from "next/head"
import { api } from "@/services/api"
import { Form, Input, Button } from "antd"
import styles from "./company.module.scss"
import "antd/dist/reset.css"

type Company = {
  id: number;
  name: string;
};

type CompanyProps = {
  company: Company;
};

const layout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 8 },
};

const validateMessages = {
  required: "${label} é obrigatório!",
  types: {
    email: "${label} não é um email válido!",
  },
};

const updateCompany = async (values: any) => {
  const { data } = await api.post("companies", {
    params: {
      id: values.id,
      name: values.name,
    },
  });
};

export default function Company({ company }: CompanyProps) {
  return (
    <div className={styles.companyContainer}>
      <Head>
        <title>{company.name} | Tractian</title>
      </Head>
      <div className={styles.Companies}>
        <h2>Editar empresa</h2>

        <div className={styles.forms}>
          <Form
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
            initialValues={{ id: company.id, name: company.name }}
            onFinish={updateCompany}
          >
            <Form.Item
              name={["id"]}
              label="Id"
              rules={[{ required: true }]}
              hidden
            ></Form.Item>

            <Form.Item
              name={["name"]}
              label="Nome"
              rules={[{ required: true }]}
            >
              <Input placeholder="Digite o nome da empresa" />
            </Form.Item>

            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 2 }}>
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
  const { data } = await api.get("companies", {
    params: {},
  });

  const paths = data.map(company => {
    return {
      params: {
        id: company.id.toString(),
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
  const { data } = await api.get("companies", {
    params: {},
  });

  const result = data.find(element => element.id == id);

  const company = {
    id: result.id,
    name: result.name,
  };

  return {
    props: {
      company,
    },
    revalidate: 60 * 60 * 24, //24 hours
  };
};
