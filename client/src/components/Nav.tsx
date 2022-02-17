import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const NavigationContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 4rem;
  background-color: #f50;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px 0px;
  text-align: center;
  line-height: 4rem;
  color: white;
  font-size: 2rem;
  font-weight: 700;
`;

const HomeBtn = styled.button`
  border: none;
  background: transparent;
  text-align: center;
  line-height: 4rem;
  color: white;
  font-size: 2rem;
  cursor: pointer;
`

const Nav = () => {
  const navigate = useNavigate()
  return (
    <NavigationContainer>
      <HomeBtn onClick={() => navigate('/')}>NAV</HomeBtn>
    </NavigationContainer>
  )
}

export default Nav;