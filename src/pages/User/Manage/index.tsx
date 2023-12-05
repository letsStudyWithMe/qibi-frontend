import React, {useEffect, useRef, useState} from 'react';
import {Button, message, Modal, Popconfirm, Space, Table} from "antd";
import {deleteUserUsingPost, listUserByPageUsingPost} from "@/services/qibi/userController";
import {ColumnsType} from "antd/es/table";
import {data} from "@umijs/utils/compiled/cheerio/lib/api/attributes";

const Manage: React.FC = () => {
  const initSearchParams = {
    page: 1,
    pageSize: 10,
  };
  // @ts-ignore
  const [searchParams, setSearchParams] = useState<API.UserQueryRequest>({...initSearchParams});
  const [deleteParams, setDeleteParams] = useState<API.DeleteRequest>();
  const [userList, setUserList] = useState<API.User[]>();
  const [total, setTotal] = useState<number>(0);

  const loadData = async (page: any, pageSize: any) => {
    try {
      searchParams.pageSize = pageSize ?? 10;
      searchParams.current = page ?? 1;
      const res = await listUserByPageUsingPost(searchParams);
      if (res.data) {
        setUserList(res.data.records ?? []);
        // @ts-ignore
        setTotal(res.data.total ?? 0);
      } else {
        message.error("获取用户列表失败");
      }
    } catch (e: any) {
      message.error("获取用户列表失败," + e.message);
    }
  };

  useEffect(() => {
    // @ts-ignore
    loadData();
  }, [searchParams]);

  return (
    <Table
      rowKey={"id"}
      pagination={{
        total: total,
        pageSizeOptions: [10, 20, 50, 100],
        onChange: loadData,
        showTotal: total => `共${total}条记录 `,
        defaultPageSize: 10,
        defaultCurrent: 1,
        position: ['bottomRight'],
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      style={{marginTop: 20}}
      columns={columnss}
      dataSource={userList}/>
  );
};

const columnss: ColumnsType<API.User> = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    key: 'userAccount',
  },
  {
    title: '昵称',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '头像',
    key: 'userAvatar',
    dataIndex: 'userAvatar',
  },
  {
    title: '角色',
    key: 'userRole',
    dataIndex: 'userRole',
  }, {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
  },
  {
    title: '操作',
    key: 'action',
    render: (txt, record, index) =>{
      return (
        <div>
          <Button type="primary" size="small">编辑</Button>&nbsp;&nbsp;
          <Popconfirm title="确定要删除此项？" onCancel={()=>console.log('取消删除')} onConfirm={()=>
            {
              const res =  deleteUserUsingPost(txt).then(data=>data.data);
              if (!res) {
                message.success("删除失败")
              }else {
                message.success("删除成功")
                location.reload();
              }
            }
          }>
            <Button type="primary" size="small">删除</Button>
          </Popconfirm>
        </div>
      )
    }
  },
];
export default Manage;
