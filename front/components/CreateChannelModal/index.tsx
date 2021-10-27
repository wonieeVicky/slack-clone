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
  setShowCreateChannelModal: (flag: boolean) => void;
}

const CreateChannelModal: VFC<Props> = ({ show, onCloseModal, setShowCreateChannelModal }) => {
  const [newChannel, onChangeNewChannel, setNewChannel] = useInput('');
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>(); // 현재 위치 url의 Params를 가져온다.

  const {
    data: userData,
    error,
    mutate: revalidateUser,
  } = useSWR<IUser | false>('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });

  // 현재 워크스페이스에 있는 채널들을 모두 가져오기
  // 만약 로그인하지 않은 상태일 경우 null 처리하여 swr이 요청하지 않도록 처리한다. - 조건부 요청 지원함
  const { data: channelData, mutate: revalidateChannel } = useSWR<IChannel[]>(
    userData ? `/api/workspaces/${workspace}/channels` : null,
    fetcher,
  );

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: newChannel, // 어떤 워크스페이스에 생성해야하는지를 모름 > 현재 채널이 어디있는지 useParams로 체크한다.
          },
          { withCredentials: true },
        )
        .then(() => {
          setShowCreateChannelModal(false);
          revalidateChannel(); // 채널리스트 다시 불러오기
          setNewChannel('');
        })
        .catch((error) => {
          console.dir(error);
          toast.error(error.response?.data, { position: 'bottom-center' });
        });
    },
    [newChannel],
  );
  return (
    <>
      <Modal show={show} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateChannel}>
          <Label id="channel-label">
            <span>채널</span>
            <Input id="channel" value={newChannel} onChange={onChangeNewChannel} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default CreateChannelModal;
