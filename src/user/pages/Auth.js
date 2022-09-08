import { Form, Input, Button, Card, Space, Alert } from "antd";
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { clearError, error, isLoading, sendRequest } = useHttpClient();

  const [isLoginMode, setIsLoginMode] = useState(true);

  const submitHandler = async (values) => {
    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/login`,
          "POST",
          JSON.stringify({ email: values.email, password: values.password }),
          {
            "Content-Type": "application/json",
          }
        );

        auth.login(responseData.userId, responseData.token);
        navigate("/");
      } catch (err) {
        debugger;
      }
    } else {
    }
  };

  const switchModeHandler = () => {
    form.resetFields();
    setIsLoginMode((prevMode) => !prevMode);
  };
  const errorCloseHandler = () => {
    clearError();
  };

  return (
    <React.Fragment>
      {error && (
        <Alert
          type="error"
          message="Error"
          description={error}
          closable
          onClose={errorCloseHandler}
        />
      )}
      <Space
        direction="vertical"
        size="large"
        style={{
          display: "flex",
          textAlign: "center",
          justifyContent: "center",
          minHeight: "100hv",
        }}
      >
        <Card>
          <Form
            form={form}
            name="basic"
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 8,
            }}
            initialValues={{
              remember: true,
            }}
            onFinish={submitHandler}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 7,
                span: 10,
              }}
            >
              <Button
                size="large"
                style={{ width: "150px" }}
                type="primary"
                htmlType="submit"
              >
                {isLoginMode ? "Login" : "Signup"}
              </Button>
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 7,
                span: 10,
              }}
            >
              <Button
                size="large"
                style={{ width: "250px" }}
                type="primary"
                onClick={switchModeHandler}
              >
                SWITCH TO {isLoginMode ? "Signup" : "Login"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Space>
    </React.Fragment>
  );
};

export default Auth;
