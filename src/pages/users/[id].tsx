import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";

import { api } from "../../services/api";

import { Form, Input, Button, Select } from "antd";
import "antd/dist/antd.css";

const { Option } = Select;

import styles from "./users.module.scss";

type User = {
  id: number;
  email: string;
  name: string;
  unitId: number;
  companyId: number;
  unitName: string;
  companyName: string;
};

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

type UserProps = {
  user: User;
  allUnits: Unit[];
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

const updateUser = async (values: any) => {
  const { data } = await api.post("users", {
    params: {
      id: values.id,
      email: values.email,
      name: values.name,
      unitId: values.unitId,
      companyId: values.companyId,
    },
  });
};

export default function Company({ user, allUnits, allCompanies }: UserProps) {
  return (
    <div className={styles.userContainer}>
      <Head>
        <title>{user.name} | Tractian</title>
      </Head>
      <div className={styles.users}>
        <h2>Editar usuário</h2>

        <div className={styles.forms}>
          <Form
            {...layout}
            name="nest-messages"
            validateMessages={validateMessages}
            initialValues={{
              id: user.id,
              name: user.name,
              email: user.email,
              unitId: user.unitName,
              companyId: user.companyName,
            }}
            onFinish={updateUser}
          >
            <Form.Item
              name="id"
              label="Id"
              rules={[{ required: true }]}
              hidden
            ></Form.Item>

            <Form.Item name="name" label="Nome" rules={[{ required: true }]}>
              <Input placeholder="Digite o nome do usuário" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ type: "email", required: true }]}
            >
              <Input placeholder="Digite o e-mail do usuário" />
            </Form.Item>

            <Form.Item
              name="unitId"
              label="Unidade"
              rules={[{ required: true, message: "Unidade é obrigatório" }]}
            >
              <Select placeholder="Selecione a unidade">
                {allUnits.map(unit => {
                  return <Option value={unit.id}>{unit.name}</Option>;
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
                  return <Option value={company.id}>{company.name}</Option>;
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
  var firstUsers = [];

  const { data } = await api.get("users", {
    params: {},
  });

  for (let i = 0; i < 2; i++) {
    firstUsers.push(data[i]);
  }

  const paths = firstUsers.map(user => {
    return {
      params: {
        id: user.id.toString(),
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

  const { data } = await api.get("users", {
    params: {},
  });

  async function getUnits() {
    const { data } = await api.get("units", {
      params: {},
    });
    return data;
  }

  async function getCompanies() {
    const { data } = await api.get("companies", {
      params: {},
    });
    return data;
  }

  const units = await getUnits();

  const companies = await getCompanies();

  const resultUser = data.find(user => user.id == id);
  const resultUnit = units.find(unit => unit.id == resultUser.unitId);
  const resultCompany = companies.find(
    company => company.id == resultUser.companyId
  );

  const user = {
    id: resultUser.id,
    name: resultUser.name,
    email: resultUser.email,
    unitId: resultUser.unitId,
    companyId: resultUser.companyId,
    unitName: resultUnit.name,
    companyName: resultCompany.name,
  };

  const allUnits = units.map(unit => {
    return {
      id: unit.id,
      name: unit.name,
    };
  });

  const allCompanies = companies.map(company => {
    return {
      id: company.id,
      name: company.name,
    };
  });

  return {
    props: {
      user,
      allUnits,
      allCompanies,
    },
    revalidate: 60 * 60 * 24,
  };
};
