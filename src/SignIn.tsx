import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useState } from 'react';
import { Player } from './player';
import { useNavigate } from 'react-router-dom';

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};


function SignIn() {
    const player = new Player();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        try{
        setLoading(true)
        await player.signIn(values.username!, values.password!)
        navigate('/')
        } catch (e) {
            message.error((e as Error).message)
        } finally {
            setLoading(false)
        }
    };
    
    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = async (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    
    return <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        disabled={loading}
    >
        <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
        >
            <Input />
        </Form.Item>

        <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
        >
            <Input.Password />
        </Form.Item>

        <Form.Item<FieldType>
            name="remember"
            valuePropName="checked"
            wrapperCol={{ offset: 8, span: 16 }}
        >
            <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
        </Form.Item>
    </Form>
}
export default SignIn