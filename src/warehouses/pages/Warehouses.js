import React, { useEffect, useState, useContext } from "react";
import { Button, Space, Table, Modal } from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const Warehouses = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const [warehouseList, setWarehouseList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const showModal = (selectedItemId) => {
    setIsModalOpen(true);
    setSelectedItemId(selectedItemId);
  };

  const getProducts = async () => {
    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/warehouses/`
      );
      responseData.items.forEach((item) => {
        item.key = item._id;
      });
      setWarehouseList(responseData.items);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    if (selectedItemId) {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/warehouses/${selectedItemId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      setWarehouseList((prevList) =>
        prevList.filter((warehouse) => warehouse._id !== selectedItemId)
      );
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Warehouse Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Update</Button>
          <Button type="primary" danger onClick={() => showModal(record._id)}>
            Delete
          </Button>
          <Modal
            title="Delete"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Do you want to delete?</p>
          </Modal>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getProducts();
  }, [sendRequest]);

  return <Table columns={columns} dataSource={warehouseList} />;
};

export default Warehouses;
