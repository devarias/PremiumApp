import React, { useState } from 'react';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Form, Input, Button, Select } from 'antd';
import Item from './Item';
import '../styles/OrderCreation.css';
import { useHistory } from 'react-router-dom';

function OrderCreation() {
  const [seller, setSeller] = useState('');
  const [method, setMethod] = useState(0);
  const [externalOrder, setExternalOrder] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [items] = useState([]);
  let history = useHistory();
  const { Option } = Select;
  const methods = [
    { id: 1, name: 'Recogida @ Melonn - HOY' },
    { id: 2, name: 'Recogida @ Melonn - Siguiente Dia Habil' },
    { id: 3, name: 'Domicilio - Express - Local' },
    { id: 4, name: 'Domicilio - Hoy - Local' },
    { id: 5, name: 'Domicilio - Siguiente Dia Habil - Local' },
    { id: 6, name: 'Envio Nacional' },
  ];
  async function sendOrder() {
    const config = {
      method: 'POST',
      url: 'http://localhost:8000/orders',
      headers: { 'Content-Type': 'application/json' },
      data: {
        sellerStore: seller,
        shippingMethod: method,
        orderInfo: {
          externalOrderNumber: externalOrder,
          buyer: {
            name: buyerName,
            phone: buyerPhone,
            email: buyerEmail,
          },
          shipping: {
            address: address,
            city: city,
            region: region,
            country: country,
          },
          items: items,
        },
      },
    };
    await axios(config)
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
    history.push('/home');
  }
  return (
    <Form name='nest-messages'>
      <p className='titles'>Order Info</p>
      <Form.Item label='Seller Store'>
        <Input onChange={(e) => setSeller(e.target.value)} />
      </Form.Item>
      <Form.Item label='Shipping Method'>
        <Select onChange={(e) => setMethod(e)}>
          {methods.map((meth) => (
            <Option key={meth.id} value={meth.id_}>
              {meth.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label='External Order Number'>
        <Input onChange={(e) => setExternalOrder(e.target.value)} />
      </Form.Item>
      <Form.Item label='Buyer Full Name'>
        <Input onChange={(e) => setBuyerName(e.target.value)} />
      </Form.Item>
      <Form.Item label='Buyer Phone Number'>
        <Input onChange={(e) => setBuyerPhone(e.target.value)} />
      </Form.Item>
      <Form.Item label='Buyer Email'>
        <Input onChange={(e) => setBuyerEmail(e.target.value)} />
      </Form.Item>
      <Form.Item label='Shipping Address'>
        <Input onChange={(e) => setAddress(e.target.value)} />
      </Form.Item>
      <Form.Item label='City'>
        <Input onChange={(e) => setCity(e.target.value)} />
      </Form.Item>
      <Form.Item label='Region'>
        <Input onChange={(e) => setRegion(e.target.value)} />
      </Form.Item>
      <Form.Item label='Country'>
        <Input onChange={(e) => setCountry(e.target.value)} />
      </Form.Item>

      <p className='titles'>Items</p>
      <Form.Item>
        <Item items={items} />
      </Form.Item>

      <Form.Item>
        <a href='http://localhost:3000/home'>
          <Button
            className='sub-btn'
            type='primary'
            htmlType='submit'
            onClick={() => sendOrder()}
          >
            Submit
          </Button>
        </a>
      </Form.Item>
    </Form>
  );
}
export default OrderCreation;
