import React from 'react';
import { useAccess, history } from 'umi'


const Index = () => {
  const { isUser } = useAccess()
  if (isUser) {
    history.replace('/home')
  } else {
    history.replace('/login')
  }
  return (
    <></>
  )
};
export default Index;
