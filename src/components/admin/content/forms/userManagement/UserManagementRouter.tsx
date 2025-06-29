
import React from 'react';
import { AdminListManagement } from './AdminListManagement';
import { UserAnalyticsContent } from './UserAnalyticsContent';
import { PermissionsManagementContent } from './PermissionsManagementContent';
import { RoleManagementContent } from './RoleManagementContent';
import { ActivityLogsContent } from './ActivityLogsContent';
import { ActivityReportsContent } from './ActivityReportsContent';
import { AccessControlContent } from './AccessControlContent';
import { UserOverviewContent } from './UserOverviewContent';
import { ActiveUsersContent } from './ActiveUsersContent';
import { InactiveUsersContent } from './InactiveUsersContent';
import { BannedUsersContent } from './BannedUsersContent';
import { UserVerificationContent } from './UserVerificationContent';
import { UserSettingsContent } from './UserSettingsContent';
import { RegistrationTrendsContent } from './RegistrationTrendsContent';
import { DemographicsContent } from './DemographicsContent';

interface UserManagementRouterProps {
  selectedSubmenu: string;
}

export const UserManagementRouter: React.FC<UserManagementRouterProps> = ({ selectedSubmenu }) => {
  console.log('🔍 UserManagementRouter - selectedSubmenu:', selectedSubmenu);
  
  switch (selectedSubmenu) {
    case 'admin-users':
    case 'admin-list':
      return <AdminListManagement />;
    case 'user-analytics':
      return <UserAnalyticsContent />;
    case 'user-permissions':
    case 'permissions':
      return <PermissionsManagementContent />;
    case 'role-management':
      return <RoleManagementContent />;
    case 'user-activity-logs':
    case 'activity-logs':
      return <ActivityLogsContent />;
    case 'user-reports':
    case 'activity-reports':
      return <ActivityReportsContent />;
    case 'access-control':
    case 'user-security':
      return <AccessControlContent />;
    case 'user-overview':
      return <UserOverviewContent />;
    case 'active-users':
      return <ActiveUsersContent />;
    case 'inactive-users':
      return <InactiveUsersContent />;
    case 'banned-users':
      return <BannedUsersContent />;
    case 'user-verification':
      return <UserVerificationContent />;
    case 'user-settings':
      return <UserSettingsContent />;
    case 'registration-trends':
      return <RegistrationTrendsContent />;
    case 'demographics':
    case 'user-demographics':
      return <DemographicsContent />;
    default:
      return <UserOverviewContent />;
  }
};
