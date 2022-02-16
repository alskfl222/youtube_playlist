import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = (props: any) => {
  const { isLogin } = props
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLogin) {
      navigate('/login')
    } else {
      navigate('/lists')
    }
  })

  return (
    <div>
      Home
    </div>
  )
}

export default Home;