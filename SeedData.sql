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
    -- Hash: SHA256("Hello@123") -> Base64
    INSERT INTO Users (Username, PasswordHash, Role, CreatedAt) 
    VALUES ('admin', 'mfK9+ZQmU6sy2d+gtDxyw/u7lnlFD9llxZDCJIl7hIo=', 'Admin', GETUTCDATE());
    
    -- Regular user (password: User@123)
    -- Hash: SHA256("User@123") -> Base64
    INSERT INTO Users (Username, PasswordHash, Role, CreatedAt) 
    VALUES ('user', 'PnwZV2SIhigW8TtRLKzz5LqX3ZckPqC9airRZC2GunI=', 'User', GETUTCDATE());
    
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
