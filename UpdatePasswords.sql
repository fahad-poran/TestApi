-- Update Password Hashes for TestApi Users
-- Run this script against TestApiDb database when SQL Server is running

-- Update admin user (password: Hello@123)
UPDATE Users 
SET PasswordHash = 'mfK9+ZQmU6sy2d+gtDxyw/u7lnlFD9llxZDCJIl7hIo='
WHERE Username = 'admin';

-- Update regular user (password: User@123)
UPDATE Users 
SET PasswordHash = 'PnwZV2SIhigW8TtRLKzz5LqX3ZckPqC9airRZC2GunI='
WHERE Username = 'user';

-- Verify the update
SELECT Id, Username, Role, LEFT(PasswordHash, 20) + '...' as PasswordHashPreview
FROM Users;

PRINT 'Password hashes updated successfully!';
GO
