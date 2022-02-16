import styled from 'styled-components';

const Container = styled.div`
  height: 50vh;
  min-height: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginLink = styled.a`
  font-size: 3rem;
  font-weight: 700;
  text-decoration: none;
`

const Login = () => {
  return (
    <Container>
      <LoginLink href={"http://localhost:4000/users/auth"}>GOOGLE LOGIN</LoginLink>
    </Container>
  )
}

export default Login;