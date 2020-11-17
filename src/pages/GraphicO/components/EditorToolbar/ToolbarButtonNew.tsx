import { Command } from 'gg-editor';
import React, { Fragment } from 'react';
import { Tooltip } from 'antd';
import {IconFontNew} from '@/components/MyCom/KIcon';
import styles from './index.less';

const upperFirst = (str: string) =>
  str.toLowerCase().replace(/( |^)[a-z]/g, (l: string) => l.toUpperCase());

interface ToolbarButtonProps {
  command: string;
  icon?: string;
  text?: string;
}
const ToolbarButtonNew: React.FC<ToolbarButtonProps> = (props) => {
  const { command, icon, text } = props;

  return (
    <Fragment>
    <Command name={command}>
      <Tooltip
        title={text || upperFirst(command)}
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        <IconFontNew type={`icon-${icon || command}`} />
      </Tooltip>
    </Command>
    </Fragment>
  );
};

export default ToolbarButtonNew;
