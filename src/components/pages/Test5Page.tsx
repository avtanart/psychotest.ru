import React from 'react';
import { useParams } from 'react-router-dom';
import Test5Task from './Test5Task';

const Test5Page: React.FC = () => {
  const { pageNumber } = useParams<{ pageNumber: string }>();
  const taskId = pageNumber ? parseInt(pageNumber, 10) : 1;
  
  return <Test5Task taskId={taskId} />;
};

export default Test5Page;





