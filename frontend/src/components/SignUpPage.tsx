import React, { useEffect, useState } from "react";
import { Form, Input, Button, Card, Select, message, Layout } from "antd";
import { postSignUp } from "../api";
import { ISignUp } from "@src/types";

const { Option } = Select;

const SignupPage: React.FC = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // fetchWarehouses();
  }, []);

  // const fetchWarehouses = async () => {
  //   try {
  //     const warehouses = await getWarehouses();
  //     console.log(warehouses);
  //     setWarehouses(warehouses);
  //   } catch (error) {
  //     message.error("Failed to get warehouses. Please reload the page!");
  //   }
  // };

  const onFinish = async (values: ISignUp) => {
    setFormLoading(true);
    console.log("Received values of form:", values);
    // Perform your signup logic here
    try {
      const {
        fullname,
        username,
        password,
        confirmPassword,
        role,
        abn,
        address,
        phone,
        email,
      } = values;

      if (password !== confirmPassword) {
        message.error("Passwords do not match");
        return;
      }

      await postSignUp(
        fullname,
        username,
        password,
        role,
        email,
        phone,
        abn,
        address
      );

      message.success(
        "Successfully signed up! Please wait for admin to review your account."
      );
      // Wait for 3 seconds before redirecting
      setTimeout(() => {
        window.location.href = "/";
        form.resetFields();
      }, 3000);
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
          <Form.Item name="fullname">
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item name="email">
            <Input placeholder="Email" />
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
              <Option value="outlet">Outlet</Option>
              <Option value="supplier">Supplier</Option>
            </Select>
          </Form.Item>
          <Form.Item name="address">
            <Input placeholder="Address" />
          </Form.Item>
          <Form.Item name="phone">
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item name="abn">
            <Input placeholder="ABN number" />
          </Form.Item>

          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item>
            <Button
              style={{ width: "100%" }}
              type="primary"
              htmlType="submit"
              loading={formLoading}
            >
              Sign up
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Layout>
  );
};

export default SignupPage;
