import React, { useState } from 'react';
import { Button, Card, Typography, Space, Alert, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { migrateUserData, previewMigration, verifyMigration } from '../services/dataMigration';

const { Title, Text, Paragraph } = Typography;

export default function Migration() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  const handlePreview = async () => {
    setLoading(true);
    try {
      const preview = await previewMigration();
      setPreviewData(preview);
      setResults({
        type: 'info',
        message: `Found ${preview.usersToMigrate} users with questionnaire data to migrate`
      });
    } catch (error) {
      setResults({
        type: 'error',
        message: `Preview failed: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMigration = async () => {
    setLoading(true);
    try {
      const result = await migrateUserData();
      if (result.success) {
        setResults({
          type: 'success',
          message: result.message
        });
      } else {
        setResults({
          type: 'error',
          message: result.message
        });
      }
    } catch (error) {
      setResults({
        type: 'error',
        message: `Migration failed: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const verification = await verifyMigration();
      setResults({
        type: verification.migrationComplete ? 'success' : 'warning',
        message: verification.migrationComplete 
          ? 'Migration completed successfully!' 
          : `Migration incomplete - ${verification.usersWithOldData} users still have old data`
      });
    } catch (error) {
      setResults({
        type: 'error',
        message: `Verification failed: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: '20px' }}>Data Migration Tool</Title>
      
      <Alert
        message="Migration Purpose"
        description="This tool migrates your existing questionnaire data from the old structure (stored in Users collection) to the new efficient structure (separate Questions and Answers collections)."
        type="info"
        style={{ marginBottom: '30px' }}
      />

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Preview Section */}
        <Card title="Step 1: Preview Migration Data" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Paragraph>
            Check what data will be migrated before running the actual migration.
          </Paragraph>
          <Button 
            type="default" 
            onClick={handlePreview}
            loading={loading}
          >
            Preview Migration Data
          </Button>
          
          {previewData && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <Text strong>Preview Results:</Text>
              <ul>
                <li>Total users in database: {previewData.totalUsers}</li>
                <li>Users with questionnaire data: {previewData.usersToMigrate}</li>
              </ul>
              {previewData.userDetails && previewData.userDetails.length > 0 && (
                <div>
                  <Text strong>Users to migrate:</Text>
                  <ul>
                    {previewData.userDetails.map((user, index) => (
                      <li key={index}>
                        {user.email} - {user.sectionsCompleted} sections completed
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Migration Section */}
        <Card title="Step 2: Run Migration" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Alert
            message="Important"
            description="This will move data from Users collection to the new Answers collection and remove old questionnaire data from Users. Make sure you've updated your Firebase security rules first!"
            type="warning"
            style={{ marginBottom: '15px' }}
          />
          <Paragraph>
            Run the actual data migration. This is safe to run multiple times.
          </Paragraph>
          <Button 
            type="primary" 
            onClick={handleMigration}
            loading={loading}
            disabled={!previewData || previewData.usersToMigrate === 0}
          >
            {loading ? 'Migrating...' : 'Run Migration'}
          </Button>
        </Card>

        {/* Verification Section */}
        <Card title="Step 3: Verify Migration" style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Paragraph>
            Verify that the migration completed successfully.
          </Paragraph>
          <Button 
            type="default" 
            onClick={handleVerify}
            loading={loading}
          >
            Verify Migration
          </Button>
        </Card>

        {/* Results */}
        {results && (
          <Alert
            message={results.type === 'success' ? 'Success' : 
                   results.type === 'warning' ? 'Warning' : 'Error'}
            description={results.message}
            type={results.type}
            showIcon
          />
        )}

        {loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '10px' }}>
              <Text>Processing... Check browser console for detailed logs</Text>
            </div>
          </div>
        )}
      </Space>
    </div>
  );
} 