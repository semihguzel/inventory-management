import React, { useEffect, useState } from "react";
import { Space, Table, Button } from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Products = () => {
  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const [productList, setProductList] = useState(null);

  const deleteHandler = (id) => {
    console.log(id);
  };

  useEffect(() => {
    const getProducts = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/api/Products/`
        );
        responseData.items.forEach((item) => {
          item.key = item._id;
          item.warehouse = item.warehouse.name;
        });
        setProductList(responseData.items);
      } catch (err) {
        throw new Error(err.message);
      }
    };

    getProducts();
  }, [sendRequest]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "warehouse",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Update</Button>
          <Button
            type="primary"
            danger
            onClick={() => deleteHandler(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return <Table columns={columns} dataSource={productList} />;
};

export default Products;
