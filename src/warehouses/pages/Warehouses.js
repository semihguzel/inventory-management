import React, { useEffect, useState, useContext } from "react";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import { v4 as uuidv4 } from "uuid";

import EditableTable from "../../shared/FormElements/EditableTable";

const Warehouses = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, error, clearError } = useHttpClient();

  const [warehouseList, setWarehouseList] = useState(null);
  const [newData, setNewData] = useState(null);

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

  const handleRowAdd = async () => {
    const uuid = uuidv4();
    const newRowData = {
      key: uuid,
      _id: uuid,
      name: "New Cell",
      location: "New Cell",
      editable: true,
      inputType: "text",
    };
    setNewData(newRowData);
    setWarehouseList([...warehouseList, newRowData]);

    return newRowData;
  };

  const columns = [
    {
      title: "Warehouse Name",
      dataIndex: "name",
      key: "name",
      editable: true,
      inputType: "text",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      editable: true,
      inputType: "text",
    },
  ];

  const createNewWarehouse = async (createEntity) => {
    if (newData) {
      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/warehouses`,
          "POST",
          JSON.stringify(createEntity),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          }
        );
      } catch (err) {
        throw new Error(err.message);
      }
      setNewData(null);
      getWarehouses();
    }
  };

  useEffect(() => {
    getWarehouses();
  }, [sendRequest]);

  return (
    <EditableTable
      handleRowAdd={handleRowAdd}
      tableList={warehouseList}
      setTableList={setWarehouseList}
      handleDeleteOk={handleDeleteOk}
      updateTableList={updateWarehouse}
      tableColumns={columns}
      newData={newData}
      setNewData={setNewData}
      createNewEntity={createNewWarehouse}
    />
  );
};

export default Warehouses;
