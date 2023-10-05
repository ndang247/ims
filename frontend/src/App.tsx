import { Dashboard, Items, Parcels, Sidebar, InboundPage } from "./components";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "antd";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App = () => {
  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Layout>
          <Header style={{ padding: 0, background: "#4796bd" }} />
          <Content style={{ margin: "0 16px" }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/parcels" element={<Parcels />} />
              <Route path="/items" element={<Items />} />
              <Route path="/inbound" element={<InboundPage />} />
            </Routes>
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
    </BrowserRouter>
  );
};

export default App;
