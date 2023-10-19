import {
  Dashboard,
  Items,
  Parcels,
  Sidebar,
  InboundPage,
  LoginPage,
  SignupPage,
  OutletPage,
  NewOrderPage,
  ProductDetails,
  UserManagement,
} from "./components";
import { Route, Routes, Navigate, Outlet, useLocation } from "react-router-dom";
import { Layout, Dropdown, Button } from "antd";
import { UserOutlined } from '@ant-design/icons';
import "./App.css";
import { useState, useEffect, useMemo } from "react";
import type { MenuProps } from 'antd';

import { useAuth } from "./Auth";

const { Header, Content, Footer } = Layout;

const App = () => {
  // const [token, setToken] = useState<string | null>() 

  const { currentUser, loading} = useAuth()

  const routeType = useMemo(() => {
    if (currentUser) {
      console.log('Route type', currentUser.role);
      return currentUser.role
    }
    return 'guest'
  }, [currentUser?.role])

  if (loading) {
    return <>Loading...</>
  }

  if (!currentUser) {
    return <div className="container">
    <div className="row">
      <div className="col">
        <LoginPage />
      </div>
      <div className="col">
        <SignupPage />
      </div>
    </div>
  </div>
  }

  return (
      <Routes>
        { (routeType === 'manager' || routeType === 'owner' || routeType === 'staff') && (
        <Route element={<ManagerRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ProductDetails />} />
          <Route path="/inbound" element={<InboundPage />} />
          <Route path="/outlet" element={<OutletPage />} />
          
          <Route path="/users" element={<UserManagement />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>
        )
        }
        { routeType === 'outlet' && (
        <Route element={<OutletRoute/>}>
          <Route path="/" element={<OutletPage/>}/>
          <Route
            path="/new-order"
            element={<NewOrderPage />}
          />
        </Route>
        )
        }
      </Routes>
  );
};

export function OutletRoute() {

  const { currentUser, logout } = useAuth()

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>{currentUser?.username}</>
      )
    },
    {
      key: '2',
      label: (
        <Button onClick={() => {logout()}}>
          Log out
        </Button>
      )
    },
  ]

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Header style={{ background: '#4796bd', padding: '0 50px' }}>
          <div style={{ float: 'right', marginTop: '5px', marginBottom: '5px' }}>
            <Dropdown menu={{items}} placement="bottomRight">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<UserOutlined />} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
            <Outlet />
        </Content>
        <Footer
          style={{
            backgroundColor: "#4796bd",
            textAlign: "center",
            color: "#fff",
            fontSize: "1.15em",
          }}
        >
          IMS © 2023 Created by DC
        </Footer>
      </Layout>
    </Layout>
  )
}

export function ManagerRoute() {

  const location = useLocation()

  const { currentUser, logout } = useAuth()

  useEffect(() => {
    console.log('Auth Route', currentUser);
    console.log('Location', location.pathname);
  }, [])

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>{currentUser?.username}</>
      )
    },
    {
      key: '2',
      label: (
        <Button onClick={() => {logout()}}>
          Log out
        </Button>
      )
    },
  ]

  if (currentUser) {
    return  (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ background: '#4796bd', padding: '0 50px' }}>
          <div style={{ float: 'right', marginTop: '5px', marginBottom: '5px' }}>
            <Dropdown menu={{items}} placement="bottomRight">
              <Button 
                type="primary" 
                shape="circle" 
                icon={<UserOutlined />} 
                style={{ 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content style={{ margin: "0 16px" }}>
            <Outlet />
        </Content>
        <Footer
          style={{
            backgroundColor: "#4796bd",
            textAlign: "center",
            color: "#fff",
            fontSize: "1.15em",
          }}
        >
          IMS © 2023 Created by DC
        </Footer>
      </Layout>
    </Layout>)
  }

  return <Navigate to="/" />
}

export default App;
