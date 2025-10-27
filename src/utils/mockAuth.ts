// Mock authentication for development/testing
// Username: 2dawng, Password: 1234

const MOCK_USER = {
    username: "2dawng",
    password: "1234",
    userId: 1,
    userName: "2dawng",
    roleId: 1,
    isAdmin: true,
    isActive: true,
};

// Generate a simple mock JWT token (for development only!)
const generateMockToken = (expiresIn = 3600) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
        JSON.stringify({
            user_id: MOCK_USER.userId,
            user_name: MOCK_USER.userName,
            role_id: MOCK_USER.roleId,
            is_admin: MOCK_USER.isAdmin,
            is_active: MOCK_USER.isActive,
            exp: Math.floor(Date.now() / 1000) + expiresIn, // Expires in 1 hour
        })
    );
    const signature = btoa("mock-signature");

    return `${header}.${payload}.${signature}`;
};

export const mockLogin = (
    username: string,
    password: string
): Promise<{ idToken: string; refreshToken: string }> => {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            if (username === MOCK_USER.username && password === MOCK_USER.password) {
                // Success - return tokens
                resolve({
                    idToken: generateMockToken(3600), // 1 hour
                    refreshToken: generateMockToken(86400), // 24 hours
                });
            } else {
                // Failed - wrong credentials
                reject({
                    response: {
                        status: 401,
                        data: {
                            detail: "Invalid username or password",
                        },
                    },
                });
            }
        }, 800); // 800ms delay to simulate real API
    });
};

export const mockRefreshToken = (): Promise<{ idToken: string; refreshToken: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                idToken: generateMockToken(3600),
                refreshToken: generateMockToken(86400),
            });
        }, 300);
    });
};
