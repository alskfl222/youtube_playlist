import styled from 'styled-components';

const Container = styled.div`
  height: 50vh;
  min-height: 720px;
`;

const Link = styled.a`
  font-size: 3rem;
  font-weight: 700;
  text-decoration: none;
`;

const Login = () => {
  return (
    <Container>
      <div>
        <Link href={`${process.env.REACT_APP_CLIENT_URL}/`}>HOME</Link>
      </div>
      <div>
        <Link href={`${process.env.REACT_APP_API_URL}/users/auth`}>
          GOOGLE LOGIN
        </Link>
      </div>
    </Container>
  );
};

export default Login;
