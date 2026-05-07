-- SQL Script to Seed TestApi Users Table
-- Run this script against your TestApiDb database

-- Create Users table if it doesn't exist
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id int IDENTITY(1,1) PRIMARY KEY,
        Username nvarchar(50) NOT NULL UNIQUE,
        PasswordHash nvarchar(MAX) NOT NULL,
        Role nvarchar(20) NULL,
        CreatedAt datetime2 NOT NULL
    );
END
GO

-- Insert seed data (only if table is empty)
IF NOT EXISTS (SELECT TOP 1 * FROM Users)
BEGIN
    -- Admin user (password: Hello@123)
    INSERT INTO Users (Username, PasswordHash, Role, CreatedAt) 
    VALUES ('admin', '99f2bdf9942653ab32d9dfa0b43c72c3fbbb9679450fd965c590c224897b848a', 'Admin', GETUTCDATE());
    
    -- Regular user (password: User@123)
    INSERT INTO Users (Username, PasswordHash, Role, CreatedAt) 
    VALUES ('user', 'a5d2849f47f409e1067aa63222d6a0d3d3f0e6c7f01b0f4c4e4b88f5a5c3d3e', 'User', GETUTCDATE());
    
    PRINT 'Seed data inserted successfully!';
END
ELSE
BEGIN
    PRINT 'Users table already contains data. Skipping seed.';
END
GO

-- Verify
SELECT Id, Username, Role, CreatedAt FROM Users;
GO
