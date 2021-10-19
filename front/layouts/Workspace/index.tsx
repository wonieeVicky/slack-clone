import React, { FC, useCallback } from 'react';
import axios from 'axios';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import {
  Header,
  RightMenu,
  ProfileImg,
  WorkspaceWrapper,
  Workspaces,
  WorkspaceName,
  Chats,
  MenuScroll,
  Channels,
} from './styles';
import gravatar from 'gravatar';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

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
      <Header>
        <RightMenu>
          <span>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
          </span>
        </RightMenu>
      </Header>
      <button onClick={onLogout}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            {/* 계층적 Route: Switch 안에 Switch가 있을 경우 중첩 path를 가져야 한다.(/workspace) */}
            <Route path="/workspace/channel" exact component={Channel} />
            <Route path="/workspace/dm" exact component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
