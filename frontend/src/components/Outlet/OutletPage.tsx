import React from "react"
import { Button } from "antd"
import { useNavigate } from "react-router-dom"

const OutletPage: React.FC = () => {

  const navigate = useNavigate()

  return (<div>
    <h1>Outlet Page</h1>
    <Button
      onClick={() => {
        navigate("/new-order")
      }}
    >Make a new order</Button>
  </div>)
}

export default OutletPage