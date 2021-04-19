import React, { useState } from 'react';
import { NextPage } from "next";
import { useGetTaskListQuery, useCreateTaskMutation } from "@app/graphql";
import { Table, Button, Modal, Form, Input, Select } from 'antd';


const TaskList: NextPage = () => {

  const { data, loading, error, refetch } = useGetTaskListQuery({
    variables: {
    },
  });

  const [createTaskMutation, { data: createTaskData, loading: createTaskLoading, error: createTaskError }] = useCreateTaskMutation(
    // variables: {
    //    title: // value for 'title'
    //    description: // value for 'description'
    //    status: // value for 'status'
    // },
  );

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div>
      <Button onClick={() => setModalVisible(true)} style={{ marginBottom: '10px' }}>
        New Task
      </Button>
      <Table
        loading={loading}
        dataSource={!loading && data.tasks.nodes}
        columns={[
          {
            title: 'Title',
            dataIndex: 'title',
            key: 'title'
          },
          {
            title: 'Description',
            dataIndex: 'description',
            key: 'description'
          },
          {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: text => (
              {
                "TO_DO" : "To Do",
                "IN_PROGRESS": "In Progress",
                "DONE": "Done"
              }[text]
            )
          }
        ]}
      />
      <Modal title="New Task" footer={() => <div />} onCancel={() => setModalVisible(false)} visible={modalVisible}>
        <Form
          onFinish={async data => {
            console.log(data)
            await createTaskMutation({
              variables: {
                ...data
              }
            })

            setModalVisible(false)
            refetch()

          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Required!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Required!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" rules={[{ required: true, message: 'Required!' }]} label="Status">
           <Select>
            <Select.Option value="TO_DO">To Do</Select.Option>
            <Select.Option value="IN_PROGRESS">In Progress</Select.Option>
            <Select.Option value="DONE">Done</Select.Option>
          </Select>
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit">Create Task</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>

  )
}

export default TaskList;
