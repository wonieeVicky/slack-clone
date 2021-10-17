import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router-dom';
import useSWR from 'swr';

// FC 타입 안에 children이 들어있음, children을 안쓸 경우 VFC로 사용한다.
const Workspace: FC = ({ children }) => {
  const { data, error, mutate } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 100000, // 100초
  });

  const onLogout = useCallback(
    () => axios.post('/api/users/logout', null, { withCredentials: true }).then(() => mutate(false, false)),
    [],
  );

  if (!data) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
