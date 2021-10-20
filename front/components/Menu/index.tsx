import { CreateMenu, CloseModalButton } from '@components/Menu/styles';
import React, { CSSProperties, FC, useCallback } from 'react';

interface Props {
  show: boolean;
  onCloseModal: () => void;
  style: CSSProperties;
  closeButton?: boolean;
}

const Menu: FC<Props> = ({ closeButton, style, show, children, onCloseModal }) => {
  // 부모 태그로 이벤트 버블링 방지
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }
  return (
    <CreateMenu onClick={onCloseModal}>
      <div onClick={stopPropagation} style={style}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}
        {children}
      </div>
    </CreateMenu>
  );
};
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;
