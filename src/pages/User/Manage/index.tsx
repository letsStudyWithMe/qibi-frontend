import React, {useEffect, useState} from 'react';
import {message} from "antd";
import {listUserByPageUsingPost} from "@/services/qibi/userController";

const Manage: React.FC = () => {
  const initSearchParams = {
    pageSize: 12,
  }

  // @ts-ignore
  const [searchParams, setSearchParams] = useState<API.UserQueryRequest>({...initSearchParams});
  const [userList, setUserList] = useState<API.User[]>();
  const [total, setTotal] = useState<number>(0);

  const loadData = async (values: any) => {
    try {
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
    // 把页面内容指定一个类名add-chart
    <div className="user-list">
      用户数据
      {JSON.stringify(userList)}
      <br/>
      总数：{total}
    </div>
  );
};
export default Manage;
