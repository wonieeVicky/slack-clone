import { IDM } from '@typings/db';
import React, { VFC, memo, useMemo } from 'react';
import { ChatWrapper } from './styles';
import gravatar from 'gravatar';
import dayjs from 'dayjs';
import regexifyString from 'regexify-string';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router';

interface Props {
  data: IDM;
}

const Chat: VFC<Props> = ({ data }) => {
  const { workspace } = useParams<{ workspace: string; channel: string }>();
  const user = data.Sender;
  // \d 숫자, +는 1개 이상 ?는 0개나 1개, *는 0개 이상을 의미함
  // g는 모두 찾기, |는 또는, \n은 줄바꿈
  // a?.b; // optional chaining
  // a??b; // nullish coalescing
  const result = useMemo(
    () =>
      regexifyString({
        input: data.content,
        pattern: /@\[(.+?)]\((\d+?)\)|\n/g,
        decorator(match, index) {
          const arr: string[] | null = match.match(/@\[(.+?)]\((\d+?)\)/)!;
          console.log(arr);
          if (arr) {
            return (
              <Link key={match + index} to={`/workspace/${workspace}/dm/${arr[2]}`}>
                @{arr[1]}
              </Link>
            );
          }
          return <br key={index} />;
        },
      }),
    [data.content],
  );

  return (
    <ChatWrapper>
      <div className="chat-img">
        <img src={gravatar.url(user.email, { s: '36px', d: 'retro' })} alt={user.nickname} />
      </div>
      <div className="chat-text">
        <div className="chat-user">
          <b>{user.nickname}</b>
          <span>{dayjs(data.createdAt).format('h:mm A')}</span>
        </div>
        <p>{result}</p>
      </div>
    </ChatWrapper>
  );
};

export default memo(Chat);
