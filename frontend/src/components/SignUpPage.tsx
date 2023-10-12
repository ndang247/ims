import { useEffect, useState } from "react";
import { Form, Input, Button, Card, Select, message, Layout } from "antd";

import { getWarehouses, postSignUp } from "../api";
import { ISignUp, IWarehouse } from "@src/types";

const { Option } = Select;

const SignupPage = () => {
  const [warehouses, setWarehouses] = useState([]);

  const [formLoading, setFormLoading] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const warehouses = await getWarehouses();
      console.log(warehouses);
      setWarehouses(warehouses);
    } catch (error) {
      message.error("Failed to get warehouses. Please reload the page!");
    }
  };

  const onFinish = async (values: ISignUp) => {
    setFormLoading(true);
    console.log("Received values of form: ", values);
    // Perform your signup logic here
    try {
      const { username, password, confirmPassword, role, warehouse } = values;

      if (password !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      const token = await postSignUp(username, password, role, [warehouse]);

      if (token) {
        message.success("Successfully signed up!");
        // Wait for 3 seconds before redirecting
        setTimeout(() => {
          window.location.href = "/login";
          form.resetFields();
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to sign up. Please try again!");
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Card
        title="Sign Up For DC Warehouse"
        style={{ width: 400, margin: "auto" }}
      >
        <Form
          form={form}
          name="signup"
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

          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: "Please confirm your Password!" },
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>

          <Form.Item name="role">
            <Select style={{ width: "100%" }} placeholder="Select role">
              <Option value="owner">Owner</Option>
              <Option value="manager">Manager</Option>
              <Option value="worker">Worker</Option>
              <Option value="outlet">Outlet</Option>
              <Option value="supplier">Supplier</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="warehouse"
            rules={[{ required: true, message: "Please select a warehouse!" }]}
          >
            <Select placeholder="Select a warehouse">
              {warehouses.map((warehouse: IWarehouse) => (
                <Option key={warehouse._id} value={warehouse._id}>
                  {warehouse.name} - {warehouse.address}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={formLoading}
            >
              Sign up
            </Button>
            <Button
              style={{ width: "100%", marginTop: 10 }}
              type="default"
              onClick={() => {
                window.location.href = "/login";
              }}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default SignupPage;
