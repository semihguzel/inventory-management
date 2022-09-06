import React from "react";

import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;

const MainHeader = () => {
  return (
    <Header>
      <Menu
        style={{ justifyContent: "flex-end" }}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["user"]}
        items={[
          {
            key: "products",
            label: <Link to="/products">Products</Link>,
          },
          {
            key: "warehouses",
            label: "Warehouses",
          },
          {
            key: "user",
            label: "User",
          },
        ]}
      />
    </Header>
  );
};

export default MainHeader;
