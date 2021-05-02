import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Button, Typography } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import '../styles/Item.css';

const useResetFormOnCloseModal = ({ form, visible }) => {
  const prevVisibleRef = useRef();
  useEffect(() => {
    prevVisibleRef.current = visible;
  });
  const prevVisible = prevVisibleRef.current;
  useEffect(() => {
    if (!visible && prevVisible) {
      form.resetFields();
    }
  });
};

const ModalForm = ({ visible, onCancel, items }) => {
  const [form] = Form.useForm();
  useResetFormOnCloseModal({
    form,
    visible,
  });

  const onOk = () => {
    items.push(form.getFieldValue());
    form.submit();
  };

  return (
    <Modal
      title='Add an Item'
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      cancelButtonProps={{
        style: {
          background: '#6e60ff',
          color: '#fff',
          borderRadius: '12px',
          borderColor: '#211953',
        },
      }}
      okButtonProps={{
        style: {
          background: '#6e60ff',
          color: '#fff',
          borderRadius: '12px',
          borderColor: '#211953',
        },
      }}
    >
      <Form form={form} layout='vertical' name='userForm'>
        <Form.Item name='name' label='Product Name'>
          <Input />
        </Form.Item>
        <Form.Item name='qty' label='Quantity'>
          <InputNumber defaultValue={0} min={0} />
        </Form.Item>
        <Form.Item name='weight' label='Weight'>
          <InputNumber
            defaultValue={0}
            min={0}
            step='0.5'
            formatter={(value) => `${value} kg`}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

function Item(props) {
  const [visible, setVisible] = useState(false);

  const showUserModal = () => {
    setVisible(true);
  };

  const hideUserModal = () => {
    setVisible(false);
  };

  const onFinish = (values) => {
    console.log('Finish:', values);
  };

  return (
    <>
      <Form.Provider
        onFormFinish={(name, { values, forms }) => {
          if (name === 'userForm') {
            const { basicForm } = forms;
            const items = basicForm.getFieldValue('items') || [];
            basicForm.setFieldsValue({
              items: [...items, values],
            });
            setVisible(false);
          }
        }}
      >
        <Form name='basicForm' onFinish={onFinish}>
          <Form.Item
            label=''
            shouldUpdate={(prevValues, curValues) =>
              prevValues.items !== curValues.items
            }
          >
            {({ getFieldValue }) => {
              const items = getFieldValue('items') || [];
              return items.length ? (
                <ul style={{ color: 'black' }}>
                  {items.map((item, index) => (
                    <table className='table-items'>
                      <tr key={index}>
                        <th> Quantity: </th>
                        <td>{item.qty}</td>
                        <th> Product Name: </th>
                        <td> {item.name} </td>
                        <th> Total Weight:</th>
                        <td> {item.weight} </td>
                      </tr>
                    </table>
                  ))}
                </ul>
              ) : (
                <Typography.Text className='ant-form-text' type='secondary'>
                  ( <SmileOutlined /> No items. )
                </Typography.Text>
              );
            }}
          </Form.Item>
          <Form.Item>
            <Button
              className='add-btn'
              htmlType='button'
              onClick={showUserModal}
            >
              Add Item
            </Button>
          </Form.Item>
        </Form>
        <ModalForm
          visible={visible}
          items={props.items}
          onCancel={hideUserModal}
        />
      </Form.Provider>
    </>
  );
}

export default Item;
