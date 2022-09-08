import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import { Layout, Menu } from "antd";
import MainHeader from "./shared/Navigation/MainHeader";
import MainFooter from "./shared/Navigation/MainFooter";
import Products from "./products/pages/Products";
import Warehouses from "./warehouses/pages/Warehouses";
import Auth from "./user/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";
import { useAuth } from "./shared/hooks/auth-hook";

import "./App.css";

const { Content } = Layout;

const App = () => {
  const { login, logout, token, userId } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout,
      }}
    >
      <Router>
        <Layout>
          <MainHeader />
          <Content
            style={{
              padding: 80,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<Products />} />
              <Route path="/products" element={<Products />} />
              <Route path="/warehouses" element={<Warehouses />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Content>
          <MainFooter />
        </Layout>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
