import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { getPlayerItems } from '../apis'
import styled from "styled-components";

const Player = () => {
  const { state } = useLocation()
  const [ lists, setlists ] = useState<any>(state)
  const hrefs = lists.map((el:any) => el.href)
  console.log(hrefs)

  useEffect(() => {
    getPlayerItems(hrefs).then(res => console.log(res))
  })

  return (
    <>
    {typeof state}
    </>
  )
}

export default Player;