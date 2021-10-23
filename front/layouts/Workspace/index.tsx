import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Switch, Route, Redirect, Link } from 'react-router-dom';
import useSWR from 'swr';
import loadable from '@loadable/component';
import { toast, ToastContainer } from 'react-toastify';
import fetcher from '@utils/fetcher';
import { IUser } from '@typings/db';
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
  ProfileModal,
  LogOutButton,
  WorkspaceButton,
  AddButton,
} from './styles';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { Button, Input, Label } from '@pages/SignUp/styles';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import 'react-toastify/dist/ReactToastify.css';

const Channel = loadable(() => import('@pages/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage'));

// FC 타입 안에 children이 들어있음, children을 안쓸 경우 VFC로 사용한다.
const Workspace = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');
  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });

  const onLogout = useCallback(
    () => axios.post('/api/users/logout', null, { withCredentials: true }).then(() => revalidateUser(false, false)),
    [],
  );

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();

      if (!newWorkspace || !newWorkspace.trim()) return;
      if (!newUrl || !newUrl.trim()) return;

      axios
        .post(
          '/api/workspaces',
          {
            workspace: newWorkspace,
            url: newUrl,
          },
          {
            withCredentials: true,
          },
        )
        .then(() => {
          revalidateUser();
          setShowCreateWorkspaceModal(false);
          setNewWorkspace('');
          setNewUrl('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data || '에러가 발생했습니다.', { position: 'bottom-center' });
        });
    },
    [newWorkspace, newUrl],
  );

  const onCloseModal = useCallback(() => setShowCreateWorkspaceModal(false), []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.nickname} />
                  <div>
                    <span id="profile-name">{userData.nickname}</span>
                    <span id="profile-active">Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>;
        </Workspaces>
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
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id="workspace-label">
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id="workspace-url-label">
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </div>
  );
};

export default Workspace;
