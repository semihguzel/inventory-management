import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Warehouses.css";
import EditableTable from "../../shared/FormElements/EditableTable";

const Warehouses = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, error, clearError } = useHttpClient();

  const [warehouseList, setWarehouseList] = useState(null);

  const updateWarehouse = async (entity) => {
    if (entity && entity.id && entity.updateValues) {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/warehouses/${entity.id}`,
          "PATCH",
          JSON.stringify(entity.updateValues),
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

  const handleDeleteOk = async (selectedItemId) => {
    if (selectedItemId) {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/warehouses/${selectedItemId}`,
          "DELETE",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {
        throw new Error(err.message);
      }

      setWarehouseList((prevList) =>
        prevList.filter((warehouse) => warehouse._id !== selectedItemId)
      );
    }
  };

  const columns = [
    {
      title: "Warehouse Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      editable: true,
    },
  ];

  useEffect(() => {
    getWarehouses();
  }, [sendRequest]);

  return (
    <EditableTable
      tableList={warehouseList}
      setTableList={setWarehouseList}
      handleDeleteOk={handleDeleteOk}
      updateTableList={updateWarehouse}
      tableColumns={columns}
    />
  );
};

export default Warehouses;
