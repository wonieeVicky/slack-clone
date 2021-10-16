﻿import React, { useState, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import useInput from '@hooks/useInput';
import { Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/styles';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';

const LogIn = () => {
  // 로그인 후 데이터 전달, fetcher에서 주소를 어떻게 처리할지 작성한다.
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post('http://localhost:3095/api/users/login', { email, password }, { withCredentials: true })
        .then(() => mutate())
        .catch((error) => setLogInError(error.response?.data?.statusCode === 401));
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  // data와 error가 바뀌는 순간 리렌더링됨
  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
