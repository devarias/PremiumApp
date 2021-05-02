import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
import ModalBox from './ModalBox';

function Orders() {
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalContent, setModalContent] = useState({});
  const [searchedColumn, setSearchedColumn] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  async function getOrders() {
    const orders = await axios.get(
      'http://localhost:8000/orders/all',
      (res) => {
        return res;
      }
    );
    setData(orders.data);
  }
  useEffect(() => {
    getOrders();
  }, []);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search Order`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type='primary'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size='small'
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size='small'
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  async function showInfo(e) {
    const order = await axios.get('http://localhost:8000/orders/' + e);
    setModalContent(order.data);
    setIsModalVisible(true);
  }
  const columns = [
    {
      title: 'Order Number',
      width: '25%',
      dataIndex: 'orderID',
      key: 'orderID',
      align: 'center',
      ...getColumnSearchProps('orderID'),
      render: (text) => (
        <div
          style={{ color: '#6666FF' }}
          onClick={(e) => {
            showInfo(e.target.textContent);
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: 'Seller Store',
      width: '25%',
      dataIndex: 'sellerStore',
      key: 'sellerStore',
      align: 'center',
      ...getColumnSearchProps('sellerStore'),
    },
    {
      title: 'Creation Date',
      width: '25%',
      dataIndex: 'creationDate',
      key: 'creationDate',
      align: 'center',
      ...getColumnSearchProps('creationDate'),
    },
    {
      title: 'Shipping Method',
      width: '25%',
      dataIndex: 'shippingMethod',
      key: 'shippingMethod',
      align: 'center',
      ...getColumnSearchProps('shippingMethod'),
    },
  ];
  return (
    <>
      <ModalBox
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        modalContent={modalContent}
      />
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 600 }}
        bordered={true}
        pagination={false}
      />
    </>
  );
}

export default Orders;
