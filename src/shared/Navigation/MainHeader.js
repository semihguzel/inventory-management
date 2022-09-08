import React, { useContext } from "react";

import { Button, Layout, Menu } from "antd";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const { Header } = Layout;

const MainHeader = () => {
  const auth = useContext(AuthContext);
  let menuItems;

  if (!auth.isLoggedIn) {
    menuItems = [
      {
        key: "products",
        label: <Link to="/products">Products</Link>,
      },
      {
        key: "warehouses",
        label: <Link to="/warehouses">Warehouses</Link>,
      },
      {
        key: "login",
        label: <Link to="/auth">Login</Link>,
      },
    ];
  } else {
    menuItems = [
      {
        key: "products",
        label: <Link to="/products">Products</Link>,
      },
      {
        key: "warehouses",
        label: <Link to="/warehouses">Warehouses</Link>,
      },
      {
        key: "logout",
        label: (
          <Button danger type="text" onClick={auth.logout}>
            Logout
          </Button>
        ),
      },
    ];
  }

  return (
    <Header>
      <Menu
        style={{ justifyContent: "flex-end" }}
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["login"]}
        items={menuItems}
      />
    </Header>
  );
};

export default MainHeader;
