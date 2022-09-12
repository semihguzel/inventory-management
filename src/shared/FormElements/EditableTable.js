import React, { useEffect, useState } from "react";
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

import "./EditableTable.css";

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

const EditableTable = (props) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [columns, setColumns] = useState(null);

  const isEditing = (record) => record.key === editingKey;

  const updateEdit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.key);
  };

  const updateCancel = () => {
    setEditingKey("");
  };

  const updateSave = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...props.tableList];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        await props.updateTableList({ id: key, updateValues: row });
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        props.setTableList(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        props.setTableList(newData);
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

  const handleDeleteCancel = () => {
    setIsModalOpen(false);
  };

  const onHandleDeleteOk = () => {
    setIsModalOpen(false);
    props.handleDeleteOk(selectedItemId);
  };

  const actionColumn = {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Modal
          title="Delete"
          open={isModalOpen}
          onOk={onHandleDeleteOk}
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
  };

  useEffect(() => {
    const tableColumns = [...props.tableColumns, actionColumn];
    setColumns(
      tableColumns.map((col) => {
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
      })
    );
  }, [props.tableColumns, actionColumn]);

  const updateColumn = (record) => {
    const editable = record.key === editingKey;

    return editable ? (
      <span>
        <Button
          onClick={() => updateSave(record.key)}
          style={{
            marginRight: 8,
          }}
          type="primary"
        >
          Save
        </Button>
        <Popconfirm title="Sure to cancel?" onConfirm={updateCancel}>
          <Button danger>Cancel</Button>
        </Popconfirm>
      </span>
    ) : (
      <Button
        disabled={editingKey !== ""}
        onClick={() => updateEdit(record)}
        type="primary"
      >
        Update
      </Button>
    );
  };

  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        columns={columns}
        dataSource={props.tableList}
        pagination={{
          onChange: updateCancel,
        }}
        rowClassName="editable-row"
      />
    </Form>
  );
};

export default EditableTable;
