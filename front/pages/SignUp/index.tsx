﻿import React, { useState, useCallback } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import axios from 'axios';
import useInput from '@hooks/useInput'; // hook import
import fetcher from '@utils/fetcher';
import { Header, Form, Label, Input, Error, Button, LinkContainer, Success } from './styles';

const SignUp = () => {
  const { data, error, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 100000,
  });

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, , setPassword] = useInput('');
  const [passwordCheck, , setPasswordCheck] = useInput('');
  const [mismatchError, setMismatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const onChangePassword = useCallback(
    (e) => {
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [passwordCheck, setPassword],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password, setPasswordCheck],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!mismatchError && nickname) {
        // 비동기 요청 안에서 state 변경 코드가 들어갈 경우 코드 시작 전에 초기화 코드를 넣어주는 것이 좋다.
        setSignUpError('');
        setSignUpSuccess(false);
        axios
          .post('/api/users', {
            email,
            nickname,
            password,
          })
          .then((response) => {
            console.log(response);
            setSignUpSuccess(true);
          })
          .catch((err) => {
            setSignUpError(err.response.data);
          })
          .finally(() => {});
      }
    },
    [email, nickname, password, mismatchError],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  // return은 항상 Hooks 보다 아래에 있어야 한다.
  if (data) {
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>환영합니다! 이제 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요? &nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default SignUp;
