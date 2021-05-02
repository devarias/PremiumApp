import React from 'react';
import { Modal } from 'antd';
import '../styles/ModalBox.css';

function ModalBox(props) {
  const info = props.modalContent[0];
  const handleOk = () => {
    props.setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        title='Sell Order Detail'
        visible={props.isModalVisible}
        onOk={handleOk}
        onCancel={handleOk}
        cancelButtonProps={{ style: { display: 'none' } }}
        width={900}
        okButtonProps={{
          style: {
            background: '#6e60ff',
            color: '#fff',
            borderRadius: '12px',
            borderColor: '#211953',
          },
        }}
      >
        <div>
          {info ? (
            <div className='modalBox'>
              <div>
                Order Information - {info.orderID}
                <table className='table-items'>
                  <tr>
                    <th>External Order Number:</th>
                    <td>{info.orderInfo.externalOrderNumber}</td>
                    <th>Buyer Full Name:</th>
                    <td>{info.orderInfo.buyer.name}</td>
                    <th>Buyer Phone Number:</th>
                    <td>{info.orderInfo.buyer.phone}</td>
                    <th>Buyer Email:</th>
                    <td>{info.orderInfo.buyer.email}</td>
                  </tr>
                </table>
              </div>
              <div className='section'>
                Shipping Info
                <table className='table-items'>
                  <tr>
                    <th> Address:</th>
                    <td>{info.orderInfo.shipping.address}</td>
                    <th> City: </th>
                    <td>{info.orderInfo.shipping.city}</td>
                    <th> Region: </th>
                    <td>{info.orderInfo.shipping.region}</td>
                    <th> Country: </th>
                    <td>{info.orderInfo.shipping.country}</td>
                  </tr>
                </table>
              </div>
              <div className='section'>
                Promise dates
                <table className='table-items'>
                  <tr>
                    <th> Pack Promise Min: </th>
                    <td>
                      {info.promises.packPromiseMin
                        ? info.promises.packPromiseMin.slice(0, 22)
                        : 'null'}
                    </td>
                    <th> Pack Promise Max: </th>
                    <td>
                      {info.promises.packPromiseMax
                        ? info.promises.packPromiseMax.slice(0, 22)
                        : 'null'}
                    </td>
                  </tr>
                </table>
                <table className='table-items'>
                  <tr>
                    <th> Ship Promise Min: </th>
                    <td>
                      {info.promises.shipPromiseMin
                        ? info.promises.shipPromiseMin.slice(0, 22)
                        : 'null'}
                    </td>
                    <th> Ship Promise Max: </th>
                    <td>
                      {info.promises.shipPromiseMax
                        ? info.promises.shipPromiseMax.slice(0, 22)
                        : 'null'}
                    </td>
                  </tr>
                </table>
                <table className='table-items'>
                  <tr>
                    <th> Delivery Promise Min:</th>
                    <td>
                      {info.promises.deliveryPromiseMin
                        ? info.promises.deliveryPromiseMin.slice(0, 22)
                        : 'null'}
                    </td>
                    <th> Delivery Promise Max: </th>
                    <td>
                      {info.promises.deliveryPromiseMax
                        ? info.promises.deliveryPromiseMax.slice(0, 22)
                        : 'null'}
                    </td>
                  </tr>
                </table>
                <table className='table-items'>
                  <tr>
                    <th>Ready Pickup Promise Min: </th>
                    <td>
                      {info.promises.readyPickupPromiseMin
                        ? info.promises.readyPickupPromiseMin.slice(0, 22)
                        : 'null'}{' '}
                    </td>
                    <th>Ready Pickup Promise Max:</th>
                    <td>
                      {info.promises.readyPickupPromiseMax
                        ? info.promises.readyPickupPromiseMax.slice(0, 22)
                        : 'null'}{' '}
                    </td>
                  </tr>
                </table>
              </div>
              <div>
                <table className='table-items'>
                  Item List
                  {info.orderInfo.items.map((item) => (
                    <tr key={item.name}>
                      <th>Name:</th>
                      <td>{item.name}</td>
                      <th>Quantity:</th>
                      <td>{item.quantity}</td>
                      <th>Weight:</th>
                      <td>{item.weight} Kg</td>
                    </tr>
                  ))}
                </table>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </>
  );
}
export default ModalBox;
