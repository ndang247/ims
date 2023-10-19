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
import { Layout } from "antd";
import "./App.css";
import { useState, useEffect } from "react";

const { Header, Content, Footer } = Layout;

const App = () => {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState<string | null>() 

  useEffect(() => {
    setLoading(true)
    setToken(localStorage.getItem('token'))
    setLoading(false)
  }, [])

  if (loading) {
    return <>Loading...</>
  }

  if (!token) {
    return <LoginPage />
  }

  return (
      <Routes>
        <Route element={<AuthRoute token={token} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/parcels" element={<Parcels />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ProductDetails />} />
          <Route path="/inbound" element={<InboundPage />} />
          <Route path="/outlet" element={<OutletPage />} />
          <Route
            path="/outlet/new-order"
            element={<NewOrderPage />}
          />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Route>
      </Routes>
  );
};

export function AuthRoute({ token }: { token: string | null | undefined }) {

  const location = useLocation()

  useEffect(() => {
    console.log('Location', location.pathname);
  }, [])

  if (token) {
    return  (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <Header style={{ padding: 0, background: "#4796bd" }} />
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
