import styled from "styled-components";
import { useLocation } from 'react-router-dom'

const Player = () => {
  const { state } = useLocation()
  console.log(state)

  return (
    <>PLAYER</>
  )
}

export default Player;