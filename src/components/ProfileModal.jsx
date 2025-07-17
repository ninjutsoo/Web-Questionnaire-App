import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { updateProfile, updateEmail, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const ProfileModal = ({ open, onClose, user }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [firestoreUser, setFirestoreUser] = useState(null);

  useEffect(() => {
    if (user && open) {
      // Load Firestore user doc if exists
      const fetchFirestoreUser = async () => {
        try {
          const docRef = doc(db, 'Users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFirestoreUser(docSnap.data());
          } else {
            setFirestoreUser(null);
          }
        } catch (e) {
          setFirestoreUser(null);
        }
      };
      fetchFirestoreUser();
    }
  }, [user, open]);

  useEffect(() => {
    if (user && open) {
      const [firstName, ...rest] = user.displayName ? user.displayName.split(' ') : [''];
      const lastName = rest.join(' ');
      form.setFieldsValue({
        firstName: firstName || '',
        lastName: lastName || '',
        email: user.email || '',
        phone: firestoreUser?.phone || user.phoneNumber || ''
      });
    }
  }, [user, firestoreUser, open, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      // Update display name
      const displayName = `${values.firstName} ${values.lastName}`.trim();
      if (displayName && displayName !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName });
      }
      // Update email with verification
      if (values.email && values.email !== user.email) {
        // Send verification email to the new address
        await sendEmailVerification(auth.currentUser, { url: window.location.origin });
        message.info('A verification email has been sent to your new address. Please verify it before changing your email.');
        setLoading(false);
        return;
      }
      // Update phone in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      await setDoc(userDocRef, { phone: values.phone, firstName: values.firstName, lastName: values.lastName }, { merge: true });
      message.success('Profile updated successfully!');
      onClose();
      window.location.reload();
    } catch (error) {
      message.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Edit Profile"
      onCancel={onClose}
      onOk={handleSave}
      confirmLoading={loading}
      okText="Save Changes"
      destroyOnClose
    >
      <Form form={form} layout="vertical" initialValues={{ firstName: '', lastName: '', email: '', phone: '' }}>
        <Form.Item label="First Name" name="firstName" rules={[{ required: true, message: 'Please enter your first name' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="lastName" rules={[{ required: true, message: 'Please enter your last name' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}> 
          <Input />
        </Form.Item>
        <Form.Item label="Phone" name="phone"> 
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ProfileModal; 