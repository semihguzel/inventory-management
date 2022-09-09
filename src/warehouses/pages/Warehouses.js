import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  Space,
  Table,
  Modal,
  Input,
  Form,
  Typography,
  Popconfirm,
} from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

import "./Warehouses.css";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const Warehouses = () => {
  const auth = useContext(AuthContext);
  const { sendRequest, error, clearError } = useHttpClient();

  const [form] = Form.useForm();
  const [warehouseList, setWarehouseList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const updateEdit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  const updateCancel = () => {
    setEditingKey("");
  };

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

  const updateSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...warehouseList];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        await updateWarehouse({ id: key, updateValues: row });
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setWarehouseList(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setWarehouseList(newData);
        setEditingKey("");
      }
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const showModal = (selectedItemId) => {
    setIsModalOpen(true);
    setSelectedItemId(selectedItemId);
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

  const handleDeleteOk = async () => {
    setIsModalOpen(false);
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

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const updateColumn = (record) => {
    const editable = isEditing(record);

    return editable ? (
      <span>
        <Typography.Link
          onClick={() => updateSave(record.key)}
          style={{
            marginRight: 8,
          }}
        >
          Save
        </Typography.Link>
        <Popconfirm title="Sure to cancel?" onConfirm={updateCancel}>
          <a>Cancel</a>
        </Popconfirm>
      </span>
    ) : (
      <Typography.Link
        disabled={editingKey !== ""}
        onClick={() => updateEdit(record)}
      >
        Update
      </Typography.Link>
    );
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Modal
            title="Delete"
            open={isModalOpen}
            onOk={handleDeleteOk}
            onCancel={handleDeleteCancel}
          >
            <p>Do you want to delete?</p>
          </Modal>
          {updateColumn(record)}
          <Button type="primary" danger onClick={() => showModal(record._id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  useEffect(() => {
    getWarehouses();
  }, [sendRequest]);

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        columns={mergedColumns}
        dataSource={warehouseList}
        pagination={{
          onChange: updateCancel,
        }}
        rowClassName="editable-row"
      />
    </Form>
  );
};

export default Warehouses;
