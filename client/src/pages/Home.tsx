import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()

  return (
    <div>
      <a href={`${process.env.REACT_APP_CLIENT_URL}/lists`}>list</a>
      <br />
      <a href={`${process.env.REACT_APP_CLIENT_URL}/login`}>login</a>
    </div>
  )
}

export default Home;