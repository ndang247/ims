import {useState, useEffect, useMemo} from "react";
import { Table, Button, Modal, Form, Input, Select, Tooltip, Divider } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { OutletOrderModel, OutletOrder, ProductOrder } from "../api";


const { Option } = Select;

const OutletOrderManagement = () => {
  const [orders, setOrders] = useState<OutletOrderModel[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OutletOrderModel | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>("");

  const [statusMessage, setStatusMessage] = useState('');

  const handleStatusChange = (value) => {
    let message = '';
    switch (value) {
      case 'pending':
        message = 'The order will be pending approval.';
        break;
      case 'accepted':
        message = 'The order will be accepted and headed to processing.';
        break;
      case 'processed':
        message = 'The order will be seen as processed and is ready for delivery.';
        break;
      case 'delivered':
        message = 'The order will be seen as delivered successfully to the dedicated outlet.';
        break;
      case 'rejected':
        message = 'The order will be rejected.';
        break;
      default:
        message = '';
    }
    setStatusMessage(message);
  };

  const [form] = Form.useForm();


  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const fetchedOrders = await OutletOrder.getManyOutletOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    {
      title: 'User',
      dataIndex: 'user.username',
      key: 'user',
      render: (text, record) => {
        return `${record.user.username ?? "N/A"} - ${record.user.role}`
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'No. Products',
      dataIndex: 'products.length',
      key: 'productsNo',
      render: (text, record) => {
        const tooltipContent = record.products.map((prod: ProductOrder) => 
          `${prod.product.barcode}: ${prod.quantity}`
        ).join(', ');
  
        return (
          <Tooltip title={tooltipContent}>
            {record.products.length ?? 0}
          </Tooltip>
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Date Created',
      dataIndex: 'datetimecreated',
      key: 'datetimecreated',
      render: (text: Date) => {
        const date = new Date(text);
        return `${date.toLocaleString()}`;
      }
    },
    {
      title: 'View',
      key: 'view',
      render: (_: any, record: any) => (
        <Button onClick={() => showModal(record)}>View</Button>
      ),
    },
  ]

  const isOrderSelected = useMemo(() => {
    return !!selectedOrder?._id;
  }, [selectedOrder]);

  const showModal = (record: any) => {
    setSelectedOrder(record);
    console.log('Show Modal - Order', record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const deleteOrder = async () => {
    setLoading(true);
    try {
      if (selectedOrder && selectedOrder._id) {
        await OutletOrder.deleteOutletOrder(selectedOrder._id);
        await init();
        setIsModalVisible(false);
      }
    } catch (error) {
      setErrorText("Error deleting order!");
    } finally {
      setLoading(false);
    }
  };

  const handleOk = async () => {
    setLoading(true);
    try {
      await form.validateFields();
      const values = form.getFieldsValue() as OutletOrderModel;

      if (isOrderSelected) {
        await OutletOrder.updateOutletOrder(selectedOrder._id as string, values);
      } else {
        await OutletOrder.createOutletOrder(values);
      }

      form.resetFields();
      await init();
      setIsModalVisible(false);
    } catch (error) {
      setErrorText(error.message ?? "An error occurred!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      
      <Table dataSource={orders} columns={columns} />
      <Modal 
        title={isOrderSelected ? `Outlet Order from ${selectedOrder?.user.username ?? "N/A"}` : "Add Order"}
        open={isModalVisible}
        onOk={handleOk}
        okText="Submit"
        onCancel={() => setIsModalVisible(false)}
      >
        <Divider />
        <Form form={form} layout="vertical">
        {/* Description */}
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input the description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          {/* Status */}
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select the status!' }]}
          >
            <Select onChange={handleStatusChange}>
              <Option value="pending">Pending</Option>
              <Option value="accepted">Accepted & Processing</Option>
              <Option value="processed">Processed</Option>
              <Option value="delivered">Delivered</Option>
              <Option value="rejected">Rejected</Option>
            </Select>
            {statusMessage && (
          <span className="text-secondary py-2">{statusMessage}</span>
        )}
          </Form.Item>

          <div>
            <span className="fs-6">Products</span>
            {selectedOrder?.products.map(product => {
              return <div>{product.product.barcode} - Quantity: {product.quantity}</div>
            })}
          </div>

      </Form>
      </Modal>
    </>
  );
};

export default OutletOrderManagement;