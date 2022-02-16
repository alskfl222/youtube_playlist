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

const Nav = () => {
  return (
    <NavigationContainer>
      YOUTUBE-PLAYLIST NAV
    </NavigationContainer>
  )
}

export default Nav;