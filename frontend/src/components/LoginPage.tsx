import { useState } from "react";
import { Form, Input, Button, Card, message, Layout } from "antd";

import { postLogin } from "../api";
import { ILogin } from "@src/types";

const LoginPage = () => {
  const [formLoading, setFormLoading] = useState(false);

  const onFinish = async (values: ILogin) => {
    setFormLoading(true);
    try {
      const token = await postLogin(values.username, values.password);
      if (token) {
        message.success("Successfully logged in!");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to login. Please try again!");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Card title="Login" style={{ width: 400, margin: "auto" }}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={formLoading}
            >
              Log in
            </Button>
            <Button
              style={{ width: "100%", marginTop: 10 }}
              type="default"
              onClick={() => {
                window.location.href = "/signup";
              }}
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default LoginPage;
