import { Dashboard, Items, Parcels, Sidebar } from "./components";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Layout, theme } from "antd";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header style={{ padding: 0, background: colorBgContainer }} />
          <Content style={{ margin: "0 16px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/parcels" element={<Parcels />} />
              <Route path="/items" element={<Items />} />
            </Routes>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            IMS © 2023 Created by DC
          </Footer>
        </Layout>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
