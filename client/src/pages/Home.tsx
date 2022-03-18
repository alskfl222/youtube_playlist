import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!!localStorage.getItem('isLogin')) {
      navigate('/lists')
    } else {
      navigate('/login')
    }
  })

  return (
    <div>
      Home
    </div>
  )
}

export default Home;