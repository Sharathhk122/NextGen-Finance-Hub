// src/components/auth/RegisterForm.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  DatePicker, 
  Card, 
  Alert, 
  Radio, 
  Spin,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import { 
  UserOutlined, 
  MailOutlined, 
  LockOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  BankOutlined,
  IdcardOutlined,
  TeamOutlined
} from '@ant-design/icons';
import './RegisterForm.css';

const { Option } = Select;
const { Title, Text } = Typography;

const RegisterForm = () => {
  const [form] = Form.useForm();
  const [userType, setUserType] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const { registerCustomer, registerAdmin } = useAuth();
  const navigate = useNavigate();

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (selectedState && selectedCountry) {
      fetchCities(selectedCountry, selectedState);
    } else {
      setCities([]);
    }
  }, [selectedState, selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries');
      const data = await response.json();
      if (data.error === false) {
        setCountries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country }),
      });
      const data = await response.json();
      if (data.error === false && data.data && data.data.states) {
        setStates(data.data.states);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
      setStates([]);
    }
  };

  const fetchCities = async (country, state) => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country, state }),
      });
      const data = await response.json();
      if (data.error === false && data.data) {
        setCities(data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    }
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setError('');
    setSuccess('');
  };

  const onFinish = async (values) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      
      if (userType === 'customer') {
        result = await registerCustomer(values);
      } else {
        result = await registerAdmin(values);
      }

      if (result.status === 'success') {
        setSuccess(result.message);
        setTimeout(() => {
          navigate('/verify-email', { state: { email: values.email } });
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="animated-background">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
        <div className="shape shape4"></div>
        <div className="shape shape5"></div>
        <div className="shape shape6"></div>
        <div className="shape shape7"></div>
        <div className="shape shape8"></div>
        <div className="particles">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
        <div className="floating-orbs">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="floating-orb"></div>
          ))}
        </div>
        <div className="floating-cubes">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="floating-cube"></div>
          ))}
        </div>
        <div className="pulse-rings">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="pulse-ring"></div>
          ))}
        </div>
      </div>
      
      <Card 
        className="register-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="card-glow"></div>
        <div className="card-inner-glow"></div>
        <div className="card-sparkle-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="card-sparkle"></div>
          ))}
        </div>
        <div className="card-header">
          <Title level={2} className="animated-title">
            <span className="letter">R</span>
            <span className="letter">e</span>
            <span className="letter">g</span>
            <span className="letter">i</span>
            <span className="letter">s</span>
            <span className="letter">t</span>
            <span className="letter">e</span>
            <span className="letter">r</span>
          </Title>
          <Text className="subtitle">Create your account to get started</Text>
        </div>

        <div className="user-type-selector">
          <Radio.Group 
            value={userType} 
            onChange={(e) => handleUserTypeChange(e.target.value)}
            buttonStyle="solid"
            size="large"
          >
            <Radio.Button value="customer" className="user-type-btn">
              <UserOutlined /> Customer
            </Radio.Button>
            <Radio.Button value="admin" className="user-type-btn">
              <BankOutlined /> Admin
            </Radio.Button>
          </Radio.Group>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            className="alert-message"
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert
            message={success}
            type="success"
            showIcon
            className="alert-message"
          />
        )}

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          className="register-form"
          scrollToFirstError
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please input your full name!' }]}
              >
                <Input 
                  prefix={<UserOutlined className="input-icon" />} 
                  placeholder="Full Name" 
                  size="large"
                  className="three-d-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined className="input-icon" />} 
                  placeholder="Email" 
                  size="large"
                  className="three-d-input"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                  { min: 8, message: 'Password must be at least 8 characters!' }
                ]}
                hasFeedback
              >
                <Input.Password 
                  prefix={<LockOutlined className="input-icon" />} 
                  placeholder="Password" 
                  size="large"
                  className="three-d-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[{ required: true, message: 'Please input your phone number!' }]}
              >
                <Input 
                  prefix={<PhoneOutlined className="input-icon" />} 
                  placeholder="Phone Number" 
                  size="large"
                  className="three-d-input"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select your date of birth!' }]}
              >
                <DatePicker 
                  placeholder="Select date" 
                  size="large" 
                  style={{ width: '100%' }}
                  className="three-d-input"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="gender"
                label="Gender"
              >
                <Select placeholder="Select gender" size="large" className="three-d-input">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain className="divider-3d">
            <EnvironmentOutlined /> Address Information
          </Divider>

          <Form.Item
            name="streetAddress"
            label="Street Address"
          >
            <Input 
              prefix={<EnvironmentOutlined className="input-icon" />} 
              placeholder="Street Address" 
              size="large"
              className="three-d-input"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                name="country"
                label="Country"
              >
                <Select 
                  placeholder="Select country" 
                  size="large"
                  onChange={(value) => setSelectedCountry(value)}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  className="three-d-input"
                >
                  {countries.map((country) => (
                    <Option key={country.country} value={country.country}>
                      {country.country}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="state"
                label="State/Province"
              >
                <Select 
                  placeholder="Select state" 
                  size="large"
                  onChange={(value) => setSelectedState(value)}
                  disabled={!selectedCountry}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  className="three-d-input"
                >
                  {states.map((state) => (
                    <Option key={state.name} value={state.name}>
                      {state.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="city"
                label="City"
              >
                <Select 
                  placeholder="Select city" 
                  size="large"
                  disabled={!selectedState}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  notFoundContent={selectedState ? "Loading cities..." : "Select state first"}
                  className="three-d-input"
                >
                  {cities.map((city) => (
                    <Option key={city} value={city}>
                      {city}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="postalCode"
            label="Postal Code"
          >
            <Input 
              placeholder="Postal Code" 
              size="large"
              className="three-d-input"
            />
          </Form.Item>

          {userType === 'customer' && (
            <>
              <Divider orientation="left" plain className="divider-3d">
                <BankOutlined /> Account Information
              </Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="accountType"
                    label="Account Type"
                  >
                    <Select placeholder="Select account type" size="large" className="three-d-input">
                      <Option value="SAVINGS">Savings</Option>
                      <Option value="CURRENT">Current</Option>
                      <Option value="SALARY">Salary</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="initialDeposit"
                    label="Initial Deposit"
                  >
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01" 
                      placeholder="Initial Deposit" 
                      size="large"
                      addonAfter="$"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="occupation"
                label="Occupation"
              >
                <Input 
                  placeholder="Occupation" 
                  size="large"
                  className="three-d-input"
                />
              </Form.Item>

              <Divider orientation="left" plain className="divider-3d">
                <IdcardOutlined /> Identification Details
              </Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="aadharNumber"
                    label="Aadhar Number"
                  >
                    <Input 
                      placeholder="Aadhar Number" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="panNumber"
                    label="PAN Number"
                  >
                    <Input 
                      placeholder="PAN Number" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider orientation="left" plain className="divider-3d">
                <TeamOutlined /> Nominee Information
              </Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nomineeName"
                    label="Nominee Name"
                  >
                    <Input 
                      placeholder="Nominee Name" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="nomineeRelation"
                    label="Nominee Relation"
                  >
                    <Input 
                      placeholder="Nominee Relation" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          {userType === 'admin' && (
            <>
              <Divider orientation="left" plain className="divider-3d">
                <BankOutlined /> Admin Information
              </Divider>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="employeeId"
                    label="Employee ID"
                    rules={[{ required: true, message: 'Please input your employee ID!' }]}
                  >
                    <Input 
                      placeholder="Employee ID" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="designation"
                    label="Designation"
                    rules={[{ required: true, message: 'Please input your designation!' }]}
                  >
                    <Input 
                      placeholder="Designation" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="branchCode"
                    label="Branch Code"
                  >
                    <Input 
                      placeholder="Branch Code" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="branchName"
                    label="Branch Name"
                  >
                    <Input 
                      placeholder="Branch Name" 
                      size="large"
                      className="three-d-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="accessLevel"
                label="Access Level"
              >
                <Select placeholder="Select access level" size="large" className="three-d-input">
                  <Option value="SUPER_ADMIN">Super Admin</Option>
                  <Option value="BRANCH_ADMIN">Branch Admin</Option>
                  <Option value="SUPPORT">Support</Option>
                </Select>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="register-form-button"
              size="large"
              loading={loading}
              block
            >
              Register
            </Button>
          </Form.Item>
        </Form>

        <div className="login-redirect">
          <Text>Already have an account? </Text>
          <Link to="/login">Login here</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterForm;