export const API_PATHS = {
    // user 
    UPDATE_USER: '/api/user/update',
    INVITE_MEMBER: '/api/member/invite-member',
    RESEND_MEMBER_INVITATION: '/api/member/resend-invite',
    GET_MEMBERS: '/api/member/get-members',
    GET_PENDING_MEMBERS: '/api/invitation/get-pending-members',
    REVOKE_MEMBER_ACCESS: '/api/member/revoke-access',

    // stakeholder
    INVITE_STAKEHOLDER: '/api/stakeholder/invite-stakeholder',
    RESEND_STAKEHOLDER_INVITATION: '/api/stakeholder/resend-invite',
    ACCEPT_INVITATION: '/api/invitation/accept',

    // org
    CHECK_ORGANIZATION: '/api/organization/check-organization', //not used
    GET_ORGANIZATION: '/api/organization/get-organizations',
    SAVE_ORGANIZATION: '/api/organization/save-organization',
    
    // project
    ADD_PROJECT: '/api/project/add-project',
    GET_PROJECTS: '/api/project/get-projects',
    
    // bpmn
    SAVE_BPMN: '/api/bpmn/save-bpmn',
    GET_BPMN_FILES: '/api/bpmn/get-bpmn-files',
    GET_BPMN_STAKEHOLDERS: '/api/stakeholder/get-bpmn-stakeholders',
    GET_PENDING_BPMN_STAKEHOLDERS: '/api/invitation/get-pending-bpmn-stakeholders',
    REVOKE_STAKEHOLDER_BPMN_ACCESS: '/api/stakeholder/revoke-bpmn-access',

    // bpmn version
    GET_BPMN_VERSION: '/api/bpmn/get-bpmn-version',
    
};