import React, { useEffect, useState, useContext } from "react";
import { Space, Table, Button } from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import EditableTable from "../../shared/FormElements/EditableTable";
import { v4 as uuidv4 } from "uuid";

const Products = () => {
  const auth = useContext(AuthContext);

  const { sendRequest, clearError, error, isLoading } = useHttpClient();
  const [productList, setProductList] = useState(null);
  const [warehouseList, setWarehouseList] = useState(null);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState(null);
  const [newData, setNewData] = useState(null);

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

  useEffect(() => {
    getProducts();
    getWarehouses();
  }, [sendRequest]);

  const updateProduct = async (entity) => {
    if (entity && entity.id && entity.updateValues) {
      const updatedProduct = {
        warehouseId: selectedWarehouseId,
        name: entity.updateValues.name,
        description: entity.updateValues.description,
      };
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products/${entity.id}`,
          "PATCH",
          JSON.stringify(updatedProduct),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {
        throw new Error(err.message);
      }
    }
  };

  const deleteProduct = async (selectedItemId) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/api/products/${selectedItemId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + auth.token }
      );
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDeleteOk = async (selectedItemId) => {
    if (selectedItemId) {
      deleteProduct(selectedItemId);

      setProductList((prevList) =>
        prevList.filter((product) => product._id !== selectedItemId)
      );
    }
  };

  const getWarehouses = async () => {
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

  const onWarehouseSelected = (value, record) => {
    setSelectedWarehouseId(record.key);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      inputType: "text",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      editable: true,
      inputType: "text",
    },
    {
      title: "Warehouse",
      dataIndex: "warehouse",
      key: "warehouse",
      editable: true,
      inputType: "select",
      data: warehouseList,
      onSelect: onWarehouseSelected,
    },
    {
      dataIndex: "warehouseId",
      key: "warehouseId",
      visible: false,
    },
  ];

  const handleRowAdd = async () => {
    const uuid = uuidv4();
    const newRowData = {
      key: uuid,
      _id: uuid,
      name: "New Cell",
      description: "New Cell",
      warehouse: warehouseList.length > 0 ? warehouseList[0].name : "",
      editable: true,
      inputType: "text",
    };
    setNewData(newRowData);
    setProductList([...productList, newRowData]);

    return newRowData;
  };

  const createNewProduct = async (createEntity) => {
    if (newData && createEntity) {
      const warehouse = warehouseList.find(
        (item) => item.name === createEntity.warehouse
      );
      if (!warehouse)
        throw new Error("There has been an error when creating product.");

      const productEntity = {
        name: createEntity.name,
        description: createEntity.description,
        warehouseId: warehouse._id,
      };
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/products`,
          "POST",
          JSON.stringify(productEntity),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {
        throw new Error(err.message);
      }
      setNewData(null);
      getProducts();
    }
  };

  return (
    <EditableTable
      tableList={productList}
      setTableList={setProductList}
      handleDeleteOk={handleDeleteOk}
      updateTableList={updateProduct}
      tableColumns={columns}
      handleRowAdd={handleRowAdd}
      newData={newData}
      setNewData={setNewData}
      createNewEntity={createNewProduct}
    />
  );
};

export default Products;
