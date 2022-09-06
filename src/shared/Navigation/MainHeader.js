import React from "react";

import { Layout, Menu } from "antd";
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
            label: "Products",
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
