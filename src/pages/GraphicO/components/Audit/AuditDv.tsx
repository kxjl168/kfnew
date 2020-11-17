import React, { useRef } from "react";
import { Button, message } from "antd";
import { IconFontNew } from "@/components/MyCom/KIcon";
import { withPropsAPI } from "gg-editor";
import TextArea from "antd/lib/input/TextArea";

export interface AuditDvProps {
    propsAPI?:any;
}

const AuditDv: React.FC<AuditDvProps> = (props) => {

    const { ainfo } = props;
    const txtAuditInfo = useRef();

    const{propsAPI}=props;

    return <>
        <div style={{ margin: '0 auto', padding: '5px' }}>审核意见:<TextArea style={{ height: '25px', width: '300px' }} ref={txtAuditInfo} placeholder="审核意见" />
            <Button onClick={() => {

               // message.info(propsAPI);
             //  debugger;
             propsAPI.editor.set("auditData",[3,txtAuditInfo.current?.state.value])
                propsAPI.executeCommand("audit");

            }}>  <IconFontNew type="icon-btn-pass" />通过</Button><Button onClick={() => {

                propsAPI.editor.set("auditData",[5,txtAuditInfo.current?.state.value])
                propsAPI.executeCommand("audit");

            }}>  <IconFontNew type="icon-btn-modify-close" />不通过</Button>
            </div>
</> ;


}

export default withPropsAPI(AuditDv);