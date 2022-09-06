import React, { useEffect, useState } from "react";
import { Space, Table } from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Products = () => {
  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const [productList, setProductList] = useState(null);

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
          <a>Update</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    const getProducts = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:4000/api/Products/`
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

  return <Table columns={columns} dataSource={productList} />;
};

export default Products;
