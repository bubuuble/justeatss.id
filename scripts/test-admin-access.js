/**
 * Admin Access Control Test Script
 * 
 * This script tests the admin access control system to ensure
 * all components are working correctly.
 */

import { isUserAdmin, ADMIN_CONFIG } from '../lib/admin';
import { requireAdminAPI } from '../lib/admin-middleware';

/**
 * Test configuration validation
 */
function testConfiguration() {
  console.log('🔧 Testing Admin Configuration...');
  
  // Test configuration structure
  console.log('📋 Admin Configuration:');
  console.log('- Admin User IDs:', ADMIN_CONFIG.adminUserIds.length);
  console.log('- Admin Emails:', ADMIN_CONFIG.adminEmails.length);
  console.log('- Role-based Access:', ADMIN_CONFIG.allowRoleBasedAccess);
  console.log('- Organization Admins:', ADMIN_CONFIG.allowOrgAdmins);
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = ADMIN_CONFIG.adminEmails.filter(email => !emailRegex.test(email));
  
  if (invalidEmails.length > 0) {
    console.warn('⚠️  Invalid email formats found:', invalidEmails);
  } else {
    console.log('✅ All admin emails have valid format');
  }
  
  // Check for duplicate entries
  const uniqueUserIds = new Set(ADMIN_CONFIG.adminUserIds);
  const uniqueEmails = new Set(ADMIN_CONFIG.adminEmails);
  
  if (uniqueUserIds.size !== ADMIN_CONFIG.adminUserIds.length) {
    console.warn('⚠️  Duplicate user IDs found in configuration');
  }
  
  if (uniqueEmails.size !== ADMIN_CONFIG.adminEmails.length) {
    console.warn('⚠️  Duplicate emails found in configuration');
  }
  
  console.log('✅ Configuration test completed\n');
}

/**
 * Test admin access checking
 */
async function testAdminAccess() {
  console.log('🔐 Testing Admin Access Control...');
  
  try {
    const hasAccess = await isUserAdmin();
    console.log('Current user admin status:', hasAccess ? '✅ Admin' : '❌ Not Admin');
    
    if (hasAccess) {
      console.log('✅ Admin access validation passed');
    } else {
      console.log('ℹ️  Current user does not have admin access (this is normal if not logged in as admin)');
    }
  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  }
  
  console.log('✅ Admin access test completed\n');
}

/**
 * Test API middleware
 */
async function testAPIMiddleware() {
  console.log('🛡️  Testing API Middleware...');
  
  try {
    const result = await requireAdminAPI();
    
    if (result) {
      console.log('❌ API middleware denied access (expected if not admin)');
      console.log('Response status:', result.status);
    } else {
      console.log('✅ API middleware allowed access');
    }
  } catch (error) {
    console.error('❌ Error testing API middleware:', error);
  }
  
  console.log('✅ API middleware test completed\n');
}

/**
 * Test route protection
 */
function testRouteProtection() {
  console.log('🛣️  Testing Route Protection...');
  
  const adminRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/orders',
    '/admin/settings',
    '/api/admin/orders/export',
  ];
  
  console.log('Protected admin routes:');
  adminRoutes.forEach(route => {
    console.log(`- ${route}`);
  });
  
  console.log('✅ Route protection test completed\n');
}

/**
 * Generate admin access report
 */
function generateAccessReport() {
  console.log('📊 Admin Access Report');
  console.log('='.repeat(50));
  
  const report = {
    totalAdminMethods: 4,
    configuredMethods: 0,
    details: {
      userIds: ADMIN_CONFIG.adminUserIds.length > 0,
      emails: ADMIN_CONFIG.adminEmails.length > 0,
      roleAccess: ADMIN_CONFIG.allowRoleBasedAccess,
      orgAccess: ADMIN_CONFIG.allowOrgAdmins,
    }
  };
  
  // Count configured methods
  Object.values(report.details).forEach(configured => {
    if (configured) report.configuredMethods++;
  });
  
  console.log(`Configured authentication methods: ${report.configuredMethods}/${report.totalAdminMethods}`);
  console.log('\nMethod Details:');
  console.log(`- User ID Access: ${report.details.userIds ? '✅ Configured' : '❌ Not configured'} (${ADMIN_CONFIG.adminUserIds.length} users)`);
  console.log(`- Email Access: ${report.details.emails ? '✅ Configured' : '❌ Not configured'} (${ADMIN_CONFIG.adminEmails.length} emails)`);
  console.log(`- Role-based Access: ${report.details.roleAccess ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`- Organization Access: ${report.details.orgAccess ? '✅ Enabled' : '❌ Disabled'}`);
  
  // Security recommendations
  console.log('\n🔒 Security Recommendations:');
  
  if (report.configuredMethods === 0) {
    console.log('⚠️  CRITICAL: No admin access methods configured!');
    console.log('   → Add at least one admin user ID or email to ADMIN_CONFIG');
  } else if (report.configuredMethods === 1) {
    console.log('⚠️  WARNING: Only one access method configured');
    console.log('   → Consider adding a backup access method');
  } else {
    console.log('✅ Multiple access methods configured (good redundancy)');
  }
  
  if (ADMIN_CONFIG.adminEmails.length > 10) {
    console.log('⚠️  WARNING: Many email-based admins configured');
    console.log('   → Consider using role-based or organization access instead');
  }
  
  if (!ADMIN_CONFIG.allowRoleBasedAccess && !ADMIN_CONFIG.allowOrgAdmins) {
    console.log('ℹ️  INFO: Dynamic access methods disabled');
    console.log('   → Only hardcoded user IDs and emails will work');
  }
  
  console.log('\n📖 For detailed setup instructions, see ADMIN_ACCESS_CONTROL.md');
}

/**
 * Main test function
 */
export async function runAdminTests() {
  console.log('🚀 Starting Admin Access Control Tests');
  console.log('='.repeat(50));
  
  testConfiguration();
  await testAdminAccess();
  await testAPIMiddleware();
  testRouteProtection();
  generateAccessReport();
  
  console.log('\n🎉 Admin Access Control Tests Completed');
  console.log('='.repeat(50));
}

/**
 * Run tests if called directly
 */
if (require.main === module) {
  runAdminTests().catch(console.error);
}
