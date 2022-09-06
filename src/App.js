import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Routes,
} from "react-router-dom";

import { Layout, Menu } from "antd";
import MainHeader from "./shared/Navigation/MainHeader";
import MainFooter from "./shared/Navigation/MainFooter";
import Products from "./products/pages/Products";

import "./App.css";

const { Content } = Layout;

const App = () => {
  let routes;

  routes = (
    <Routes>
      <Route path="/products" element={<Products />} />
    </Routes>
  );

  return (
    <Router>
      <Layout>
        <MainHeader />
        <Content>
          <Routes>
            <Route path="/products" element={<Products />} />
          </Routes>
        </Content>
        <MainFooter />
      </Layout>
    </Router>
  );
};

export default App;
