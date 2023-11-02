import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Table, Modal, Button, Form, Input, Select } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { User, UserModel, getWarehouses } from '../api';

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserModel | null>(null);
  const [warehouses, setWarehouses] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [errorText, setErrorText] = useState<string | null>("")

  useEffect(() => {
    // Fetch users from your backend
    console.log('User Management');
  init()
  }, []);

  const init = async () => {
    try {
      await fetchUsers()

      const warehouses = await getWarehouses()
      setWarehouses(warehouses)
    } catch (error) {
      console.log(error)
    }
  }

  const fetchUsers = async () => {
    try {
      const users = await User.listUsers()
      setUsers(users)
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button onClick={() => showModal(record)}>View</Button>
      ),
    },
  ];

  const isUserSelected = useMemo(() => {
    console.log('User changed', !!selectedUser?._id);
    return !!selectedUser?._id;
  }, [selectedUser])

  const showModal = (record: any) => {
    console.log('Set user on show modal', record);
    setSelectedUser(record);

    if (record._id){
      form.setFieldsValue({
        username: record.username,
        role: record.role,
        status: record.status,
        warehouse: record.warehouses[0]
      });
    }
    setIsModalVisible(true);
  };

  const deleteUser = async () => {
    console.log('Deleting user:', selectedUser);
    setLoading(true)
    try {
      if (selectedUser && selectedUser._id) {
        await User.delete(selectedUser?._id)
        await fetchUsers()
        handleCloseModal()
      }
    }
    catch (error) {
      console.log('Error', error);
      setErrorText("Error deleting user!")
    } finally {
      setLoading(false)
    }
  };

  const handleOk = async () => {
    setLoading(true)
    const {username, password, role, status, warehouse} = form.getFieldsValue()

    console.log('Handle ok', form.getFieldsValue());

   
 
    try {
      if (!username || !role || !status || !warehouse) {
        throw new Error("Please enter all fields!")
      }
  
      if (!isUserSelected && !password) {
        throw new Error("Please enter password!")
        return
      }

      const values = {
        _id: null,
        username,
        role,
        password,
        status,
        warehouses: [warehouse]
      }

      await form.validateFields()
      
      if (!isUserSelected) {
        console.log('Add user', values);
        await User.add(values)
      }
      else {
        values._id = selectedUser?._id
        await User.update(values)
      }
  
      form.resetFields()
      await fetchUsers()

      handleCloseModal()
    } catch (error) {
      console.log('Error', error);
      setErrorText(error.message ?? "Error occurred! Please enter data correctly.")
    } finally {
      setLoading(false)
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    form.resetFields()
    setIsModalVisible(false);
    setLoading(false)
    setErrorText("")
  };

  return (
    <>
      <div className='d-flex flex-row justify-content-end my-2'>
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => showModal({})}
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
        footer={isUserSelected ? [
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
          <Button
            className='text-bg-danger'
            loading={loading}
            onClick={deleteUser}
          >
            Delete
          </Button>,
          <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Update
          </Button>,
        ]: [
          <Button key="back" onClick={handleCloseModal}>
            Cancel
          </Button>,
           <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
            Add
          </Button>,
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: 'manager', status: 'pending' }}
        >
          <Form.Item
            label="Username"
            name="username"
            required
          >
            <Input />
          </Form.Item>
          {!isUserSelected && <Form.Item
            label="Password"
            name="password"
            required
          >
            <Input.Password />  
          </Form.Item>}

          <Form.Item
            label="Role"
            name="role"
            required
          >
            <Select>
              <Option value="manager">Manager</Option>
              <Option value="owner">Owner</Option>
              <Option value="staff">Staff</Option>
              <Option value="outlet">Outlet</Option>
              <Option value="supplier">Supplier</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            required
          >
            <Select>
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Warehouse"
            name="warehouse"
            required            
          >
            <Select>
              {warehouses.map(warehouse => {
                return <Option value={warehouse._id}>{warehouse.name ?? "None"} - {warehouse.address ?? "None"}</Option>
              })}
            </Select>
          </Form.Item>
          {errorText && <div style={{ color: 'red', marginTop: '1rem' }}>{errorText}</div>}
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;