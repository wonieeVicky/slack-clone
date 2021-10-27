import React, { useCallback, VFC } from 'react';
import Modal from '@components/Modal';
import useInput from '@hooks/useInput';
import { Button, Input, Label } from '@pages/SignUp/styles';
import axios from 'axios';
import { useParams } from 'react-router';
import { toast, ToastContainer } from 'react-toastify';
import { IChannel, IUser } from '@typings/db';
import fetcher from '@utils/fetcher';
import useSWR from 'swr';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  setShowInviteWorkspaceModal: (flag: boolean) => void;
}

const InviteWorkspaceModal: VFC<Props> = ({ show, onCloseModal, setShowInviteWorkspaceModal }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>(); // 현재 위치 url의 Params를 가져온다.
  const [newMember, onChangeNewMember, setNewMember] = useInput('');

  const { data: userData } = useSWR<IUser | false>('/api/users', fetcher);
  const { mutate: revalidateMembers } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/members` : null,
    fetcher,
  );

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMember || !newMember.trim()) {
        return;
      }
      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: newMember,
          },
          { withCredentials: true },
        )
        .then(() => {
          revalidateMembers(); // 채널리스트 다시 불러오기
          setShowInviteWorkspaceModal(false);
          setNewMember('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [workspace, newMember],
  );
  return (
    <>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onInviteMember}>
          <Label id="member-label">
            <span>이메일</span>
            <Input id="channel" value={newMember} onChange={onChangeNewMember} />
          </Label>
          <Button type="submit">초대하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default InviteWorkspaceModal;
