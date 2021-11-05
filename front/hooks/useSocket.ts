import io from 'socket.io-client';
import { useCallback } from 'react';
import axios from 'axios';

// 타입스크립트는 빈 객체나 빈 배열은 타이핑을 해줘야 한다.
// [key: string] :: 어떤 키가 들어오든 문자열이기만 하면 된다.
const sockets: { [key: string]: SocketIOClient.Socket } = {};
const backUrl = 'http://localhost:3095';

const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);

  if (!workspace) {
    return [undefined, disconnect];
  }
  // 연결된 웹소켓이 있으면 그 정보를 return 없을 경우에만 connect 시도
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'], // 초기 연결 시 polling(ie9) 제외하고 websocket만 사용하는 설정
    });
  }
  return [sockets[workspace], disconnect];
};

export default useSocket;
