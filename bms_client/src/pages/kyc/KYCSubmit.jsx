// src/pages/kyc/KYCSubmit.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { kycAPI } from '../../api/kyc';
import { useAuth } from '../../hooks/useAuth';
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  message,
  Alert,
  Card,
  Spin,
  Typography
} from 'antd';
import {
  UploadOutlined,
  IdcardOutlined,
  CameraOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import './KYCSubmit.css';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const KYCSubmit = () => {
  const navigate = useNavigate();
  useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [existingKYC, setExistingKYC] = useState(null);
  const [fileListFront, setFileListFront] = useState([]);
  const [fileListBack, setFileListBack] = useState([]);
  const [fileListSelfie, setFileListSelfie] = useState([]);
  const [isFocused, setIsFocused] = useState({});
  const cardRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    checkExistingKYC();
    createParticles();
    
    // Add mousemove effect for 3D card
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateY = (x - centerX) / 25;
        const rotateX = (centerY - y) / 25;
        
        cardRef.current.style.transform = `
          translateY(-5px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      }
    };
    
    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'translateY(-5px) rotateX(0) rotateY(0)';
      }
    };

    if (cardRef.current) {
      cardRef.current.addEventListener('mousemove', handleMouseMove);
      cardRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const createParticles = () => {
    const particlesContainer = document.querySelector('.particles-3d');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 5; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particlesContainer.appendChild(particle);
    }
  };

  const checkExistingKYC = async () => {
    try {
      const response = await kycAPI.getKYCStatus();
      setExistingKYC(response.data);
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error('Failed to check KYC status:', err);
      }
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate file uploads
    if (fileListFront.length === 0 || fileListSelfie.length === 0) {
      setError('Please upload required document images');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('documentType', values.documentType);
      submitData.append('documentNumber', values.documentNumber);
      submitData.append('documentFrontImage', fileListFront[0].originFileObj);
      
      if (fileListBack.length > 0) {
        submitData.append('documentBackImage', fileListBack[0].originFileObj);
      }
      
      submitData.append('selfieImage', fileListSelfie[0].originFileObj);

      // Make the API call
      await kycAPI.submitKYC(submitData);
      
      if (existingKYC) {
        setSuccess('KYC resubmitted successfully! It will be reviewed shortly.');
        message.success('KYC resubmitted successfully!');
      } else {
        setSuccess('KYC submitted successfully! It will be reviewed shortly.');
        message.success('KYC submitted successfully!');
      }
      
      setTimeout(() => {
        navigate('/kyc/status');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to submit KYC. Please try again.';
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = (fieldName) => {
    setIsFocused(prev => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setIsFocused(prev => ({ ...prev, [fieldName]: false }));
  };

  // Upload props for Ant Design Upload component
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
      }
      return isImage && isLt5M ? false : Upload.LIST_IGNORE;
    },
    maxCount: 1,
    listType: "picture-card",
    accept: "image/*",
    onChange: (info) => {
      if (info.file.status === 'done') {
        // Add success animation class
        const uploadElement = document.getElementById(info.file.uid);
        if (uploadElement) {
          uploadElement.classList.add('upload-success');
          setTimeout(() => {
            uploadElement.classList.remove('upload-success');
          }, 600);
        }
      }
    }
  };

  return (
    <div className="kyc-submit-container">
      <div className="kyc-background-animation"></div>
      <div className="particles-3d" ref={particlesRef}></div>
      
      <div className="kyc-content-wrapper">
        <Card 
          className="kyc-form-card" 
          ref={cardRef}
          style={{ transition: 'transform 0.3s ease' }}
        >
          <div className="kyc-header">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              className="back-button"
            >
              Back
            </Button>
            <Title level={2} className="kyc-title">
              {existingKYC ? 'Resubmit KYC Documents' : 'Submit KYC Documents'}
            </Title>
            <Text className="kyc-subtitle">
              Complete your identity verification process
            </Text>
          </div>

          {existingKYC && existingKYC.status === 'APPROVED' && (
            <Alert
              message="KYC Already Approved"
              description="Your KYC is already approved. You cannot resubmit unless your status changes."
              type="info"
              showIcon
              className="kyc-alert"
            />
          )}

          {error && (
            <Alert
              message="Submission Error"
              description={error}
              type="error"
              showIcon
              className="kyc-alert"
            />
          )}

          {success && (
            <Alert
              message="Success"
              description={success}
              type="success"
              showIcon
              className="kyc-alert"
            />
          )}

          {existingKYC && existingKYC.status === 'REJECTED' && (
            <Alert
              message="Previous Submission Rejected"
              description={
                <>
                  <Paragraph>
                    Your previous KYC submission was rejected. Reason: {existingKYC.rejectionReason}
                  </Paragraph>
                  <Paragraph>
                    Please correct the issues and resubmit your documents.
                  </Paragraph>
                </>
              }
              type="warning"
              showIcon
              className="kyc-alert"
            />
          )}

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="kyc-form"
            initialValues={{
              documentType: 'AADHAAR'
            }}
          >
            <Form.Item
              name="documentType"
              label="Document Type"
              rules={[{ required: true, message: 'Please select a document type' }]}
              className={isFocused.documentType ? 'kyc-form-item-focus' : ''}
            >
              <Select 
                placeholder="Select document type"
                className="kyc-select"
                suffixIcon={<IdcardOutlined />}
                onFocus={() => handleFocus('documentType')}
                onBlur={() => handleBlur('documentType')}
              >
                <Option value="AADHAAR">Aadhaar Card</Option>
                <Option value="PAN">PAN Card</Option>
                <Option value="PASSPORT">Passport</Option>
                <Option value="DRIVING_LICENSE">Driving License</Option>
                <Option value="VOTER_ID">Voter ID</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="documentNumber"
              label="Document Number"
              rules={[{ required: true, message: 'Please enter your document number' }]}
              className={isFocused.documentNumber ? 'kyc-form-item-focus' : ''}
            >
              <Input 
                placeholder="Enter document number" 
                className="kyc-input"
                size="large"
                onFocus={() => handleFocus('documentNumber')}
                onBlur={() => handleBlur('documentNumber')}
              />
            </Form.Item>

            <Form.Item
              label="Document Front Image"
              required
              tooltip="Clear image of the front side of your document"
              className={fileListFront.length > 0 ? 'kyc-form-item-focus' : ''}
            >
              <Upload
                {...uploadProps}
                fileList={fileListFront}
                onChange={({ fileList }) => setFileListFront(fileList)}
                className="kyc-upload"
              >
                <Button icon={<UploadOutlined />} size="large">
                  Upload Front Image
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Document Back Image (Optional)"
              tooltip="Back side image if applicable"
              className={fileListBack.length > 0 ? 'kyc-form-item-focus' : ''}
            >
              <Upload
                {...uploadProps}
                fileList={fileListBack}
                onChange={({ fileList }) => setFileListBack(fileList)}
                className="kyc-upload"
              >
                <Button icon={<UploadOutlined />} size="large">
                  Upload Back Image
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Selfie with Document"
              required
              tooltip="Clear selfie holding your document"
              className={fileListSelfie.length > 0 ? 'kyc-form-item-focus' : ''}
            >
              <Upload
                {...uploadProps}
                fileList={fileListSelfie}
                onChange={({ fileList }) => setFileListSelfie(fileList)}
                className="kyc-upload"
              >
                <Button icon={<CameraOutlined />} size="large">
                  Upload Selfie
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                disabled={existingKYC && existingKYC.status === 'APPROVED'}
                icon={!loading && <CheckCircleOutlined />}
                className="kyc-submit-button"
                block
              >
                {loading ? <><LoadingOutlined /> Submitting...</> : existingKYC ? 'Resubmit KYC' : 'Submit KYC'}
              </Button>
            </Form.Item>
          </Form>

          <div className="kyc-footer">
            <Button 
              type="link" 
              onClick={() => navigate('/kyc/status')}
              className="status-link"
            >
              Check KYC Status
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default KYCSubmit;