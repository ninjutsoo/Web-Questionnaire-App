import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Typography, Badge } from 'antd';
import { 
  FormOutlined, 
  RobotOutlined, 
  UserOutlined, 
  LogoutOutlined,
  HomeOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';
import ProfileModal from './ProfileModal';

const { Header, Content } = Layout;
const { Text } = Typography;

const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [selectedKey, setSelectedKey] = useState('home');
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    // Set selected key based on current route
    if (location.pathname === '/questionnaire') {
      setSelectedKey('questionnaire');
    } else if (location.pathname === '/ai-chatbot') {
      setSelectedKey('ai-chatbot');
    } else if (location.pathname === '/home') {
      setSelectedKey('home');
    }
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuClick = ({ key }) => {
    setSelectedKey(key);
    switch (key) {
      case 'home':
        navigate('/home');
        break;
      case 'questionnaire':
        navigate('/questionnaire');
        break;
      case 'ai-chatbot':
        navigate('/ai-chatbot');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: user?.displayName || user?.email || 'User',
      onClick: () => setProfileModalOpen(true)
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: 'Home'
    },
    {
      key: 'questionnaire',
      icon: <FormOutlined />,
      label: 'Health Assessment'
    },
    {
      key: 'ai-chatbot',
      icon: <RobotOutlined />,
      label: 'AI Assistant'
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        {/* Logo and App Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MessageOutlined style={{ color: 'white', fontSize: '20px' }} />
          </div>
          <Text style={{ 
            color: 'white', 
            fontSize: '20px', 
            fontWeight: 'bold',
            margin: 0
          }}>
            4Ms Health Assessment
          </Text>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{
            background: 'transparent',
            border: 'none',
            flex: 1,
            justifyContent: 'center',
            marginLeft: '40px'
          }}
          theme="dark"
        />

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button
              type="text"
              style={{ 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                height: 'auto',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
              onClick={() => setProfileModalOpen(true)}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />}
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              />
              <Text style={{ color: 'white', fontSize: '14px' }}>
                {user?.displayName || user?.email?.split('@')[0] || 'User'}
              </Text>
            </Button>
          </Dropdown>
        </div>
        <ProfileModal open={profileModalOpen} onClose={() => setProfileModalOpen(false)} user={user} />
      </Header>

      <Content style={{ 
        padding: '24px',
        background: '#f5f5f5',
        minHeight: 'calc(100vh - 64px)'
      }}>
        {children}
      </Content>
    </Layout>
  );
};

export default AppLayout; 