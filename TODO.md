# TODO: Switch Host Pages from Mock to Real API Data

## Tasks
- [x] Fix HostLayout.tsx to use `currentUser?.userName` instead of `currentUser?.name`
- [x] Add `getFullProfile` function in authApi.ts for /api/v1/user/my-profile endpoint
- [x] Update HostSettingsPage.tsx to fetch real profile data on mount and populate form fields
- [x] Update TODO.md to mark completed tasks

## Details
- HostLayout currently shows "Host User" hardcoded - need to connect to Redux store
- HostSettingsPage uses mock data - need to fetch from /api/v1/user/my-profile API
- Backend APIs available: /auth/v1/me (basic info), /api/v1/user/my-profile (full profile)
- useAuthRestore hook should populate userName in Redux state
