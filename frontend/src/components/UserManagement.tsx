import React, { useState, useEffect, useMemo } from "react";
import { Table, Modal, Button, Form, Input, Select, Breadcrumb } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { User, getWarehouses } from "../api";
import { IUser, IWarehouse } from "@src/types";

const { Option } = Select;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isOutlet, setIsOutlet] = useState(false);
  const [warehouses, setWarehouses] = useState<IWarehouse[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [errorText, setErrorText] = useState<string | null>("");

  useEffect(() => {
    // Fetch users from your backend
    console.log("User Management");
    init();
  }, []);

  const init = async () => {
    try {
      await fetchUsers();

      const warehouses = await getWarehouses();
      setWarehouses(warehouses);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await User.listUsers();
      const usersWithKey = users.map((user, key) => {
        return { ...user, key };
      });
      setUsers(usersWithKey);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Full Name",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: IUser) => (
        <Button onClick={() => showModal(record)}>View</Button>
      ),
    },
  ];

  const handleRoleChanged = (value: string) => {
    setIsOutlet(value === "outlet");
  };

  const isUserSelected = useMemo(() => {
    console.log("User changed", !!selectedUser?._id);
    return !!selectedUser?._id;
  }, [selectedUser]);

  const showModal = (record: IUser) => {
    console.log("Set user on show modal", record);
    // Check if record object is empty
    if (Object.keys(record).length !== 0 && record.constructor === Object) {
      setSelectedUser(record);
    }

    if (Object.keys(record).length !== 0 && record._id) {
      form.setFieldsValue({
        fullname: record.fullname ?? record.username,
        username: record.username,
        role: record.role,
        status: record.status,
        abn: record.abn,
        address: record.address,
        email: record.email,
        phone: record.phone,
        warehouse: record.warehouses[0],
      });
    }
    setIsModalVisible(true);
  };

  const deleteUser = async () => {
    console.log("Deleting user:", selectedUser);
    setLoading(true);
    try {
      if (selectedUser && selectedUser._id) {
        await User.delete(selectedUser?._id);
        await fetchUsers();
        handleCloseModal();
      }
    } catch (error) {
      console.log("Error", error);
      setErrorText("Error deleting user!");
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    const {
      fullname,
      username,
      password,
      role,
      status,
      abn,
      address,
      email,
      phone,
      warehouse,
    } = form.getFieldsValue();

    console.log("Handle ok", form.getFieldsValue());

    try {
      if (!username || !role || !status || !warehouse) {
        throw new Error("Please enter all fields!");
      }

      if (!isUserSelected && !password) {
        throw new Error("Please enter password!");
      }

      const values = {
        _id: "",
        fullname,
        username,
        password,
        role,
        status,
        abn,
        address,
        phone,
        email,
        warehouses: [warehouse],
      };

      await form.validateFields();

      if (!isUserSelected) {
        console.log("Add user", values);
        await User.add(values);
      } else {
        values._id = selectedUser?._id ?? "";
        await User.update(values);
      }

      form.resetFields();
      await fetchUsers();

      handleCloseModal();
    } catch (error: any) {
      console.log("Error", error);
      setErrorText(
        error.message ?? "Error occurred! Please enter data correctly."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    form.resetFields();
    setIsModalVisible(false);
    setLoading(false);
    setErrorText("");
    setIsOutlet(false);
  };

  return (
    <>
      <div className="d-flex flex-row justify-content-between align-items-center my-2">
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[
            {
              title: <a href="/">Dashboard</a>,
            },
            {
              title: <a href="/users">User Management</a>,
            },
          ]}
        />
        <Button
          type="primary"
          style={{ margin: "16px 0" }}
          icon={<PlusCircleOutlined />}
          onClick={() => showModal({} as IUser)}
        >
          Add User
        </Button>
      </div>
      <Table dataSource={users} columns={columns} />
      <Modal
        title={isUserSelected ? "User Details" : "Add User"}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCloseModal}
        footer={
          isUserSelected
            ? [
                <Button key="back" onClick={handleCloseModal}>
                  Cancel
                </Button>,
                <Button
                  key="delete"
                  className="text-bg-danger"
                  loading={loading}
                  onClick={deleteUser}
                >
                  Delete
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={handleOk}
                >
                  Update
                </Button>,
              ]
            : [
                <Button key="back" onClick={handleCloseModal}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={handleOk}
                >
                  Add
                </Button>,
              ]
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: "manager", status: "pending" }}
        >
          <Form.Item label="Full Name" name="fullname">
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="username" required>
            <Input />
          </Form.Item>
          {!isUserSelected && (
            <Form.Item label="Password" name="password" required>
              <Input.Password />
            </Form.Item>
          )}

          <Form.Item label="Role" name="role" required>
            <Select onChange={handleRoleChanged}>
              <Option value="manager">Manager</Option>
              <Option value="staff">Staff</Option>
              <Option value="outlet">Outlet</Option>
              <Option value="supplier">Supplier</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Status" name="status" required>
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Warehouse" name="warehouse" required>
            <Select>
              {warehouses.map((warehouse, key) => {
                return (
                  <Option key={key} value={warehouse._id}>
                    {warehouse.name ?? "None"} - {warehouse.address ?? "None"}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          {isOutlet && (
            <>
              <Form.Item label="ABN" name="abn">
                <Input />
              </Form.Item>
              <Form.Item label="Outlet Address" name="address" required>
                <Input />
              </Form.Item>
            </>
          )}
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone">
            <Input />
          </Form.Item>
          {errorText && (
            <div style={{ color: "red", marginTop: "1rem" }}>{errorText}</div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;
