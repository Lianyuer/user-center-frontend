import {PlusOutlined} from '@ant-design/icons';
import {ActionType, ProColumns, TableDropdown} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Button, Image} from 'antd';
import {useRef} from 'react';
import {searchUsers} from '@/services/ant-design-pro/api';

export const waitTimePromise = async (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time: number = 100) => {
  await waitTimePromise(time);
};


const columns: ProColumns<API.CurrentUser>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'id',
    dataIndex: 'id',
    valueType: 'text',
  },
  {
    disable: true,
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
    valueType: 'text',
    ellipsis: true,
    copyable: true,
    // @ts-ignore
    search: true,
  },
  {
    disable: true,
    title: '头像',
    dataIndex: 'avatarUrl',
    search: false,
    render: (_, record) => (
      <div>
        <Image width={50} src={record.avatarUrl}></Image>
      </div>
    ),
  },
  {
    title: '性别',
    dataIndex: 'gender',
    valueType: 'select',
    sorter: true,
    valueEnum: {
      0: {
        text: '女',
      },
      1: {
        text: '男',
      },
    },
  },
  {
    title: '账号',
    dataIndex: 'userAccount',
    valueType: 'text',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNumber',
    valueType: 'text',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    valueType: 'text',
  },
  {
    title: '状态',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {},
  },
  {
    title: '角色',
    dataIndex: 'userRole',
    valueType: 'select',
    valueEnum: {
      0: {
        text: '普通用户',
        status: 'Default',
      },
      1: {
        text: '管理员',
        status: 'success',
      },
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    valueType: 'dateTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    valueType: 'dateTime',
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      // @ts-ignore
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => action?.reload()}
        menus={[
          {key: 'copy', name: '复制'},
          {key: 'delete', name: '删除'},
        ]}
      />,
    ],
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <ProTable<API.CurrentUser>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      // @ts-ignore
      request={async (params, sort, filter) => {
        const data = await searchUsers(params.nickName || '');
        return {
          data: data
        };
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: {fixed: 'right', disable: true},
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          // @ts-ignore
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 5,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      headerTitle="高级表格"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined/>}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};
