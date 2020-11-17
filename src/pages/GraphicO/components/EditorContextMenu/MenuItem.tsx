import { Command } from 'gg-editor';
import React from 'react';
import {IconFont, IconFontNew} from '@/components/MyCom/KIcon';
import styles from './index.less';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

interface MenuItemProps {
  command: string;
  icon?: string;
  text?: string;
}
const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <div className={styles.item}>
        <IconFontNew type={`icon-${icon || command}`} />
        <span>{text || upperFirst(command)}</span>
      </div>
    </Command>
  );
};

export default MenuItem;
