import { Command } from 'gg-editor';
import React from 'react';
import { IconFont } from '@/components/MyCom/KIcon';
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
    <>
        <div className='ClsMenu' style={{display:"none"}} >
        <Command  name={command}>
          <div className={styles.item}>
            <IconFont type={`icon-${icon || command}`} />
            <span>{text || upperFirst(command)}</span>
          </div>
        </Command>
        </div>


    </>)
};

//export default MenuItem;
export default MenuItem;