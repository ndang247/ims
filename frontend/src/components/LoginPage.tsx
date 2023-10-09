import React, {useState} from "react";
import { Form, Input, Button, Card, message } from "antd";

import {postLogin} from '../api'

const LoginPage = () => {

  const [formLoading, setFormLoading] = useState(false)

  const onFinish = async (values) => {
    setFormLoading(true)
    try {
      await postLogin(values.username, values.password)
      message.success("Successfully logged in!")
    } catch (error) {
      console.log(error);
      message.error("Failed to login. Please try again.")
    }

    setFormLoading(false)

  };

  return (
    <Card title="Login" style={{ width: 400, margin: "auto", marginTop: 50 }}>
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
          <Button style={{width: "100%"}} type="primary" htmlType="submit" loading={formLoading}>
            Log in
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LoginPage;